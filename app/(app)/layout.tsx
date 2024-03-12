import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/nav-bar";
import Sidebar from "@/components/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 md:p-8 pt-2 p-8 overflow-y-auto">
          <Navbar />
          {children}
        </main>
      </div>
      <Toaster richColors />
    </main>
  );
}
