import Link from "next/link";
import { User } from "lucide-react";
import { ClipboardList } from "lucide-react";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <Link href="/" className="font-semibold">
            Moventrac
          </Link>
          <div className="flex items-center gap-3">
            <Link className="text-sm text-gray-700" href="/profile">
              <div className="flex  flex-col items-center">
                <User /> Profile
              </div>
            </Link>
            <Link className="text-sm text-gray-700" href="/records">
              <div className="flex  flex-col items-center">
                <ClipboardList /> Records
              </div>
            </Link>
            <form action="/api/auth/logout" method="post">
              <button className="px-3 py-1.5 rounded-md border text-sm">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}
