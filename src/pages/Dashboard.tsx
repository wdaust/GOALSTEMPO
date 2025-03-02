import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import HabitSection from "@/components/habits/HabitSection";
import GoalSection from "@/components/goals/GoalSection";
import PartnerSection from "@/components/accountability/PartnerSection";
import JournalSection from "@/components/journal/JournalSection";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
          <div className="max-w-7xl mx-auto space-y-6">
            <DashboardSummary />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HabitSection />
              <GoalSection />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PartnerSection />
              <JournalSection />
            </div>
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
};

export default Dashboard;
