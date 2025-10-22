// src/pages/Status.tsx
import React, { useState, useEffect, useMemo } from "react";
import AddStatus from "../../forms/Addstatus";
import { getStatuses } from "../../api/endpoint";
import { FiFilter } from "react-icons/fi"; // Import the filter icon

interface StatusRow {
  id?: number;
  order: number;
  status: string;
  fixed_state: string;
  color: string;
}

const Status: React.FC = () => {
  const [statusList, setStatusList] = useState<StatusRow[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    order: "",
    status: "",
    fixed_state: "",
    color: "",
  });

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        // Assume getStatuses is a function that fetches data compatible with StatusRow[]
        // and fixed_state value is one of the dropdown values in AddStatus.
        const data = await getStatuses();
        setStatusList(data.sort((a, b) => a.order - b.order));
      } catch (err) {
        console.error(err);
        alert("Error fetching statuses");
      }
    };
    fetchStatuses();
  }, []);

  const addNewRow = () => {
    // Add a new row with a temporary non-ID key (a negative number) if id is not yet available
    const newId = statusList.length > 0 ? Math.min(...statusList.map(row => row.id || 0)) - 1 : -1;
    const newRow: StatusRow = { id: newId, order: 0, status: "", fixed_state: "Not Fixed", color: "#000000" };
    setStatusList((prev) => [newRow, ...prev]);
  };

  const handleUpdateRow = (updatedRow: StatusRow) => {
    setStatusList((prev) =>
      prev.map((row) => (row.id === updatedRow.id || (row.status === updatedRow.status && !row.id) ? updatedRow : row))
    );
  };

  const handleDeleteRow = (id?: number) => {
    setStatusList((prev) => prev.filter((row) => row.id !== id));
  };

  const filteredList = useMemo(() => {
    // Correctly apply the filter to the list
    return statusList.filter((row) => {
      // "Action" column is not filtered, so we exclude it from the keys check
      const filterableKeys: (keyof StatusRow)[] = ["order", "status", "fixed_state", "color"];
      
      return filterableKeys.every((key) => {
        const filterValue = filters[key as keyof typeof filters];
        if (!filterValue) return true;
        
        // Handle number filtering for 'order'
        if (key === 'order') {
            return row.order.toString().includes(filterValue);
        }
        
        // Handle string filtering for other fields
        return row[key]?.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [filters, statusList]);

  // Updated columns array to match the table structure
  const columns = ["Action", "Order", "Status", "Fixed State", "Color"];
  
  // Array of filter keys in the correct order for table rendering (excluding 'Action')
  const filterKeys = ["order", "status", "fixed_state", "color"]; 

  return (
    <div className="p-4 flex flex-col gap-4 text-gray-700">
      <div className="flex gap-4">
        {/* Button to add a new status */}
        <button
          onClick={addNewRow}
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition-colors"
        >
          Add Status
        </button>
        
        {/* Button to toggle the filters row (NEW ADDITION) */}
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className={`px-4 py-2 rounded shadow transition-colors flex items-center gap-2 ${showFilters ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          <FiFilter />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* --- */}

      <div className="overflow-x-auto border rounded-lg shadow-md">
        <table className="w-full text-sm text-center border-collapse">
          <thead>
            {/* Table Header Row */}
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
              {columns.map((col) => (
                <th key={col} className="px-2 py-3 border-b border-gray-200">
                  {col}
                </th>
              ))}
            </tr>
            
            {/* Filter Row (Conditional) */}
            {showFilters && (
              <tr className="bg-gray-50">
                {/* Empty cell for the 'Action' column */}
                <td className="px-2 py-1 border-r border-b"></td> 
                
                {/* Filter Inputs for Order, Status, Fixed State, Color */}
                {filterKeys.map((key) => (
                  <td key={key} className="px-2 py-1 border-r border-b">
                    <input
                      // Correctly map the filter keys to the state
                      value={filters[key as keyof typeof filters]} 
                      onChange={(e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={`Filter ${key}`}
                      className="w-full px-1 py-0.5 border rounded focus:ring-blue-500 focus:border-blue-500 text-xs"
                      type={key === 'order' ? 'number' : 'text'}
                    />
                  </td>
                ))}
              </tr>
            )}
          </thead>

          <tbody className="bg-white">
            {filteredList.length > 0 ? (
              filteredList.map((row, idx) => (
                // AddStatus component handles the editable row logic
                <AddStatus
                  key={row.id || idx} // Use idx as a fallback for new rows
                  rowData={row}
                  onUpdate={handleUpdateRow}
                  onDelete={handleDeleteRow}
                />
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-4 text-gray-400">
                  No status found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Status;