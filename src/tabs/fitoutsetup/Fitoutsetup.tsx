// import React, { useState } from 'react';
// import Tabs from '../../components/Tabs';
// import Phase from './Phase'; 
// import Category from './Category'
// import Status from './Status'
// import FitoutGuide from './Fitoutguide'
// import Deviation from './Deviation'



// const setupTabs = [ 
//   { label: 'Phase', key: 'phase' },
//   { label: 'Category', key: 'category' },
//   { label: 'Status', key: 'status' },
//   { label: 'Fitout Guide', key: 'guide' },
//   { label: 'Deviations Status', key: 'deviations' },
// ];

// const FitoutSetup: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<string | number>('phase');

//   const renderTabContent = (key: string | number) => {
//     switch (key) {
//       case 'phase':
//         return <Phase />;
//       case 'category':
//         return <Category />
//       case 'status':
//         return <Status />
//       case 'guide':
//         return <FitoutGuide />
//       case 'deviations':
//         return <Deviation />
//       default:
//         return null;
//     }
//   };

//   return (
//     <Tabs
//       tabs={setupTabs}
//       activeTab={activeTab}
//       onTabChange={setActiveTab}
//       renderContent={renderTabContent}
//     />
//   );
// };

// export default FitoutSetup;




import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import TableHead from "../../components/TopHead";
import IconButton from "../../components/IconButton";
import Tabs from "../../components/Tabs";
import TopBar from "../../components/TopBar";
import { FiTrash2, FiEdit } from "react-icons/fi";

import {
    getStatuses,
    postStatus,
    deleteStatus,
    getFitoutCategories,
    createFitoutCategory,
    updateFitoutCategory,
    deleteFitoutCategory,
    uploadCategoryAnnexure,
    deleteCategoryAnnexure,
    getAnnexures,
} from "../../api/endpoint";

// =================================================================
//                          INTERFACES & PLACEHOLDERS
// =================================================================

interface FitoutTypeItem {
    id: number;
    fitoutType: string;
    // We keep 'prices' as it's used by the 'Add Price' form logic
    prices: { [flatType: string]: number | null }; 
    // Add subcategory data to the FitoutTypeItem for display
    subcategory?: string; 
}

interface FitoutCategory {
    id: number;
    name: string;
    subcategory?: string;
    description?: string;
    fitout_annexures?: any[];
}

const flatTypeOptions: string[] = [
    "2BHK", "3BHK", "4BHK", "Flat RK Duplex", "Flat 1 Rk Villa", "2 Bhk Apartment"
];

const initialFitoutTypes: FitoutTypeItem[] = [
    { 
        id: 1, 
        fitoutType: "FITOUT", 
        subcategory: "Default Subcategory 1", // Added for demonstration
        prices: { 
            "1 BHK": 10000, 
            "2 BHK": 15000, 
            "1 BHK RK": 12000, 
            "2 BHK TERRIS": 20000,
            "1 BHK Again": 9000, 
        } 
    },
    { 
        id: 2, 
        fitoutType: "INTERIOR", 
        subcategory: "Default Subcategory 2", // Added for demonstration
        prices: { 
            "1 BHK": 20000, 
        } 
    },
];

// Placeholder for initial categories data
const initialCategories: FitoutCategory[] = [
    { id: 101, name: '999', subcategory: 'ss' },
    { id: 102, name: 'iiii', subcategory: 'tt' },
    { id: 103, name: 'unmm', subcategory: 'oio' },
    { id: 104, name: 'yyyy', subcategory: 'ppp' },
];

// =================================================================
//                           MAIN COMPONENT
// =================================================================

