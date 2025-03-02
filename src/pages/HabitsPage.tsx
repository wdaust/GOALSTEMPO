import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import HabitSection from "@/components/habits/HabitSection";

const HabitsPage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Spiritual Habits</h1>
            <p className="text-muted-foreground">
              Track and maintain your spiritual habits to grow in faith.
            </p>
            <HabitSection />
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
};

export default HabitsPage;
