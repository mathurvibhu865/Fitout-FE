import React, { useState, useMemo, useCallback, useEffect } from 'react';


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
const fitoutTypeOptions: string[] = ["Fitout", "MOVE-IN"]; 

const initialFitoutTypesState: FitoutTypeData[] = [
    { id: 1, fitoutType: "Fitout", prices: { "1 BHK": 120000, "2 BHK": 180000 } },
];


// --- 2. Category Data Structures (Category Tab) ---
interface CategoryEntry {
    id: number;
    // --- START OF MODIFIED SECTION IN INTERFACE ---
    fitoutType: string; // NEW FIELD: Added Fitout/Move-in Type
    // --- END OF MODIFIED SECTION IN INTERFACE ---
    category: string;
    subCategory: string;
    flatType: string;
    annexureFile: string;
}

const annexureOptions: string[] = ["Select Annexure", "2BHK-Annexure", "3BHK-Annexure"];

// The initialCategoryState is an empty array to remove pre-filled rows.
const initialCategoryState: CategoryEntry[] = []; 


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
    // const [isLoading, setLoading] = useState(false); // OPTIONAL: Loading state for API calls

    // DYNAMIC CATEGORY OPTIONS STATE - INITIALIZED TO EMPTY ARRAY
    // This state holds all available categories and is initially an empty array.
    const [mainCategoryOptions, setMainCategoryOptions] = useState<string[]>([]);
    
    // **NEW: Simulate fetching dynamic categories on mount**
    useEffect(() => {
        // In a real application, you would make an API call here.
        
        // --- SIMULATED DYNAMIC DATA (Removed ELECTRICAL, PLUMBING to be fully dynamic) ---
        // The only initial category is "FITOUT" for the simulation, or an empty array []
        const fetchedCategories: string[] = ["FITOUT"]; // Data fetched from server
        // Initializing the state with the fetched data
        setMainCategoryOptions(fetchedCategories.sort());
        
        // Also update the form state to select the first category
        setNewCategoryData(prev => ({ 
            ...prev, 
            // Set default category to the first fetched category, or empty string if none
            category: fetchedCategories.length > 0 ? fetchedCategories.sort()[0] : "" 
        }));
        
    }, []);
    
    // Form State for Fitout Types Tab
    const [newFitoutTypeData, setNewFitoutTypeData] = useState({
        fitoutTypeName: fitoutTypeOptions[0] || "",
        flatType: flatTypeOptions[0] || "",
        price: "",
    });

    // Form State for Category Tab
    const [newCategoryData, setNewCategoryData] = useState({
        // --- START OF MODIFIED SECTION IN FORM STATE ---
        fitoutType: fitoutTypeOptions[0] || "", // NEW FIELD: Default to the first fitoutType
        // --- END OF MODIFIED SECTION IN FORM STATE ---
        // Set default category to empty string, it will be updated in the useEffect above
        category: "", 
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


    // --- HANDLERS ---
    
    // Fitout Type Handlers (Unchanged)
    const handleFitoutTypeFormChange = (field: string, value: string) => {
        setNewFitoutTypeData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddPrice = () => {
        const { fitoutTypeName, flatType, price } = newFitoutTypeData; 

        if (!fitoutTypeName.trim() || !flatType) return alert("Select all required fields.");
        if (!price || isNaN(Number(price)) || Number(price) <= 0) return alert("Enter a valid positive Price.");

        const priceValue = Number(price);
        const uniqueFitoutName = fitoutTypeName.trim();
        
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

    // This is the logic that ensures new categories are added dynamically
    const handleAddNewCategory = useCallback((newCategory: string) => {
        const formattedCategory = newCategory.toUpperCase().trim();
        if (formattedCategory && !mainCategoryOptions.includes(formattedCategory)) {
            // Add the new category and keep the list sorted
            setMainCategoryOptions(prev => [...prev, formattedCategory].sort());
            // Set the new category as the selected value
            setNewCategoryData(prev => ({ ...prev, category: formattedCategory }));
            return formattedCategory;
        }
        // If it's empty or a duplicate, return the current/original category
        return formattedCategory || newCategoryData.category;
    }, [mainCategoryOptions, setNewCategoryData, newCategoryData.category]);
    
    /**
     * The unified function to handle validation, duplication check, and the API call.
     */
    const handleSaveCategory = async () => {
        // --- START OF MODIFIED SECTION IN HANDLER ---
        const { fitoutType, category, subCategory, flatType } = newCategoryData;

        // --- 1. Validation and Duplication Check ---
        if (!fitoutType || !category || !subCategory.trim() || !flatType) {
            return alert("Please select Fitout Type, Category, enter Sub-category, and select Flat Type.");
        }
        
        const isDuplicateAssociation = categories.some(c =>
            c.fitoutType === fitoutType && // Check new field
            c.category === category &&
            c.subCategory.toLowerCase() === subCategory.trim().toLowerCase() &&
            c.flatType === flatType
        );

        if (isDuplicateAssociation) {
            return alert(`The combination of Fitout Type (${fitoutType}), Category (${category}), Sub-category (${subCategory.trim()}), and Flat Type (${flatType}) already exists.`);
        }
        
        // --- 2. Prepare Data for API ---
        const newEntry: CategoryEntry = {
            // ID is generated locally for immediate display, but should ideally come from the server
            id: categories.length > 0 ? Math.max(...categories.map(c => c.id), 0) + 1 : 1, 
            fitoutType: fitoutType, // Add new field
            category: category,
            subCategory: subCategory.trim(),
            flatType: flatType,
            annexureFile: newCategoryData.annexure !== annexureOptions[0] 
                ? newCategoryData.annexure 
                : (newCategoryData.fileName === "No file chosen" ? "None" : newCategoryData.fileName),
        };
        // --- END OF MODIFIED SECTION IN HANDLER ---

        // setLoading(true); // Optional: Start loading indicator
        
        try {
            // --- 3. Make the API call ---
            const response = await fetch('/api/categories', { // <<< CHECK/UPDATE YOUR ACTUAL API ENDPOINT
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${yourToken}`,
                },
                body: JSON.stringify(newEntry)
            });

            // --- 4. Handle non-OK responses ---
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Server error with status ${response.status}` }));
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            // --- 5. Success State Update ---
            // If the API returns the final entry (e.g., with the definitive ID), use that instead of newEntry.
            setCategories(prev => [...prev, newEntry]); 

            // Reset the form data
            setNewCategoryData(prev => ({ 
                ...prev, 
                // Don't reset fitoutType, category, flatType as they often remain the same for bulk entry
                subCategory: "", 
                annexure: annexureOptions[0], 
                fileName: "No file chosen" 
            }));
            
            alert("Category/Flat Type association saved!");

        } catch (error: any) {
            // 6. Handle errors
            console.error("Failed to save category association:", error);
            alert(`Failed to save association: ${error.message}`);

        } finally {
            // setLoading(false); // Optional: Stop loading indicator
        }
    };


    const handleDeleteCategoryAssociation = (id: number) => {
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    // Status & Deviation Status Handlers (Unchanged)
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
        if (isNaN(orderNumber) || orderNumber <= 0) return alert("Order number must be a positive number.");
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
        setData(prev => prev.filter(s => s.id !== id).map((s, index) => ({ ...s, id: index + 1 })));
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

    // Guide File Handlers (Unchanged)
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
        const groupedRows = fitoutTypes.map(fitoutEntry => {
            return { 
                fitoutType: fitoutEntry.fitoutType, 
                prices: fitoutEntry.prices, 
                combinedKey: fitoutEntry.fitoutType 
            };
        });
        return { groupedRows };
    }, [fitoutTypes]);

    const categoryTableData = useMemo(() => {
        const grouped = categories.reduce((acc, entry) => {
            // --- START OF MODIFIED SECTION IN MEMO ---
            // Key now relies on the combination of Fitout Type, Category, and SubCategory
            const key = `${entry.fitoutType} - ${entry.category} - ${entry.subCategory}`;
            if (!acc[key]) {
                acc[key] = { 
                    fitoutType: entry.fitoutType, // Include new field
                    category: entry.category, 
                    subCategory: entry.subCategory, 
                    flatTypes: [], 
                    ids: [], 
                    annexureFile: entry.annexureFile 
                };
            }
            acc[key].flatTypes.push(entry.flatType);
            acc[key].ids.push(entry.id);
            return acc;
        }, {} as { [key: string]: { fitoutType: string, category: string, subCategory: string, flatTypes: string[], ids: number[], annexureFile: string } });
        // --- END OF MODIFIED SECTION IN MEMO ---
        
        return Object.values(grouped).map(group => {
            const row: { [key: string]: any } = { 
                fitoutType: group.fitoutType, // Include new field
                category: group.category, 
                subCategory: group.subCategory, 
                flatTypeMap: {},
                annexureFile: group.annexureFile
            };
            
            flatTypeOptions.forEach(ft => {
                const associatedEntry = categories.find(c => 
                    c.fitoutType === group.fitoutType && // Check new field
                    c.category === group.category && 
                    c.subCategory === group.subCategory && 
                    c.flatType === ft
                );
                row.flatTypeMap[ft] = associatedEntry ? associatedEntry.id : null;
            });
            return row;
        });
    }, [categories]);

    // --- RENDER ---

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            
            <h1 className="text-xl font-bold text-gray-800 mb-6">Fitout Configuration Setup</h1>
            
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
                />
            )}

            {/* --- 2. Category Tab Content --- */}
            {activeSubTab === 'category' && (
                <FitoutCategoryTab 
                    newCategoryData={newCategoryData}
                    handleCategoryFormChange={handleCategoryFormChange}
                    handleSaveCategory={handleSaveCategory} // *** Now calls the API logic ***
                    handleDeleteCategoryAssociation={handleDeleteCategoryAssociation}
                    categoryTableData={categoryTableData}
                    mainCategoryOptions={mainCategoryOptions} // Dynamic state passed here
                    handleAddNewCategory={handleAddNewCategory} 
                    annexureOptions={annexureOptions}
                    flatTypeOptions={flatTypeOptions}
                    fitoutTypeOptions={fitoutTypeOptions} // PASS NEW PROP
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
// DYNAMIC COMPONENT: Select with Input Field for Adding New Option
// ----------------------------------------------------------------------
interface DynamicSelectWithInputProps {
    label: string;
    value: string;
    options: string[];
    onSelectChange: (value: string) => void;
    onAddNew: (newValue: string) => string;
}

const DynamicSelectWithInput: React.FC<DynamicSelectWithInputProps> = ({
    label, value, options, onSelectChange, onAddNew
}) => {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newInputValue, setNewInputValue] = useState('');

    const SAVE_NEW_OPTION = '__ADD_NEW__';

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === SAVE_NEW_OPTION) {
            setIsAddingNew(true);
            // Don't change the main value yet, keep the previous one or default
            onSelectChange(options.includes(value) ? value : options[0] || ''); 
        } else {
            setIsAddingNew(false);
            onSelectChange(e.target.value);
        }
    };

    const handleInputSave = () => {
        const trimmedValue = newInputValue.trim();
        if (trimmedValue) {
            // onAddNew adds the value to options and returns the formatted value
            const addedValue = onAddNew(trimmedValue);
            onSelectChange(addedValue); 
            setNewInputValue('');
            setIsAddingNew(false);
        } else {
            alert(`Please enter a valid ${label} name.`);
        }
    };

    return (
        <div className="flex flex-col">
            <span className="font-medium text-gray-600 mb-1">{label}</span>
            {isAddingNew ? (
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder={`Enter New ${label}`}
                        value={newInputValue}
                        onChange={e => setNewInputValue(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-l-md w-32 h-10 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                    <button
                        onClick={handleInputSave}
                        className="px-3 py-2 bg-green-600 text-white rounded-r-md h-10 hover:bg-green-700 transition duration-150 text-sm"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => { setIsAddingNew(false); setNewInputValue(''); }}
                        className="px-2 py-2 bg-red-500 text-white rounded-md h-10 hover:bg-red-600 transition duration-150 text-sm"
                    >
                        X
                    </button>
                </div>
            ) : (
                <select 
                    value={value} 
                    onChange={handleSelectChange} 
                    className="px-3 py-2 border border-gray-300 rounded-md w-36 bg-white h-10 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                    {/* Ensure current value is in options list, otherwise add a temporary option for it */}
                    {options.filter(o => o === value || o !== '__ADD_NEW__').map((name, index) => (
                        <option key={index} value={name} disabled={name === '' && index > 0}>
                            {name || 'Select Category'}
                        </option>
                    ))}
                    <option value={SAVE_NEW_OPTION} className="font-bold text-indigo-600">
                        + Add New...
                    </option>
                </select>
            )}
        </div>
    );
};


