import React, { useState, useMemo } from 'react';

// --- INTERFACES & PLACEHOLDERS ---

// --- 1. Pricing Data Structures (Fitout Types Tab) ---
interface FitoutPriceEntry {
    [flatType: string]: number;
}

interface FitoutTypeData {
    id: number;
    fitoutType: string;
    prices: FitoutPriceEntry;
}

const flatTypeOptions: string[] = ["1 BHK", "2 BHK", "3 BHK", "STUDIO", "1 BHK RK", "2 BHK TERRACE", "1 BHK Again"];
const fitoutTypeOptions: string[] = ["Fitout-Type", "MOVE-IN"]; // Note: The UI shows "Standard Price" (image_2f4d00.png) which combines Fitout-Type + Move-in.
// REMOVED: const moveInTypeOptions: string[] = ["Standard Move-in", "Express Move-in", "Premium Move-in"];

// Updated initial state to remove dependency on move-in type
const initialFitoutTypesState: FitoutTypeData[] = [
    { id: 1, fitoutType: "Standard Price", prices: { "1 BHK": 120000, "2 BHK": 180000 } },
];


// --- 2. Category Data Structures (Category Tab) ---
interface CategoryEntry {
    id: number;
    category: string;
    subCategory: string;
    flatType: string;
    annexureFile: string;
}

const initialCategoryState: CategoryEntry[] = [
    { id: 1, category: "FITOUT", subCategory: "CIVIL", flatType: "2 BHK", annexureFile: "Annexure-2BHK.pdf" },
];

const mainCategoryOptions: string[] = ["FITOUT", "ELECTRICAL", "PLUMBING"];
const annexureOptions: string[] = ["Select Annexure", "2BHK-Annexure", "3BHK-Annexure"];


// --- 3. Status Data Structures (Status Tab) ---
interface StatusEntry {
    id: number;
    order: number;
    statusName: string;
    fixedState: string;
    color: string;
}

const fixedStateOptions: string[] = ["Select Fixed State", "New", "In Progress", "Completed", "Canceled"];

const initialStatusState: StatusEntry[] = [
    { id: 1, order: 1, statusName: "Pending", fixedState: "New", color: "#f06292" }, // Pink
    { id: 2, order: 2, statusName: "Fitout Request Received", fixedState: "In Progress", color: "#3ecf8e" }, // Green
];

// --- 4. Simple List Data Structures (Deviation Status Tab & Fitout Guide Tab) ---
interface FileEntry { srNo: number, fileName: string }
const initialFitoutGuideState: FileEntry[] = [{ srNo: 1, fileName: "Fit Out Manual Booklet" }];

const initialDeviationStatusState: StatusEntry[] = [
    { id: 1, order: 1, statusName: "Pending Deviation", fixedState: "New", color: "#f06292" },
    { id: 2, order: 2, statusName: "Deviation Request Received", fixedState: "In Progress", color: "#3ecf8e" },
];


// --- MAIN COMPONENT ---

