import { useState } from "react";
import { Bell, Settings } from "lucide-react"; // Icons
import Tabs from "../components/Tabs";
import FitoutRequest from "../tabs/Fitout/FitoutRequest";
import FitoutDeviations from "../tabs/Fitout/FitoutDeviations";
import FitoutChecklists from "../tabs/Fitout/FitoutChecklists";
import FitoutReports from "../tabs/Fitout/FitoutReports";
import FitoutSetup from "../tabs/Fitout/FitoutSetup";
import Breadcrumb, { type BreadcrumbItem } from "../components/Breadcrumb";

// Header component
const Header = () => {
  return (
    <header className="w-full bg-blue-900 text-white flex items-center justify-between px-6 py-3 rounded-b-2xl shadow-md">
      {/* Left side - Logo/Title */}
      <div className="flex items-center gap-3">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Logo"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-lg font-semibold">Vibe Connect</span>
      </div>

      {/* Right side - Icons */}
      <div className="flex items-center gap-4">
        <button className="hover:bg-blue-800 p-2 rounded-full transition">
          <Bell className="w-5 h-5" />
        </button>
        <button className="hover:bg-blue-800 p-2 rounded-full transition">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

const Fitout = () => {
  const [activeTab, setActiveTab] = useState<string | number>("Fitout Requests");

  // Breadcrumb configuration
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Setup", href: "#" },
    { label: "Fitout", href: "#" }
  ];

  const tabLabels = [
    "Fitout Requests",
    "Fitout Setup",
    "Fitout Checklists",
    "Fitout Deviations",
    "Fitout Reports"
  ];

  const tabItems = tabLabels.map(label => ({
    label,
    key: label
  }));

  const renderTabComponent = (tab: string | number) => {
    switch (tab) {
      case "Fitout Requests":
        return <FitoutRequest />;
      case "Fitout Deviations":
        return <FitoutDeviations />;
      case "Fitout Checklists":
        return <FitoutChecklists />;
      case "Fitout Reports":
        return <FitoutReports />;
      case "Fitout Setup":
        return <FitoutSetup />;
      default:
        return <div>No content available for {tab}</div>;
    }
  };

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    console.log("Navigating to:", item.href);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="p-4 flex-1">
        <Breadcrumb
          items={breadcrumbItems}
          current="Fitout"
          onClick={handleBreadcrumbClick}
        />
        <Tabs
          tabs={tabItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          renderContent={renderTabComponent}
          orientation="horizontal"
        />
      </div>
    </div>
  );
};

export default Fitout;