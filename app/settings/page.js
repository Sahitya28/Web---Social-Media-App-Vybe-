import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import AvatarUpload from "../../components/AvatarUpload";
import UsernameForm from "../../components/UsernameForm";
import PasswordForm from "../../components/PasswordForm";
import DeleteAccountSection from "../../components/DeleteAccountSection";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold gradient-text mb-2">Settings</h1>

      <div className="card p-4">
        <h2 className="font-medium mb-3">Profile photo</h2>
        <AvatarUpload />
      </div>

      <div className="card p-4">
        <h2 className="font-medium mb-3">Username</h2>
        <UsernameForm currentUsername={session.user.username} />
      </div>

      <div className="card p-4">
        <h2 className="font-medium mb-3">Password</h2>
        <PasswordForm />
      </div>

      <div className="card p-4 border-red-500/30">
        <h2 className="font-medium text-red-400 mb-1">Danger zone</h2>
        <p className="text-xs text-vybe-muted mb-3">
          Deleting your account permanently removes your posts, comments, and reactions.
          Any communities you created will be deleted too, along with everyone else&apos;s
          posts inside them.
        </p>
        <DeleteAccountSection />
      </div>
    </div>
  );
}
