import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import TableHead from "../../components/TopHead";
import NoDataFound from "../../components/NoDataFound"; // Assuming this is a utility component
import TopSearch from "../../components/TopSearch"; // Added TopSearch
import { FiEye } from 'react-icons/fi'; // Added FiEye icon
import { FitoutRequestInstance } from "../../api/axiosinstance";

interface ColumnConfig {
  label: string;
  align?: "left" | "center" | "right";
}

interface FitoutDeviation {
  id: number;
  tower: string;
  flat: string;
  status: string;
}

const FitoutDeviations: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<FitoutDeviation[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search

  const itemsPerPage = 1; // Set to 1 to match the "1-1 of 1" from the image for empty state
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const columns: ColumnConfig[] = [
    { label: "Actions", align: "center" },
    { label: "Tower", align: "left" }, // Aligned to match the visual spacing
    { label: "Flat", align: "left" },  // Aligned to match the visual spacing
    { label: "Status", align: "left" }, // Aligned to match the visual spacing
  ];

  // Placeholder for API data fetching
  useEffect(() => {
    const fetchDeviations = async () => {
      try {
        setLoading(true);
        // NOTE: We will mock the API response to show "No Matching Records Found"
        // const res = await FitoutRequestInstance.get( ... );
        
        // Mocking an empty response to match the image
        setRows([]); 
        setTotalItems(0); 
      } catch (error) {
        console.error("Error fetching deviations:", error);
      } finally {
        // Simulate loading delay
        setTimeout(() => setLoading(false), 300); 
      }
    };

    fetchDeviations();
  }, [currentPage]);

  const handleView = (row: FitoutDeviation) => {
    console.log(`View deviation for ${row.tower}-${row.flat}`);
    // Implementation for viewing deviation details
  };

  return (
    <div className="p-4"> 
      {/* Top Search and Pagination Controls */}
      <div className="flex justify-between items-center mb-0">
        {/* Placeholder for the Search Input matching the image position */}
        <div className="flex-1 max-w-sm">
          {/* Assuming TopSearch component renders a search input */}
          <TopSearch onSearch={setSearchTerm} onButtonClick={() => {}} buttons={[]} />
        </div>

        {/* Pagination component with the '1-1 of 1' style */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          showControls={true}
          // Custom rendering to match the exact visual style (1-1 of 1 < >)
          styleClass="flex items-center text-sm text-gray-500"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border-y border-gray-300">
        <table className="min-w-full table-auto text-sm">
          {/* Table Header */}
          <TableHead columns={columns} />
          
          {/* Table Body */}
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-50">
                  <td className="text-center py-2">
                    <button onClick={() => handleView(row)} title="View Deviation" className="text-gray-600 hover:text-indigo-600">
                      <FiEye className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                  <td className="py-2 px-4">{row.tower}</td>
                  <td className="py-2 px-4">{row.flat}</td>
                  <td className="py-2 px-4">{row.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-4 text-gray-400 text-center relative">
                  {/* Eye icon positioned roughly to match the visual */}
                  <FiEye className="w-5 h-5 absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-70" />
                  <span className="block pl-4">No Matching Records Found</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FitoutDeviations;