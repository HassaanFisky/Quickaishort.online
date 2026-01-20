import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary/30">
      <Sidebar />
      <main className="flex-1 bg-background pt-4 md:pt-0 px-4 md:px-0 md:pl-24 md:pr-4 pb-24 md:pb-0">
        {children}
      </main>
      <div className="md:pl-24 pb-20 md:pb-0">
        <Footer />
      </div>
    </div>
  );
}
