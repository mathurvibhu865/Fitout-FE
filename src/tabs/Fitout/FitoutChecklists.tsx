import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi'; 
import TableHead from '../../components/TopHead';
import AddChecklist from '../../forms/Addchecklist';

// Assuming these functions exist in your API file
import { getFitoutChecklists, updateChecklistStatus } from '../../api/endpoint'; 

// =================================================================
// INTERFACES
// =================================================================
interface ChecklistItem {
  id: number;
  name: string;
  status: 'Active' | 'Inactive' | string; 
  category: string;
  subcategory: string;
  questions: string[];
}

// =================================================================
// ❌ REMOVED: userEnteredMockData constant is removed
// If you were to dynamically load data, it would look like this:
/*
const dynamicDataExample: ChecklistItem[] = [
    { 
        id: 1, 
        name: "Fit Out Rounder Checklist", 
        status: 'Active', 
        category: "Fitout", 
        subcategory: "Fit Out Rounder", 
        questions: new Array(7).fill("Q") 
    },
    { 
        id: 2, 
        name: "Electrical Final Inspection", 
        status: 'Inactive', 
        category: "Electrical", 
        subcategory: "Wiring Check", 
        questions: new Array(12).fill("Q") 
    },
    { 
        id: 3, 
        name: "Plumbing Fixture Install", 
        status: 'Active', 
        category: "Plumbing", 
        subcategory: "Bathroom", 
        questions: new Array(5).fill("Q") 
    },
];
*/
// =================================================================

const FitoutChecklists: React.FC = () => {
  // Initialize state with an empty array. Data will be fetched or added dynamically.
  const [checklistData, setChecklistData] = useState<ChecklistItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const itemsPerPage = 10;

  // Function to fetch data from API 
  const fetchChecklists = async (page: number) => {
    try {
      // 💡 In a real app, this is where you would call your API:
      // const response = await getFitoutChecklists(page, itemsPerPage);
      // setChecklistData(response.data);
      // setTotalItems(response.totalCount); 

        // 💡 Since we removed the mock data, we just clear the list/keep it empty:
        setChecklistData([]); 
        setTotalItems(0);
        
    } catch (error) {
      console.error('Error fetching checklists:', error);
    }
  };

  useEffect(() => {
    fetchChecklists(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // ---------------- STATUS TOGGLE HANDLER ----------------
  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

    // Optimistic UI Update
    setChecklistData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    // API Call to save the change (simulated)
    try {
      // await updateChecklistStatus(id, newStatus); 
      console.log(`Successfully updated status for ID ${id} to ${newStatus}`);
    } catch (error) {
      console.error(`Failed to update status for ID ${id} to ${newStatus}.`, error);
      
      // Rollback UI if API fails
      setChecklistData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, status: currentStatus } : item
        )
      );
      alert('Failed to save status change on the server. Please try again.');
    }
  };

  // ---------------- OTHER ACTION HANDLERS ----------------

  const handleEdit = (item: ChecklistItem) => {
    alert(`Editing Checklist: ${item.name} (ID: ${item.id})`);
    // Logic to load item into form...
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this checklist?")) {
        alert(`Deleting Checklist ID: ${id}`);
        // Add API call for deletion, then refresh:
        // await deleteChecklist(id);
        fetchChecklists(currentPage); 
    }
  };

  const handleChecklistCreated = () => {
    setShowAddChecklist(false);
    // After creation, the user would expect to see the new item, 
    // so we re-fetch the list (which will be empty in this mock state).
    fetchChecklists(currentPage);
  };

  // Calculate current item range for display
  const startItem = Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1);
  const endItem = Math.min(totalItems, currentPage * itemsPerPage);


  return (
    <div>
      {/* Top Bar: Button and Pagination Display */}
      <div className="flex justify-between items-center mb-4">
        {/* Add Checklist Button */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => setShowAddChecklist(true)}
        >
          Add Checklist
        </button>

        {/* Pagination Status (1-1 of 1 style) */}
        <div className="flex items-center text-gray-600">
            <span>{totalItems === 0 ? "0-0 of 0" : `${startItem}-${endItem} of ${totalItems}`}</span>
            <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                disabled={currentPage === 1} 
                className="ml-2 p-1 disabled:opacity-50"
            >
                &lt;
            </button>
            <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                disabled={currentPage === totalPages || totalPages === 0} 
                className="p-1 disabled:opacity-50"
            >
                &gt;
            </button>
        </div>
      </div>

      {/* Checklist Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg"> 
        <table className="min-w-full table-auto">
          <TableHead
            columns={[
              { label: "Actions", align: "center" as const },
              { label: "", align: "center" as const }, 
              { label: "Name" },
              { label: "Status" }, // Status column header
              { label: "Category" },
              { label: "Subcategory" },
              { label: "No.Of Q", align: "center" as const }
            ]}
          />
          <tbody>
            {checklistData.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                
                {/* 1. Actions Column: View, Edit, Delete */}
                <td className="text-center py-3 whitespace-nowrap">
                  <div className="flex justify-center items-center gap-2">
                    
                    {/* View Icon (Eye) */}
                    <button title="View Details" className="p-1 text-gray-600 rounded hover:bg-gray-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12.025a.897.897 0 010-.05c.57-.96 3.193-4.148 9.542-4.148 6.349 0 8.973 3.187 9.542 4.148a.897.897 0 010 .05c-.57.96-3.193 4.148-9.542 4.148-6.349 0-8.973-3.187-9.542-4.148z"></path></svg>
                    </button>

                    {/* Edit Button */}
                    <button 
                        title="Edit Checklist" 
                        onClick={() => handleEdit(item)} 
                        className="p-1 text-blue-600 rounded hover:bg-gray-200"
                    >
                        <FiEdit className="w-5 h-5" />
                    </button>

                    {/* Delete Button */}
                    <button 
                        title="Delete Checklist" 
                        onClick={() => handleDelete(item.id)} 
                        className="p-1 text-red-600 rounded hover:bg-gray-200"
                    >
                        <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
                
                {/* 2. Checkbox Column */}
                <td className="text-center py-3">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                </td>
                
                {/* 3. Name */}
                <td className="py-3 px-4 font-medium">{item.name}</td>
                
                {/* 4. Status Column (Functional Toggle Switch) */}
                <td className="py-3 px-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={item.status === 'Active'} 
                            onChange={() => handleStatusToggle(item.id, item.status)} 
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </td>
                
                {/* 5. Category */}
                <td className="py-3 px-4">{item.category}</td>
                
                {/* 6. Subcategory */}
                <td className="py-3 px-4">{item.subcategory}</td>
                
                {/* 7. No. Of Q */}
                <td className="text-center py-3 px-4">{item.questions.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Checklist Modal (Unchanged) */}
      {showAddChecklist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={() => setShowAddChecklist(false)}
            >
              ✕
            </button>
            <AddChecklist
              onBack={() => setShowAddChecklist(false)}
              onCreated={handleChecklistCreated}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FitoutChecklists;