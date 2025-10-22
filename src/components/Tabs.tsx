const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  disabledTabs = [],
  renderContent,
  orientation = "horizontal",
}) => {
  const isVertical = orientation === "vertical";

  return (
    <div className={`flex ${isVertical ? "flex-row" : "flex-col"}`}>
      <div
        role="tablist"
        aria-orientation={isVertical ? "vertical" : "horizontal"}
        className={`${
          isVertical ? "flex flex-col w-40" : "mb-3"
        }`}
      >
        {/* Changed this line: added border-b and space-x-2, changed to inline-flex */}
        <div className="inline-flex space-x-2 border-b">
          {tabs.map((tab) => {
            const isDisabled = disabledTabs.includes(tab.key);
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={tab.key === activeTab}
                aria-disabled={isDisabled}
                className={`px-4 py-2 text-sm border-b-2 transition
                  ${isDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : tab.key === activeTab
                    ? "border-[#19376D] text-[#19376D]"
                    : "border-transparent text-gray-600 hover:text-[#1F3C72]"
                  }`}
                onClick={() => !isDisabled && onTabChange(tab.key)}
                disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full" role="tabpanel">
        {renderContent ? renderContent(activeTab) : null}
      </div>
    </div>
  );
};

export default Tabs;