import { Layout, LayoutContent, LayoutHeader } from "@/features/page/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AnnouncementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <LayoutHeader>
        <div className="mb-6">
          <Button variant="ghost" className="pl-0 text-[#444141]" asChild>
            <Link href="/announcements">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la carte
            </Link>
          </Button>
        </div>
      </LayoutHeader>
      <LayoutContent>
        <div className="flex">
          {/* Left Sidebar with Steps */}
          <div className="w-24 mr-8">
            <div className="flex flex-col items-center space-y-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  1
                </div>
                <span className="text-xs mt-1 text-center">Annonce</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#e2e8f0] flex items-center justify-center text-[#444141] font-bold">
                  2
                </div>
                <span className="text-xs mt-1 text-center">En cours</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#e2e8f0] flex items-center justify-center text-[#444141] font-bold">
                  3
                </div>
                <span className="text-xs mt-1 text-center">Review</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{children}</div>
        </div>
      </LayoutContent>
    </Layout>
  );
}
