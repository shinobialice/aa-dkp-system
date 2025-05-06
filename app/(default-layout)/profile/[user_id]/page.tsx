import ProfilePageWrapper from "@/src/components/profile/ProfilePageWrapper";

export default function Page({ params }: { params: { user_id: string } }) {
  return <ProfilePageWrapper userId={Number(params.user_id)} />;
}