const FitoutSetup: React.FC = () => {
    // State for the five sub-tabs
    const [activeSubTab, setActiveSubTab] = useState<'fitoutType' | 'category' | 'status' | 'guide' | 'deviation'>('fitoutType');
    
    // Core States
    const [fitoutTypes, setFitoutTypes] = useState<FitoutTypeData[]>(initialFitoutTypesState);
    const [categories, setCategories] = useState<CategoryEntry[]>(initialCategoryState);
    const [statuses, setStatuses] = useState<StatusEntry[]>(initialStatusState);
    const [fitoutGuideFiles, setFitoutGuideFiles] = useState<FileEntry[]>(initialFitoutGuideState);
    const [deviationStatuses, setDeviationStatuses] = useState<StatusEntry[]>(initialDeviationStatusState);

    // Form State for Fitout Types Tab
    const [newFitoutTypeData, setNewFitoutTypeData] = useState({
        fitoutTypeName: fitoutTypeOptions[0] || "",
        // REMOVED: moveInType: moveInTypeOptions[0] || "",
        flatType: flatTypeOptions[0] || "",
        price: "",
    });

    // Form State for Category Tab
    const [newCategoryData, setNewCategoryData] = useState({
        category: mainCategoryOptions[0] || "",
        subCategory: "",
        annexure: annexureOptions[0],
        flatType: flatTypeOptions[0] || "",
        fileName: "No file chosen",
    });
    
    // Form State for Status & Deviation Status Tabs
    const [newStatusData, setNewStatusData] = useState({
        order: '',
        statusName: '',
        fixedState: fixedStateOptions[0] || "",
        color: '#cccccc',
    });


    // --- HANDLERS (Completed/Cleaned up from your snippet) ---
    
    // Fitout Type Handlers
    const handleFitoutTypeFormChange = (field: string, value: string) => {
        setNewFitoutTypeData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddPrice = () => {
        const { fitoutTypeName, flatType, price } = newFitoutTypeData; // Removed moveInType

        // Updated validation
        if (!fitoutTypeName.trim() || !flatType) return alert("Select all required fields.");
        if (!price || isNaN(Number(price)) || Number(price) <= 0) return alert("Enter a valid positive Price.");

        const priceValue = Number(price);
        const uniqueFitoutName = fitoutTypeName.trim(); // Simplified to use only fitoutTypeName
        
        const existingFitoutTypeIndex = fitoutTypes.findIndex(ft => ft.fitoutType === uniqueFitoutName);

        if (existingFitoutTypeIndex > -1) {
            setFitoutTypes(prev => prev.map((item, index) => 
                index === existingFitoutTypeIndex ? { ...item, prices: { ...item.prices, [flatType]: priceValue } } : item
            ));
        } else {
            const newId = fitoutTypes.length > 0 ? Math.max(...fitoutTypes.map(ft => ft.id), 0) + 1 : 1;
            setFitoutTypes(prev => [...prev, { 
                id: newId, 
                fitoutType: uniqueFitoutName,
                prices: { [flatType]: priceValue } 
            }]);
        }
        setNewFitoutTypeData(prev => ({ ...prev, price: "" })); 
    };

    // Category Handlers
    const handleCategoryFormChange = (field: string, value: string) => {
        setNewCategoryData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleSaveCategory = () => {
        const { category, subCategory, flatType, annexure, fileName } = newCategoryData;

        if (!category || !subCategory.trim() || flatType === flatTypeOptions[0]) {
            return alert("Please select Category, enter Sub-category, and select Flat Type.");
        }
        
        // This is a simplified check. A full implementation would check for a duplicate association (Category + Sub-category + Flat Type)
        const isDuplicateAssociation = categories.some(c =>
            c.category === category &&
            c.subCategory.toLowerCase() === subCategory.trim().toLowerCase() &&
            c.flatType === flatType
        );

        if (isDuplicateAssociation) {
            return alert(`The combination of Category (${category}), Sub-category (${subCategory.trim()}), and Flat Type (${flatType}) already exists.`);
        }
        
        const newEntry: CategoryEntry = {
            id: categories.length > 0 ? Math.max(...categories.map(c => c.id), 0) + 1 : 1,
            category: category,
            subCategory: subCategory.trim(),
            flatType: flatType,
            annexureFile: annexure !== annexureOptions[0] ? annexure : (fileName === "No file chosen" ? "None" : fileName),
        };
        
        setCategories(prev => [...prev, newEntry]);
        alert("Category/Flat Type association saved!");
        // Clear subCategory and fileName for next entry, keeping others the same for rapid input
        setNewCategoryData(prev => ({ ...prev, subCategory: "", annexure: annexureOptions[0], fileName: "No file chosen" }));
    };

    const handleDeleteCategoryAssociation = (id: number) => {
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    // Status & Deviation Status Handlers (Combined logic)
    const handleStatusFormChange = (field: string, value: string) => {
        setNewStatusData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleAddStatus = (type: 'status' | 'deviation') => {
        const { order, statusName, fixedState, color } = newStatusData;
        const currentData = type === 'status' ? statuses : deviationStatuses;
        const setData = type === 'status' ? setStatuses : setDeviationStatuses;

        if (!order || !statusName.trim() || fixedState === fixedStateOptions[0]) {
            return alert("Please enter Order, Status, and select a Fixed State.");
        }
        
        const orderNumber = Number(order);
        if (isNaN(orderNumber) || orderNumber <= 0) return alert("Order must be a positive number.");
        if (currentData.some(s => s.order === orderNumber)) return alert("Order number must be unique.");
        
        const newEntry: StatusEntry = {
            id: currentData.length > 0 ? Math.max(...currentData.map(s => s.id), 0) + 1 : 1,
            order: orderNumber,
            statusName: statusName.trim(),
            fixedState: fixedState,
            color: color,
        };
        
        setData(prev => [...prev, newEntry].sort((a, b) => a.order - b.order));
        
        setNewStatusData({
            order: '',
            statusName: '',
            fixedState: fixedStateOptions[0] || "",
            color: '#cccccc',
        });
    };

    const handleDeleteStatus = (id: number, type: 'status' | 'deviation') => {
        const setData = type === 'status' ? setStatuses : setDeviationStatuses;
        setData(prev => prev.filter(s => s.id !== id).map((s, index) => ({ ...s, id: index + 1 }))); // Re-index for simplicity
    };

    const handleEditStatusField = (id: number, field: keyof StatusEntry, value: string | number, type: 'status' | 'deviation') => {
        const setData = type === 'status' ? setStatuses : setDeviationStatuses;
        
        setData(prev => prev.map(s => {
            if (s.id === id) {
                if (field === 'order') {
                    const numValue = Number(value);
                    if (!isNaN(numValue) && numValue > 0) {
                        return { ...s, [field]: numValue };
                    }
                    return s;
                }
                return { ...s, [field]: value };
            }
            return s;
        }).sort((a, b) => a.order - b.order));
    };

    // Guide File Handlers
    const handleFileUpload = (file: File) => {
        const newId = fitoutGuideFiles.length > 0 ? Math.max(...fitoutGuideFiles.map(f => f.srNo), 0) + 1 : 1;
        setFitoutGuideFiles(prev => [...prev, { srNo: newId, fileName: file.name }]);
        alert(`File uploaded: ${file.name}`);
    };

    const handleDeleteFile = (srNo: number) => {
        setFitoutGuideFiles(prev => prev.filter(f => f.srNo !== srNo).map((f, index) => ({ ...f, srNo: index + 1 })));
    };


    // --- MEMOIZED DATA FOR TABLES ---

    const pricingTableData = useMemo(() => {
        // Grouped rows are now simpler as the move-in type is gone
        const groupedRows = fitoutTypes.map(fitoutEntry => {
            return { 
                fitoutType: fitoutEntry.fitoutType, // Just the fitout type name
                prices: fitoutEntry.prices, 
                combinedKey: fitoutEntry.fitoutType 
            };
        });
        return { groupedRows };
    }, [fitoutTypes]);

    const categoryTableData = useMemo(() => {
        // Group by the main combination (Category + Sub-category)
        const grouped = categories.reduce((acc, entry) => {
            const key = `${entry.category} - ${entry.subCategory}`;
            if (!acc[key]) {
                acc[key] = { category: entry.category, subCategory: entry.subCategory, flatTypes: [], ids: [], annexureFile: entry.annexureFile };
            }
            acc[key].flatTypes.push(entry.flatType);
            // Store the ID of the specific association (e.g., FITOUT-CIVIL-2BHK)
            acc[key].ids.push(entry.id);
            return acc;
        }, {} as { [key: string]: { category: string, subCategory: string, flatTypes: string[], ids: number[], annexureFile: string } });
        
        // Transform for display: one row per category-subCategory, flatTypes are columns
        return Object.values(grouped).map(group => {
            const row: { [key: string]: any } = { 
                category: group.category, 
                subCategory: group.subCategory, 
                fullCategory: `${group.category} - ${group.subCategory}`, 
                flatTypeMap: {},
                annexureFile: group.annexureFile // Assuming one annexure file per Category-Subcategory pair for simplicity of display
            };
            
            flatTypeOptions.forEach(ft => {
                const associatedEntry = categories.find(c => 
                    c.category === group.category && 
                    c.subCategory === group.subCategory && 
                    c.flatType === ft
                );
                // The map stores the ID for easy deletion/unchecking
                row.flatTypeMap[ft] = associatedEntry ? associatedEntry.id : null;
            });
            return row;
        });
    }, [categories]);

    // --- RENDER ---

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Top Bar (Simplified, as the images show a dark header too) */}
            {/* <div className="bg-indigo-800 text-white p-4 rounded-t-lg mb-4 flex justify-between items-center">
                <div className="flex items-center">
                    <img src="placeholder-avatar.png" alt="User" className="w-8 h-8 rounded-full mr-2" />
                    <span className="font-bold text-lg">Vibe Connect</span>
                </div>
                <div>
                    <i className="icon-bell mr-4 cursor-pointer text-xl"></i>
                    <i className="icon-settings cursor-pointer text-xl"></i>
                </div>
            </div> */}

            {/* <div className="text-sm text-gray-500 mb-4">
                &lt;&lt; Setup / &lt;&lt; Fitout
            </div> */}

            {/* Main Tabs (Fitout Requests, Fitout Setup, etc.) */}
            {/* <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-8">
                    {['Fitout Requests', 'Fitout Setup', 'Fitout Checklists', 'Fitout Deviations', 'Fitout Reports'].map((label, index) => (
                        <a key={index} href="#" className={`py-2 px-3 text-sm font-medium border-b-2 transition duration-150 ${label.includes('Setup') ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                            {label}
                        </a>
                    ))}
                </nav>
            </div> */}

            <h1 className="text-xl font-bold text-gray-800 mb-6">Fitout Configuration Setup</h1>
            
            {/* Search and Export Bar (as seen in image_3eb9ba.png)
            <div className="flex mb-6">
                <input type="search" placeholder="Search..." className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-r-md font-medium hover:bg-indigo-700 transition duration-150">Export</button>
            </div> */}


            {/* Sub-Tab Navigation (Fitout Types, Category, etc.) */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    <SubTabButton label="Fitout Types" tabKey="fitoutType" activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />
                    <SubTabButton label="Category" tabKey="category" activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />
                    <SubTabButton label="Status" tabKey="status" activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />
                    <SubTabButton label="Fitout Guide" tabKey="guide" activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />
                    <SubTabButton label="Deviation Status" tabKey="deviation" activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />
                </nav>
            </div>


            {/* --- 1. Fitout Types Tab Content --- */}
            {activeSubTab === 'fitoutType' && (
                <FitoutPricingTab 
                    newFitoutTypeData={newFitoutTypeData}
                    handleFitoutTypeFormChange={handleFitoutTypeFormChange}
                    handleAddPrice={handleAddPrice}
                    tableData={pricingTableData}
                    setFitoutTypes={setFitoutTypes}
                    flatTypeOptions={flatTypeOptions}
                    fitoutTypeOptions={fitoutTypeOptions}
                    // REMOVED: moveInTypeOptions={moveInTypeOptions}
                />
            )}

            {/* --- 2. Category Tab Content --- */}
            {activeSubTab === 'category' && (
                <FitoutCategoryTab 
                    newCategoryData={newCategoryData}
                    handleCategoryFormChange={handleCategoryFormChange}
                    handleSaveCategory={handleSaveCategory}
                    handleDeleteCategoryAssociation={handleDeleteCategoryAssociation}
                    categoryTableData={categoryTableData}
                    mainCategoryOptions={mainCategoryOptions}
                    annexureOptions={annexureOptions}
                    flatTypeOptions={flatTypeOptions}
                />
            )}
            
            {/* --- 3. Status Tab Content --- */}
            {activeSubTab === 'status' && (
                <FitoutStatusTab 
                    statuses={statuses}
                    newStatusData={newStatusData}
                    fixedStateOptions={fixedStateOptions}
                    handleStatusFormChange={handleStatusFormChange}
                    handleAddStatus={() => handleAddStatus('status')}
                    handleDeleteStatus={(id) => handleDeleteStatus(id, 'status')}
                    handleEditStatusField={(id, field, value) => handleEditStatusField(id, field, value, 'status')}
                />
            )}

            {/* --- 4. Fitout Guide Tab Content --- */}
            {activeSubTab === 'guide' && (
                <GuideLinkTab 
                    fitoutGuideFiles={fitoutGuideFiles}
                    handleFileUpload={handleFileUpload}
                    handleDeleteFile={handleDeleteFile}
                />
            )}

            {/* --- 5. Deviation Status Tab Content --- */}
            {activeSubTab === 'deviation' && (
                <FitoutStatusTab 
                    statuses={deviationStatuses}
                    newStatusData={newStatusData}
                    fixedStateOptions={fixedStateOptions}
                    handleStatusFormChange={handleStatusFormChange}
                    handleAddStatus={() => handleAddStatus('deviation')}
                    handleDeleteStatus={(id) => handleDeleteStatus(id, 'deviation')}
                    handleEditStatusField={(id, field, value) => handleEditStatusField(id, field, value, 'deviation')}
                    isDeviation={true}
                />
            )}
        </div>
    );
};

export default FitoutSetup;


// ----------------------------------------------------------------------
// SUB-COMPONENTS 
// ----------------------------------------------------------------------

interface SubTabButtonProps {
    label: string;
    tabKey: 'fitoutType' | 'category' | 'status' | 'guide' | 'deviation';
    activeSubTab: string;
    setActiveSubTab: (key: any) => void;
}

const SubTabButton: React.FC<SubTabButtonProps> = ({ label, tabKey, activeSubTab, setActiveSubTab }) => (
    <button 
        onClick={() => setActiveSubTab(tabKey)} 
        className={`py-3 px-4 text-sm font-medium border-b-2 transition duration-150 ${activeSubTab === tabKey ? 'border-indigo-500 text-indigo-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
    >
        {label}
    </button>
);


// ----------------------------------------------------------------------
// 1. Fitout Pricing Tab Component (Fitout Types) - Minor updates for clarity
// ----------------------------------------------------------------------
interface FitoutPricingTabProps {
    newFitoutTypeData: any;
    handleFitoutTypeFormChange: (field: string, value: string) => void;
    handleAddPrice: () => void;
    tableData: any;
    setFitoutTypes: React.Dispatch<React.SetStateAction<FitoutTypeData[]>>;
    flatTypeOptions: string[];
    fitoutTypeOptions: string[];
    // REMOVED: moveInTypeOptions: string[];
}

const FitoutPricingTab: React.FC<FitoutPricingTabProps> = ({
    newFitoutTypeData, handleFitoutTypeFormChange, handleAddPrice, tableData, setFitoutTypes, flatTypeOptions
    // REMOVED: moveInTypeOptions
}) => {
    const [showForm, setShowForm] = useState(true);

    return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
        <button onClick={() => setShowForm(!showForm)} className={`px-4 py-2 mb-4 text-white rounded-md transition duration-150 shadow-md ${showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {showForm ? "Hide Form" : "Show Form"}
        </button>

        {showForm && (
            <div className="mb-8 p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-inner">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Add/Update Price for a Fitout Type</h3>
                <div className="flex items-end gap-3 text-sm flex-wrap">
                    
                    {/* Fitout Type Dropdown (Keeping this in for form completeness, though table simplifies it) */}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-600 mb-1">Fitout Type</span>
                        <select value={newFitoutTypeData.fitoutTypeName} onChange={e => handleFitoutTypeFormChange("fitoutTypeName", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-32 bg-white h-10 focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="Fitout-Type">Fitout-Type</option>
                        </select>
                    </div>

                    {/* REMOVED: Move-in Dropdown 
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-600 mb-1">Move-in</span>
                        <select value={newFitoutTypeData.moveInType} onChange={e => handleFitoutTypeFormChange("moveInType", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-32 bg-white h-10 focus:ring-indigo-500 focus:border-indigo-500">
                            {moveInTypeOptions.map((name, index) => (<option key={index} value={name}>{name}</option>))}
                        </select>
                    </div> */}

                    {/* Flat Type Input */}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-600 mb-1">Flat Type</span>
                        <select value={newFitoutTypeData.flatType} onChange={e => handleFitoutTypeFormChange("flatType", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-28 bg-white h-10 focus:ring-indigo-500 focus:border-indigo-500">
                            {flatTypeOptions.map((type, index) => (<option key={index} value={type}>{type}</option>))}
                        </select>
                    </div>

                    {/* Price Input and Button */}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-600 mb-1">Price</span>
                        <div className="flex items-center">
                            <span className="bg-gray-300 text-gray-700 h-10 px-2 py-2 border border-r-0 rounded-l flex items-center">₹</span>
                            <input type="number" placeholder="Price" min="0" value={newFitoutTypeData.price} onChange={e => handleFitoutTypeFormChange("price", e.target.value)} className="px-3 py-2 border rounded-none w-24 h-10 focus:ring-indigo-500 focus:border-indigo-500" />
                            <button onClick={handleAddPrice} className="px-4 py-2 bg-green-600 text-white h-10 hover:bg-green-700 transition duration-150">Add</button>
                        </div>
                    </div>

                    <button onClick={() => alert("Saving Fitout Types Data")} className="px-4 py-2 bg-indigo-600 text-white rounded-md h-10 hover:bg-indigo-700 transition duration-150 shadow-md ml-auto">Save All Changes</button>
                    <button onClick={() => setNewFitoutTypeData(prev => ({ ...prev, price: "" }))} className="px-4 py-2 bg-red-500 text-white rounded-md h-10 hover:bg-red-600 transition duration-150 shadow-md">Clear Form</button>
                </div>
            </div>
        )}
        
        {/* Price Table */}
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fitout Type</th> {/* Updated header for clarity */}
                        {flatTypeOptions.map(ft => (
                            <th key={ft} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{ft}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.groupedRows.length > 0 ? (
                        tableData.groupedRows.map((entry: any) => (
                            <tr key={entry.combinedKey} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <button className="text-blue-600 hover:text-blue-900 mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                    </button>
                                    <button onClick={() => setFitoutTypes(prev => prev.filter(ft => ft.fitoutType !== entry.combinedKey))} className="text-red-600 hover:text-red-900">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 100 2v6a1 1 0 100-2V8z" clipRule="evenodd" /></svg>
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {entry.fitoutType}
                                </td>
                                {flatTypeOptions.map(flatType => (
                                    <td key={flatType} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-center">
                                        {entry.prices[flatType] !== undefined ? entry.prices[flatType].toLocaleString('en-IN') : '—'}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={flatTypeOptions.length + 2} className="px-6 py-4 text-center text-sm text-gray-500">
                                No fitout types and prices have been added yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        <div className="mt-4 text-right text-sm text-gray-500">
            1-1 of {tableData.groupedRows.length} &lt; &gt;
        </div>
    </div>
    );
};


// ----------------------------------------------------------------------
// 2. Fitout Category Tab Component - FULLY IMPLEMENTED (Completing the table)
// ----------------------------------------------------------------------
interface FitoutCategoryTabProps {
    newCategoryData: any;
    handleCategoryFormChange: (field: string, value: string) => void;
    handleSaveCategory: () => void;
    handleDeleteCategoryAssociation: (id: number) => void;
    categoryTableData: any; // Use the memoized structure from main component
    mainCategoryOptions: string[];
    annexureOptions: string[];
    flatTypeOptions: string[];
}

const FitoutCategoryTab: React.FC<FitoutCategoryTabProps> = ({
    newCategoryData, handleCategoryFormChange, handleSaveCategory, handleDeleteCategoryAssociation, categoryTableData, mainCategoryOptions, annexureOptions, flatTypeOptions
}) => {
    const [showForm, setShowForm] = useState(true);

    const toggleFlatTypeAssociation = (row: any, flatType: string) => {
        const idToDelete = row.flatTypeMap[flatType];
        if (idToDelete) {
            handleDeleteCategoryAssociation(idToDelete);
        } else {
            // Re-run the save handler with the row's existing data and the new flatType
            alert(`Simulating adding association for ${row.fullCategory} to ${flatType}. Please use the form above.`);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleCategoryFormChange("fileName", file.name);
            // In a real app, you would upload the file and get a link/name for annexure here
        } else {
            handleCategoryFormChange("fileName", "No file chosen");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl">
            <button onClick={() => setShowForm(!showForm)} className={`px-4 py-2 mb-4 text-white rounded-md transition duration-150 shadow-md ${showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {showForm ? "Hide Form" : "Show Form"}
            </button>

            {showForm && (
                <div className="mb-8 p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-inner">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Define Category, Flat Type, and Annexure</h3>
                    <div className="flex items-end gap-4 text-sm flex-wrap">
                        
                        {/* Category Dropdown */}
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-600 mb-1">Category</span>
                            <select value={newCategoryData.category} onChange={e => handleCategoryFormChange("category", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-32 bg-white h-10 focus:ring-indigo-500 focus:border-indigo-500">
                                {mainCategoryOptions.map((name, index) => (<option key={index} value={name}>{name}</option>))}
                            </select>
                        </div>

                        {/* Sub-category Input */}
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-600 mb-1">Sub-category</span>
                            <input type="text" placeholder="Sub-category Name" value={newCategoryData.subCategory} onChange={e => handleCategoryFormChange("subCategory", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-40 h-10 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        {/* Flat Type Dropdown */}
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-600 mb-1">Flat Type</span>
                            <select value={newCategoryData.flatType} onChange={e => handleCategoryFormChange("flatType", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-28 bg-white h-10 focus:ring-indigo-500 focus:border-indigo-500">
                                {flatTypeOptions.map((type, index) => (<option key={index} value={type}>{type}</option>))}
                            </select>
                        </div>
                        
                        {/* Annexure File Dropdown/Upload */}
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-600 mb-1">Annexure File</span>
                            <div className="flex items-center">
                                <select value={newCategoryData.annexure} onChange={e => handleCategoryFormChange("annexure", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-l-md w-36 bg-white h-10 focus:ring-indigo-500 focus:border-indigo-500">
                                    {annexureOptions.map((name, index) => (<option key={index} value={name}>{name}</option>))}
                                </select>
                                <label className="flex items-center px-3 py-2 bg-indigo-500 text-white rounded-r-md cursor-pointer h-10 hover:bg-indigo-600 transition duration-150 text-sm">
                                    Upload
                                    <input type="file" onChange={handleFileChange} className="hidden" />
                                </label>
                            </div>
                            <span className="mt-1 text-xs text-gray-500 italic">{newCategoryData.fileName}</span>
                        </div>
                        
                        <button onClick={handleSaveCategory} className="px-6 py-2 bg-green-600 text-white rounded-md h-10 hover:bg-green-700 transition duration-150 shadow-md ml-auto">Save</button>
                        <button onClick={() => setNewCategoryData(prev => ({ ...prev, subCategory: "", annexure: annexureOptions[0], fileName: "No file chosen" }))} className="px-6 py-2 bg-red-500 text-white rounded-md h-10 hover:bg-red-600 transition duration-150 shadow-md">Clear</button>
                    </div>
                </div>
            )}

            {/* Category Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category / Sub-category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annexure File</th>
                            {flatTypeOptions.map(ft => (
                                <th key={ft} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{ft}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categoryTableData.length > 0 ? (
                            categoryTableData.map((row: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <button className="text-blue-600 hover:text-blue-900 mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {row.fullCategory}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 truncate max-w-xs">
                                        {row.annexureFile}
                                    </td>
                                    {flatTypeOptions.map(ft => (
                                        <td key={ft} className="px-2 py-4 whitespace-nowrap text-sm text-center">
                                            {/* Toggle Checkbox - Simulating deletion/addition */}
                                            <input
                                                type="checkbox"
                                                checked={!!row.flatTypeMap[ft]}
                                                onChange={() => toggleFlatTypeAssociation(row, ft)}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={flatTypeOptions.length + 3} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No categories or flat type associations have been defined yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-right text-sm text-gray-500">
                1-1 of {categoryTableData.length} &lt; &gt;
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// 3. Fitout Status / Deviation Status Tab Component - Reusable
// ----------------------------------------------------------------------
interface FitoutStatusTabProps {
    statuses: StatusEntry[];
    newStatusData: any;
    fixedStateOptions: string[];
    handleStatusFormChange: (field: string, value: string) => void;
    handleAddStatus: () => void;
    handleDeleteStatus: (id: number) => void;
    handleEditStatusField: (id: number, field: keyof StatusEntry, value: string | number) => void;
    isDeviation?: boolean;
}

const FitoutStatusTab: React.FC<FitoutStatusTabProps> = ({
    statuses, newStatusData, fixedStateOptions, handleStatusFormChange, handleAddStatus, handleDeleteStatus, handleEditStatusField, isDeviation = false
}) => {
    const [showForm, setShowForm] = useState(true);
    const title = isDeviation ? "Deviation Status Setup" : "Fitout Status Setup";
    const statusNameLabel = isDeviation ? "Deviation Status Name" : "Status Name";

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl">
            <button onClick={() => setShowForm(!showForm)} className={`px-4 py-2 mb-4 text-white rounded-md transition duration-150 shadow-md ${showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {showForm ? "Hide Form" : "Show Form"}
            </button>

            {showForm && (
                <div className="mb-8 p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-inner">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>
                    <div className="flex items-end gap-4 text-sm flex-wrap">
                        
                        {/* Order Input */}
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-600 mb-1">Order</span>
                            <input type="number" placeholder="Order" min="1" value={newStatusData.order} onChange={e => handleStatusFormChange("order", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-20 h-10 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        {/* Status Name Input */}
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-600 mb-1">{statusNameLabel}</span>
                            <input type="text" placeholder={statusNameLabel} value={newStatusData.statusName} onChange={e => handleStatusFormChange("statusName", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-48 h-10 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        
                        {/* Fixed State Dropdown */}
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-600 mb-1">Fixed State</span>
                            <select value={newStatusData.fixedState} onChange={e => handleStatusFormChange("fixedState", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-40 bg-white h-10 focus:ring-indigo-500 focus:border-indigo-500">
                                {fixedStateOptions.map((name, index) => (<option key={index} value={name}>{name}</option>))}
                            </select>
                        </div>
                        
                        {/* Color Picker */}
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-600 mb-1">Color</span>
                            <input type="color" value={newStatusData.color} onChange={e => handleStatusFormChange("color", e.target.value)} className="w-12 h-10 p-0 border-none bg-transparent cursor-pointer rounded-md" />
                        </div>

                        <button onClick={handleAddStatus} className="px-6 py-2 bg-green-600 text-white rounded-md h-10 hover:bg-green-700 transition duration-150 shadow-md ml-auto">Add</button>
                        <button onClick={() => setNewStatusData({ order: '', statusName: '', fixedState: fixedStateOptions[0] || "", color: '#cccccc' })} className="px-6 py-2 bg-red-500 text-white rounded-md h-10 hover:bg-red-600 transition duration-150 shadow-md">Clear</button>
                    </div>
                </div>
            )}

            {/* Status Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{statusNameLabel}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fixed State</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {statuses.length > 0 ? (
                            statuses.map((status) => (
                                <tr key={status.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <button onClick={() => handleDeleteStatus(status.id)} className="text-red-600 hover:text-red-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 100 2v6a1 1 0 100-2V8z" clipRule="evenodd" /></svg>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <input
                                            type="number"
                                            value={status.order}
                                            onChange={(e) => handleEditStatusField(status.id, 'order', e.target.value)}
                                            className="w-12 text-center border rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <input
                                            type="text"
                                            value={status.statusName}
                                            onChange={(e) => handleEditStatusField(status.id, 'statusName', e.target.value)}
                                            className="w-full border rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <select
                                            value={status.fixedState}
                                            onChange={(e) => handleEditStatusField(status.id, 'fixedState', e.target.value)}
                                            className="border rounded w-full"
                                        >
                                            {fixedStateOptions.map((name, index) => (<option key={index} value={name}>{name}</option>))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <div className="flex justify-center items-center">
                                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: status.color }}></div>
                                            <input
                                                type="color"
                                                value={status.color}
                                                onChange={(e) => handleEditStatusField(status.id, 'color', e.target.value)}
                                                className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer ml-2"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No {isDeviation ? 'deviation statuses' : 'statuses'} have been defined yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-right text-sm text-gray-500">
                1-1 of {statuses.length} &lt; &gt;
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// 4. Guide/Link Tab Component
// ----------------------------------------------------------------------

interface GuideLinkTabProps {
    fitoutGuideFiles: FileEntry[];
    handleFileUpload: (file: File) => void;
    handleDeleteFile: (srNo: number) => void;
}

const GuideLinkTab: React.FC<GuideLinkTabProps> = ({ fitoutGuideFiles, handleFileUpload, handleDeleteFile }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileUpload(file);
            event.target.value = ''; // Clear file input for re-uploading the same file
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="mb-8 p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-inner">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Upload Fitout Guide Files</h3>
                <div className="flex items-center gap-4 text-sm flex-wrap">
                    <label className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer h-10 hover:bg-indigo-700 transition duration-150 text-base shadow-md">
                        Upload Guide File
                        <input type="file" onChange={handleFileChange} className="hidden" />
                    </label>
                    <button onClick={() => alert("Simulating Link Upload")} className="px-6 py-2 bg-gray-500 text-white rounded-md h-10 hover:bg-gray-600 transition duration-150 shadow-md">Add External Link</button>
                </div>
            </div>

            {/* Files/Links Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File / Link Name</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {fitoutGuideFiles.length > 0 ? (
                            fitoutGuideFiles.map((file) => (
                                <tr key={file.srNo} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{file.srNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.fileName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <button onClick={() => alert(`Downloading ${file.fileName}`)} className="text-blue-600 hover:text-blue-900 mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" /><path fillRule="evenodd" d="M10 2a1 1 0 011 1v7a1 1 0 11-2 0V3a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                        </button>
                                        <button onClick={() => handleDeleteFile(file.srNo)} className="text-red-600 hover:text-red-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 100 2v6a1 1 0 100-2V8z" clipRule="evenodd" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No guide files or links have been added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-right text-sm text-gray-500">
                1-1 of {fitoutGuideFiles.length} &lt; &gt;
            </div>
        </div>
    );
};