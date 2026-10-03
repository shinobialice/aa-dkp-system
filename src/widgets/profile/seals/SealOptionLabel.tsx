import { SEAL_INFO, SEAL_ROLE_COLORS } from "./sealsData";

export default function SealOptionLabel({ name }: { name: string }) {
  const info = SEAL_INFO[name as keyof typeof SEAL_INFO];
  if (!info) return name;
  return (
    <>
      {name} — {info.playstyle} (
      {info.roles.map((role, i) => (
        <span key={role}>
          {i > 0 && ", "}
          <span style={{ color: SEAL_ROLE_COLORS[role] }}>{role}</span>
        </span>
      ))}
      )
    </>
  );
}