// ----------------------------------------------------------------------
// 1. Fitout Pricing Tab Component (Fitout Types) - Unchanged
// ----------------------------------------------------------------------
interface FitoutPricingTabProps {
    newFitoutTypeData: any;
    handleFitoutTypeFormChange: (field: string, value: string) => void;
    handleAddPrice: () => void;
    tableData: any;
    setFitoutTypes: React.Dispatch<React.SetStateAction<FitoutTypeData[]>>;
    flatTypeOptions: string[];
    fitoutTypeOptions: string[];
}

const FitoutPricingTab: React.FC<FitoutPricingTabProps> = ({
    newFitoutTypeData, handleFitoutTypeFormChange, handleAddPrice, tableData, setFitoutTypes, flatTypeOptions, fitoutTypeOptions
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
                    
                    {/* Fitout Type Dropdown */}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-600 mb-1">Fitout/Move-in Type</span>
                        <select value={newFitoutTypeData.fitoutTypeName} onChange={e => handleFitoutTypeFormChange("fitoutTypeName", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-36 bg-white h-10 focus:ring-indigo-500 focus:border-indigo-500"> 
                            {fitoutTypeOptions.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fitout/Move-in Type</th> 
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
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 00-1-1h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" /></svg>
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.fitoutType}</td>
                                {flatTypeOptions.map(ft => (
                                    <td key={ft} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        {entry.prices[ft] ? `₹${entry.prices[ft].toLocaleString()}` : '-'}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={flatTypeOptions.length + 2} className="px-6 py-4 text-center text-sm text-gray-500">
                                No fitout types found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
    );
};


// ----------------------------------------------------------------------
// 2. Category Tab Component (Category)
// ----------------------------------------------------------------------
interface FitoutCategoryTabProps {
    newCategoryData: any;
    handleCategoryFormChange: (field: string, value: string) => void;
    handleSaveCategory: () => Promise<void>;
    handleDeleteCategoryAssociation: (id: number) => void;
    categoryTableData: any[];
    mainCategoryOptions: string[];
    handleAddNewCategory: (newCategory: string) => string;
    annexureOptions: string[];
    flatTypeOptions: string[];
    fitoutTypeOptions: string[];
}

const FitoutCategoryTab: React.FC<FitoutCategoryTabProps> = ({
    newCategoryData, handleCategoryFormChange, handleSaveCategory, handleDeleteCategoryAssociation, categoryTableData, mainCategoryOptions, handleAddNewCategory, annexureOptions, flatTypeOptions, fitoutTypeOptions
}) => {
    
    // For file upload simulation
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleCategoryFormChange("fileName", file.name);
            // Reset Annexure selection when a file is chosen
            handleCategoryFormChange("annexure", annexureOptions[0]);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="mb-8 p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-inner">
                <h3 className="text-lg font-bold mb-4 text-gray-800">New Category/Flat Type Association</h3>
                <div className="flex items-end gap-4 text-sm flex-wrap">
                    
                    {/* Fitout/Move-in Type Dropdown (NEW FIELD) */}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-600 mb-1">Fitout/Move-in Type</span>
                        <select value={newCategoryData.fitoutType} onChange={e => handleCategoryFormChange("fitoutType", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-36 bg-white h-10 focus:ring-indigo-500 focus:border-indigo-500"> 
                            {fitoutTypeOptions.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                
                    {/* Category Dropdown (Dynamically populated with 'Add New' functionality) */}
                    <DynamicSelectWithInput
                        label="Category"
                        value={newCategoryData.category}
                        options={mainCategoryOptions}
                        onSelectChange={(value) => handleCategoryFormChange("category", value)}
                        onAddNew={handleAddNewCategory}
                    />

                    {/* Sub-Category Input */}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-600 mb-1">Sub-Category</span>
                        <input type="text" placeholder="Sub-Category Name" value={newCategoryData.subCategory} onChange={e => handleCategoryFormChange("subCategory", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-36 h-10 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    {/* Flat Type Dropdown */}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-600 mb-1">Flat Type</span>
                        <select value={newCategoryData.flatType} onChange={e => handleCategoryFormChange("flatType", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-28 bg-white h-10 focus:ring-indigo-500 focus:border-indigo-500">
                            {flatTypeOptions.map((type, index) => (<option key={index} value={type}>{type}</option>))}
                        </select>
                    </div>

                    {/* Annexure Dropdown */}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-600 mb-1">Annexure</span>
                        <select value={newCategoryData.annexure} onChange={e => handleCategoryFormChange("annexure", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-36 bg-white h-10 focus:ring-indigo-500 focus:border-indigo-500">
                            {annexureOptions.map((option, index) => (<option key={index} value={option}>{option}</option>))}
                        </select>
                    </div>

                    {/* File Upload */}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-600 mb-1">File Upload</span>
                        <div className="flex items-center space-x-2">
                            <label className="cursor-pointer px-4 py-2 bg-indigo-500 text-white rounded-md h-10 hover:bg-indigo-600 transition duration-150 shadow-md text-sm">
                                Choose File
                                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                            </label>
                            <span className="text-gray-500 whitespace-nowrap overflow-hidden max-w-[100px] text-ellipsis">{newCategoryData.fileName}</span>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button onClick={handleSaveCategory} className="px-4 py-2 bg-green-600 text-white rounded-md h-10 hover:bg-green-700 transition duration-150 shadow-md">Save</button>
                </div>
            </div>
        
            {/* Category/Flat Type Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* NEW COLUMN: FITOUT TYPE */}
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fitout Type</th> 
                            
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub-Category</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annexure/File</th>
                            {flatTypeOptions.map(ft => (
                                <th key={ft} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{ft}</th>
                            ))}
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categoryTableData.length > 0 ? (
                            categoryTableData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {/* NEW ROW DATA: FITOUT TYPE */}
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{row.fitoutType}</td> 

                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.category}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{row.subCategory}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{row.annexureFile}</td>
                                    {flatTypeOptions.map(ft => (
                                        <td key={ft} className="px-4 py-4 whitespace-nowrap text-center text-sm">
                                            {row.flatTypeMap[ft] !== null ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    ✓
                                                </span>
                                            ) : '-'}
                                        </td>
                                ))}
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-medium">
                                    {/* Delete button is simplified: just deletes the first ID found for that row */}
                                    <button onClick={() => handleDeleteCategoryAssociation(row.flatTypeMap[flatTypeOptions.find((ft: string) => row.flatTypeMap[ft] !== null) as string])} className="text-red-600 hover:text-red-900 mx-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 00-1-1h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" /></svg>
                                    </button>
                                </td>
                                
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={flatTypeOptions.length + 5} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No Category associations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// 3 & 5. Status Tab Component (Status & Deviation Status) - Unchanged
// ----------------------------------------------------------------------
interface FitoutStatusTabProps {
    statuses: StatusEntry[];
    newStatusData: any;
    fixedStateOptions: string[];
    handleStatusFormChange: (field: string, value: string) => void;
    handleAddStatus: () => void;
    handleDeleteStatus: (id: number) => void;
    handleEditStatusField: (id: number, field: keyof StatusEntry, value: string | number, type: 'status' | 'deviation') => void;
    isDeviation?: boolean;
}

const FitoutStatusTab: React.FC<FitoutStatusTabProps> = ({
    statuses, newStatusData, fixedStateOptions, handleStatusFormChange, handleAddStatus, handleDeleteStatus, handleEditStatusField, isDeviation = false
}) => {

    const type = isDeviation ? 'deviation' : 'status';

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="mb-8 p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-inner">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Add New {isDeviation ? 'Deviation' : ''} Status</h3>
                <div className="flex items-end gap-3 text-sm flex-wrap">
                    
                    {/* Order Input */}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-600 mb-1">Order</span>
                        <input type="number" placeholder="Order No." min="1" value={newStatusData.order} onChange={e => handleStatusFormChange("order", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-24 h-10 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    {/* Status Name Input */}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-600 mb-1">Status Name</span>
                        <input type="text" placeholder="e.g. Approved" value={newStatusData.statusName} onChange={e => handleStatusFormChange("statusName", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-36 h-10 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    {/* Fixed State Dropdown */}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-600 mb-1">Fixed State</span>
                        <select value={newStatusData.fixedState} onChange={e => handleStatusFormChange("fixedState", e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md w-36 bg-white h-10 focus:ring-indigo-500 focus:border-indigo-500">
                            {fixedStateOptions.map((state, index) => (<option key={index} value={state} disabled={index === 0}>{state}</option>))}
                        </select>
                    </div>

                    {/* Color Picker */}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-600 mb-1">Color</span>
                        <input type="color" value={newStatusData.color} onChange={e => handleStatusFormChange("color", e.target.value)} className="w-10 h-10 border border-gray-300 rounded-md p-0" title="Select a color" />
                    </div>

                    {/* Add Button */}
                    <button onClick={handleAddStatus} className="px-4 py-2 bg-green-600 text-white rounded-md h-10 hover:bg-green-700 transition duration-150 shadow-md">Add</button>
                </div>
            </div>

            {/* Status Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fixed State</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {statuses.length > 0 ? (
                            statuses.map((status) => (
                                <tr key={status.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <input 
                                            type="number" 
                                            min="1" 
                                            value={status.order} 
                                            onChange={e => handleEditStatusField(status.id, 'order', e.target.value, type)}
                                            className="w-12 text-center border-gray-300 rounded-md text-sm"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <input 
                                            type="text" 
                                            value={status.statusName} 
                                            onChange={e => handleEditStatusField(status.id, 'statusName', e.target.value, type)}
                                            className="w-full border-gray-300 rounded-md text-sm"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <select 
                                            value={status.fixedState} 
                                            onChange={e => handleEditStatusField(status.id, 'fixedState', e.target.value, type)}
                                            className="w-full border-gray-300 rounded-md text-sm"
                                        >
                                            {fixedStateOptions.filter((_, index) => index > 0).map((state, index) => (
                                                <option key={index} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: status.color, color: '#FFFFFF', textShadow: '0 0 2px #000000' }}>
                                            {status.statusName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                                        <input 
                                            type="color" 
                                            value={status.color} 
                                            onChange={e => handleEditStatusField(status.id, 'color', e.target.value, type)}
                                            className="w-6 h-6 border-gray-300 rounded-full p-0 mr-2 inline-block cursor-pointer"
                                            title="Change Color"
                                        />
                                        <button onClick={() => handleDeleteStatus(status.id)} className="text-red-600 hover:text-red-900 mx-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 00-1-1h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No {isDeviation ? 'deviation' : ''} statuses found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// 4. Guide Link Tab Component (Fitout Guide) - Unchanged
// ----------------------------------------------------------------------
interface GuideLinkTabProps {
    fitoutGuideFiles: FileEntry[];
    handleFileUpload: (file: File) => void;
    handleDeleteFile: (srNo: number) => void;
}

const GuideLinkTab: React.FC<GuideLinkTabProps> = ({
    fitoutGuideFiles, handleFileUpload, handleDeleteFile
}) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="mb-8 p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-inner flex items-end space-x-4">
                <h3 className="text-lg font-bold text-gray-800">Upload Fitout Manual/Guide</h3>
                <input type="file" ref={fileInputRef} className="hidden" onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                        handleFileUpload(e.target.files[0]);
                        e.target.value = ''; // Reset input so same file can be uploaded again
                    }
                }} accept=".pdf,.doc,.docx" />
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-indigo-600 text-white rounded-md h-10 hover:bg-indigo-700 transition duration-150 shadow-md text-sm">
                    Choose File
                </button>
            </div>

            {/* File List Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {fitoutGuideFiles.length > 0 ? (
                            fitoutGuideFiles.map((file) => (
                                <tr key={file.srNo} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{file.srNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <a href="#" className="text-blue-600 hover:text-blue-900">{file.fileName}</a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-2" title="Download">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" /><path fillRule="evenodd" d="M10 2a1 1 0 011 1v7a1 1 0 11-2 0V3a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                        </button>
                                        <button onClick={() => handleDeleteFile(file.srNo)} className="text-red-600 hover:text-red-900" title="Delete">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 00-1-1h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No files found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};