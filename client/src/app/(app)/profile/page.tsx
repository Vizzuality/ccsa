import UserProfile from "@/containers/user-profile";

import PageTitle from "@/components/ui/page-title";

export const metadata = {
  title: "User Profile",
};

export default function ProfilePage() {
  return (
    <div className="relative z-10 h-full w-full bg-white">
      <div className="h-full overflow-auto">
        <PageTitle />
        <div className="space-y-5 px-5 pb-10 pt-[30px]">
          <h1 className="font-metropolis text-3xl tracking-tight text-gray-700">User Profile</h1>
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
