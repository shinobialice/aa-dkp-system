import type { NextApiRequest, NextApiResponse } from "next";
import { parse, serialize } from "cookie";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function generateSessionToken() {
	return crypto.randomBytes(32).toString("hex");
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { code, state, device_id } = req.query;

	if (
		typeof code !== "string" ||
		typeof state !== "string" ||
		typeof device_id !== "string"
	) {
		return res.status(400).send("Missing query params");
	}

	const cookies = parse(req.headers.cookie || "");
	const savedState = cookies.vk_state;
	const codeVerifier = cookies.vk_code_verifier;
	const linkToken = cookies["link-token"];

	if (!savedState || !codeVerifier || state !== savedState) {
		return res.status(400).send("Invalid state or verifier");
	}

	const tokenRes = await fetch("https://id.vk.ru/oauth2/auth", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "authorization_code",
			client_id: process.env.VK_CLIENT_ID!,
			redirect_uri: "https://aa-dkp-system.vercel.app/api/auth/vk/callback",
			code,
			code_verifier: codeVerifier,
			device_id,
		}),
	});

	const tokenData = await tokenRes.json();

	if (!tokenData.access_token) {
		return res
			.status(400)
			.json({ error: "Token exchange failed", data: tokenData });
	}

	const userInfoRes = await fetch("https://id.vk.ru/oauth2/user_info", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			access_token: tokenData.access_token,
			client_id: process.env.VK_CLIENT_ID!,
		}),
	});

	const { user } = await userInfoRes.json();

	if (linkToken) {
		const { data: linkRow } = await supabase
			.from("link_token")
			.select("userId")
			.eq("token", linkToken)
			.eq("used", false)
			.gt("expiresAt", new Date().toISOString())
			.single();

		if (!linkRow) {
			return res.status(400).send("Link token expired or invalid");
		}

		const sessionToken = generateSessionToken();

		// 🔗 Привязываем VK к существующему пользователю и сохраняем session_token
		const { error: userUpdateError } = await supabase
			.from("user")
			.update({
				vk_id: user.user_id,
				session_token: sessionToken,
			})
			.eq("id", linkRow.userId);

		if (userUpdateError) {
			console.error("Ошибка при обновлении пользователя:", userUpdateError);
			return res.status(500).send("Failed to link VK account");
		}

		await supabase
			.from("link_token")
			.update({ used: true })
			.eq("token", linkToken);

		res.setHeader("Set-Cookie", [
			serialize("link-token", "", { path: "/", maxAge: -1 }),
			serialize("session_token", sessionToken, {
				path: "/",
				httpOnly: true,
				secure: true,
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 7,
			}),
		]);

		return res.redirect("/link-account/complete");
	}

	const sessionToken = generateSessionToken();

	const { data: existingUser } = await supabase
		.from("user")
		.select("*")
		.eq("vk_id", user.user_id)
		.single();

	let userId: number;

	if (!existingUser) {
		return res.redirect("/login-error");
	} else {
		await supabase
			.from("user")
			.update({ session_token: sessionToken })
			.eq("id", existingUser.id);

		userId = existingUser.id;
	}

	const cookie = serialize("session_token", sessionToken, {
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7,
	});

	res.setHeader("Set-Cookie", cookie);

	res.redirect("/");
}