const FitoutSetup: React.FC = () => {
    // ------------------------- STATE MANAGEMENT -------------------------

    const [categories, setCategories] = useState<FitoutCategory[]>(initialCategories); 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("category"); 

    // Category Tab States
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
    const [categoryFormData, setCategoryFormData] = useState({ name: "", subcategory: "" });

    // Fitout Types Tab States
    const [fitoutTypes, setFitoutTypes] = useState<FitoutTypeItem[]>(initialFitoutTypes);
    const [showFitoutTypeForm, setShowFitoutTypeForm] = useState(false); 
    const [newFitoutTypeData, setNewFitoutTypeData] = useState({
        fitoutType: "FITOUT",
        flatType: flatTypeOptions[0] || "",
        price: "",
    });
    
    // Placeholder data
    const [statusItems] = useState([]);


    // ------------------------- FILTERS & PAGINATION -------------------------

    const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredFitoutTypes = fitoutTypes.filter(ft => ft.fitoutType.toLowerCase().includes(searchTerm.toLowerCase()));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; 

    const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
    const currentFitoutTypes = filteredFitoutTypes.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const fitoutTypeTotalPages = Math.ceil(filteredFitoutTypes.length / itemsPerPage);


    // ------------------------- HANDLERS (Simplified) -------------------------

    // Category Handlers (Placeholder implementations)
    const handleCategoryFormChange = (field: keyof typeof categoryFormData, value: string) => { setCategoryFormData(prev => ({ ...prev, [field]: value })); };
    const resetCategoryForm = () => { setCategoryFormData({ name: "", subcategory: "" }); setEditCategoryId(null); setShowCategoryForm(false); };
    const handleSaveCategory = async () => { 
        if (!categoryFormData.name.trim()) return alert("Category name required"); 
        /* Simulated Save/Update Logic: */ 
        if (editCategoryId) {
            setCategories(prev => prev.map(c => c.id === editCategoryId ? { ...c, name: categoryFormData.name, subcategory: categoryFormData.subcategory } : c));
        } else {
            const newId = Math.max(...categories.map(c => c.id), 0) + 1;
            setCategories(prev => [...prev, { id: newId, name: categoryFormData.name, subcategory: categoryFormData.subcategory }]);
        }
        resetCategoryForm(); 
    };
    const handleEditCategory = (category: FitoutCategory) => { setCategoryFormData({ name: category.name, subcategory: category.subcategory || "" }); setEditCategoryId(category.id); setShowCategoryForm(true); };
    const handleDeleteCategory = async (id: number) => { if (!confirm("Delete this category?")) return; setCategories(prev => prev.filter(c => c.id !== id)); };

    // Fitout Type Handlers (Placeholder implementations)
    const handleFitoutTypeFormChange = (field: keyof typeof newFitoutTypeData, value: string) => { 
        setNewFitoutTypeData(prev => ({ ...prev, [field]: value })); 
    };
    
    const resetFitoutTypeForm = () => { 
        setNewFitoutTypeData(prev => ({ ...prev, flatType: flatTypeOptions[0] || "", price: "", })); 
    };

    const handleAddPrice = async () => {
        const { fitoutType, flatType, price } = newFitoutTypeData;

        if (!fitoutType || !flatType || !price || isNaN(Number(price))) {
            return alert("Please select a Fitout Type, Flat Type, and enter a valid Price.");
        }

        const priceValue = Number(price);
        const existingFitoutTypeIndex = fitoutTypes.findIndex(ft => ft.fitoutType === fitoutType);

        if (existingFitoutTypeIndex > -1) {
            setFitoutTypes(prev => prev.map((item, index) =>
                index === existingFitoutTypeIndex
                    ? { ...item, prices: { ...item.prices, [flatType]: priceValue } }
                    : item
            ));
        } else {
            const newId = Math.max(...fitoutTypes.map(ft => ft.id), 0) + 1;
            setFitoutTypes(prev => [...prev, { id: newId, fitoutType: fitoutType, prices: { [flatType]: priceValue }, subcategory: "New" }]); 
        }
        resetFitoutTypeForm();
    };

    const handleSaveFitoutType = () => { alert("Fitout Type Configuration Saved! (Simulated)"); };

    // ------------------------- RENDER -------------------------

    const tabs = [
        { label: "Fitout Types", key: "fitoutTypes" },
        { label: "Category", key: "category" },
        { label: "Status", key: "status" },
        { label: "Fitout Guide", key: "fitoutGuide" },
        { label: "Deviation Status", key: "deviationStatus" },
    ];

    return (
        <div className="p-4">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} orientation="horizontal" />
            <TopBar
                onSearch={setSearchTerm}
                // Only show New Category button when on the Category tab
                onButtonClick={() => activeTab === "category" && setShowCategoryForm(true)}
                buttons={activeTab === "category" ? ["New Category", "Export"] : []}
            />
            
            {/* New Category button displayed prominently for the Category tab */}
            {activeTab === "category" && (
                <button 
                    onClick={() => setShowCategoryForm(true)} 
                    className="px-4 py-2 mt-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                >
                    New Category
                </button>
            )}

            {/* ---------------- 1. Fitout Types Tab Content ---------------- */}
            {activeTab === "fitoutTypes" && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <button onClick={() => setShowFitoutTypeForm(prev => !prev)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            {showFitoutTypeForm ? "Hide Form" : "Show Form"}
                        </button>
                    </div>

                    {/* Fitout Type Price Form */}
                    {showFitoutTypeForm && (
                        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                            <div className="flex items-end gap-3 text-sm">
                                <div className="flex flex-col"><span>Fitout Type</span>
                                    <select value={newFitoutTypeData.fitoutType} onChange={e => handleFitoutTypeFormChange("fitoutType", e.target.value)} className="px-3 py-2 border rounded w-32"><option value="FITOUT">FITOUT</option></select>
                                </div>
                                <div className="flex flex-col"><span>Flat Type</span>
                                    <select value={newFitoutTypeData.flatType} onChange={e => handleFitoutTypeFormChange("flatType", e.target.value)} className="px-3 py-2 border rounded w-48">
                                        {flatTypeOptions.map((type, index) => (<option key={index} value={type}>{type}</option>))}
                                    </select>
                                </div>
                                <div className="flex flex-col"><span>Price</span>
                                    <div className="flex items-center">
                                        <span className="bg-gray-200 text-gray-700 h-10 px-3 py-2 border border-r-0 rounded-l flex items-center">₹</span>
                                        <input type="number" placeholder="Price" min="0" value={newFitoutTypeData.price} onChange={e => handleFitoutTypeFormChange("price", e.target.value)} className="px-3 py-2 border rounded-none w-28 h-10"/>
                                        <button onClick={handleAddPrice} className="flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-r h-10 hover:bg-green-600">+ Add</button>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4 self-end">
                                    <button onClick={handleSaveFitoutType} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                                    <button onClick={resetFitoutTypeForm} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <Pagination currentPage={currentPage} totalPages={fitoutTypeTotalPages} totalItems={filteredFitoutTypes.length} onPageChange={setCurrentPage} showControls/>

                    {/* Fitout Type Table - Actions, Category, and Subcategory */}
                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full table-auto border border-gray-200">
                            <TableHead columns={[
                                { label: "Actions", align: "center" },
                                { label: "Category" },
                                { label: "Subcategory" },
                            ]} />
                            <tbody>
                                {currentFitoutTypes.map(item => (
                                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="text-center py-3 flex justify-center space-x-2">
                                            <IconButton tooltip="Edit"><FiEdit /></IconButton>
                                            <IconButton tooltip="Delete"><FiTrash2 className="text-red-600" /></IconButton>
                                        </td>
                                        <td className="py-3 px-4 font-medium">{item.fitoutType}</td>
                                        <td className="py-3 px-4">{item.subcategory || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ---------------- 2. Category Tab Content (MODIFIED) ---------------- */}
            {activeTab === "category" && (
                <div className="mt-4">
                    {/* Category Form - Show only when explicitly adding/editing */}
                    {showCategoryForm && (
                        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                            <h3 className="text-lg font-semibold mb-3">{editCategoryId ? "Edit Category" : "New Category"}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-lg text-sm">
                                <label className="flex flex-col"><span>Category Name</span>
                                    <input type="text" placeholder="Enter Category" value={categoryFormData.name} onChange={e => handleCategoryFormChange("name", e.target.value)} className="px-3 py-2 border rounded w-full" />
                                </label>
                                <label className="flex flex-col"><span>Subcategory Name</span>
                                    <input type="text" placeholder="Enter Subcategory" value={categoryFormData.subcategory} onChange={e => handleCategoryFormChange("subcategory", e.target.value)} className="px-3 py-2 border rounded w-full" />
                                </label>
                            </div>
                            
                            <div className="mt-4 flex gap-3">
                                <button onClick={handleSaveCategory} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                                <button onClick={resetCategoryForm} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
                            </div>
                        </div>
                    )}

                    <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredCategories.length} onPageChange={setCurrentPage} showControls />

                    {/* Category Table (Actions, Category, Subcategory, Checklists) */}
                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full table-auto border border-gray-200">
                            <TableHead columns={[
                                { label: "Actions", align: "center" },
                                { label: "Category" },
                                { label: "Subcategory" },
                                { label: "Checklists" }, // Kept as per your clarification
                            ]} />
                            <tbody>
                                {currentCategories.map(cat => (
                                    <tr key={cat.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="text-center py-3 flex justify-center space-x-2">
                                            <IconButton tooltip="Edit" onClick={() => handleEditCategory(cat)}><FiEdit /></IconButton>
                                            <IconButton tooltip="Delete" onClick={() => handleDeleteCategory(cat.id)}><FiTrash2 className="text-red-600" /></IconButton>
                                            {/* REMOVED: The blue "Add Checklist" button */}
                                        </td>
                                        <td className="py-3 px-4">{cat.name}</td>
                                        <td className="py-3 px-4">{cat.subcategory}</td>
                                        <td className="py-3 px-4">-</td> {/* Kept as per your clarification */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- 3. Other Tabs Content (Placeholder) --- */}
            {activeTab === "status" && <div className="mt-4">Status Content</div>}
            {activeTab === "fitoutGuide" && <div className="mt-4">Fitout Guide Content</div>}
            {activeTab === "deviationStatus" && <div className="mt-4">Deviation Status Content</div>}
        </div>
    );
};

export default FitoutSetup;