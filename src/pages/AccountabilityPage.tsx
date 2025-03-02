import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import PartnerSection from "@/components/accountability/PartnerSection";

const AccountabilityPage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Accountability Partners</h1>
            <p className="text-muted-foreground">
              Connect with others to encourage each other in your spiritual
              goals.
            </p>
            <PartnerSection />
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
};

export default AccountabilityPage;
