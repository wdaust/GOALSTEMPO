import React from "react";
import { Helmet } from "react-helmet";

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>TruthGoals - Spiritual Goal & Habit Tracker</title>
      </Helmet>
      <div className="min-h-screen">
        <iframe
          src="/index.html"
          className="w-full h-screen border-0"
          title="TruthGoals Landing Page"
        />
      </div>
    </>
  );
};

export default LandingPage;
