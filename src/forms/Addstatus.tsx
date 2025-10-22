// // src/pages/StatusTab.tsx
// import React, { useState, useEffect } from "react";
// import { FiTrash2 } from "react-icons/fi";
// import { postStatus, updateStatus, deleteStatus, fetchStatusItems } from "../api/endpoint";
// import Pagination from "../components/Pagination";
// import IconButton from "../components/IconButton";

// interface Status {
//   id?: number;
//   order: number;
//   status: string;
//   fixed_state: string;
//   color: string;
// }

// const fixedStateOptions = ["Pending", "In Progress", "Completed", "Cancelled"];

// const StatusTab: React.FC = () => {
//   const [statusItems, setStatusItems] = useState<Status[]>([]);
//   const [newStatus, setNewStatus] = useState("");
//   const [newFixedState, setNewFixedState] = useState("Pending");
//   const [newColor, setNewColor] = useState("#FFFFFF");
//   const [newOrder, setNewOrder] = useState(1);

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // Fetch data
//   useEffect(() => {
//     const loadStatus = async () => {
//       try {
//         const items = await fetchStatusItems();
//         setStatusItems(items);
//       } catch (err) {
//         console.error("Failed to fetch status items", err);
//       }
//     };
//     loadStatus();
//   }, []);

//   // Pagination
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentStatusItems = statusItems.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(statusItems.length / itemsPerPage);

//   // Add new status
//   const handleAddStatus = async () => {
//     if (!newStatus.trim()) {
//       alert("Please enter a status name");
//       return;
//     }

//     const newRow: Status = {
//       status: newStatus,
//       fixed_state: newFixedState,
//       color: newColor,
//       order: Number(newOrder),
//     };

//     try {
//       const savedRow = await postStatus(newRow);
//       setStatusItems((prev) => [...prev, savedRow]);

//       // Reset form
//       setNewStatus("");
//       setNewFixedState("Pending");
//       setNewColor("#FFFFFF");
//       setNewOrder(1);
//     } catch (err) {
//       console.error(err);
//       alert("Error adding status");
//     }
//   };

//   // Delete status
//   const handleDeleteStatus = async (id: number) => {
//     try {
//       await deleteStatus(id);
//       setStatusItems((prev) => prev.filter((item) => item.id !== id));
//     } catch (err) {
//       console.error(err);
//       alert("Error deleting status");
//     }
//   };

//   return (
//     <div className="mt-4">
//       {/* New Status Form */}
//       <div className="bg-gray-50 p-4 rounded-md mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//           <input
//             type="text"
//             value={newStatus}
//             onChange={(e) => setNewStatus(e.target.value)}
//             placeholder="Status Name"
//             className="px-3 py-2 border rounded-md w-full"
//           />
//           <select
//             value={newFixedState}
//             onChange={(e) => setNewFixedState(e.target.value)}
//             className="px-3 py-2 border rounded-md w-full"
//           >
//             {fixedStateOptions.map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt}
//               </option>
//             ))}
//           </select>
//           <input
//             type="color"
//             value={newColor}
//             onChange={(e) => setNewColor(e.target.value)}
//             className="w-10 h-10 border rounded"
//           />
//           <input
//             type="number"
//             min={1}
//             value={newOrder}
//             onChange={(e) =>
//               setNewOrder(e.target.value === "" ? 1 : Number(e.target.value))
//             }
//             placeholder="Order"
//             className="px-3 py-2 border rounded-md w-full"
//           />
//           <button
//             onClick={handleAddStatus}
//             className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
//           >
//             Add
//           </button>
//         </div>
//       </div>

//       {/* Pagination */}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         totalItems={statusItems.length}
//         onPageChange={setCurrentPage}
//         showControls
//       />

//       {/* Table */}
//       <div className="overflow-x-auto mt-4">
//         <table className="min-w-full table-auto border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border px-4 py-2">Actions</th>
//               <th className="border px-4 py-2">Order</th>
//               <th className="border px-4 py-2">Status</th>
//               <th className="border px-4 py-2">Fixed Status</th>
//               <th className="border px-4 py-2">Color</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentStatusItems.map((item) => (
//               <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
//                 <td className="text-center py-3 flex justify-center space-x-2">
//                   <IconButton onClick={() => handleDeleteStatus(item.id!)}>
//                     <FiTrash2 className="text-red-600" />
//                   </IconButton>
//                 </td>
//                 <td className="py-3 px-4 text-center">{item.order}</td>
//                 <td className="py-3 px-4">{item.status}</td>
//                 <td className="py-3 px-4 text-center">{item.fixed_state}</td>
//                 <td className="py-3 px-4 text-center">
//                   <div
//                     className="w-6 h-6 rounded-full mx-auto border border-gray-300"
//                     style={{ backgroundColor: item.color }}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default StatusTab;




// src/pages/StatusTab.tsx
import React, { useState, useEffect } from "react";
import { FiTrash2, FiSearch } from "react-icons/fi"; // Added FiSearch
import { postStatus, updateStatus, deleteStatus, fetchStatusItems } from "../api/endpoint";
import Pagination from "../components/Pagination";
import IconButton from "../components/IconButton";

interface Status {
  id?: number;
  order: number;
  status: string;
  fixed_state: string;
  color: string;
}

const fixedStateOptions = ["Pending", "In Progress", "Completed", "Cancelled"];

const StatusTab: React.FC = () => {
  const [statusItems, setStatusItems] = useState<Status[]>([]);
  const [newStatus, setNewStatus] = useState("");
  const [newFixedState, setNewFixedState] = useState("Pending");
  const [newColor, setNewColor] = useState("#FFFFFF");
  const [newOrder, setNewOrder] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // added search query
  const itemsPerPage = 5;

  // Fetch data
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const items = await fetchStatusItems();
        setStatusItems(items);
      } catch (err) {
        console.error("Failed to fetch status items", err);
      }
    };
    loadStatus();
  }, []);

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  // Filtered items by search query
  const filteredItems = statusItems.filter((item) =>
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentStatusItems = filteredItems.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Add new status
  const handleAddStatus = async () => {
    if (!newStatus.trim()) {
      alert("Please enter a status name");
      return;
    }

    const newRow: Status = {
      status: newStatus,
      fixed_state: newFixedState,
      color: newColor,
      order: Number(newOrder),
    };

    try {
      const savedRow = await postStatus(newRow);
      setStatusItems((prev) => [...prev, savedRow]);

      // Reset form
      setNewStatus("");
      setNewFixedState("Pending");
      setNewColor("#FFFFFF");
      setNewOrder(1);
    } catch (err) {
      console.error(err);
      alert("Error adding status");
    }
  };

  // Delete status
  const handleDeleteStatus = async (id: number) => {
    try {
      await deleteStatus(id);
      setStatusItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting status");
    }
  };

  return (
    <div className="mt-4">
      {/* New Status Form */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Status Name Input with Magnifying Glass */}
          <div className="relative w-full">
            <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              placeholder="Status Name"
              className="pl-8 px-3 py-2 border rounded-md w-full"
            />
          </div>

          <select
            value={newFixedState}
            onChange={(e) => setNewFixedState(e.target.value)}
            className="px-3 py-2 border rounded-md w-full"
          >
            {fixedStateOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-10 h-10 border rounded"
          />
          <input
            type="number"
            min={1}
            value={newOrder}
            onChange={(e) =>
              setNewOrder(e.target.value === "" ? 1 : Number(e.target.value))
            }
            placeholder="Order"
            className="px-3 py-2 border rounded-md w-full"
          />
          <button
            onClick={handleAddStatus}
            className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredItems.length}
        onPageChange={setCurrentPage}
        showControls
      />

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Actions</th>
              <th className="border px-4 py-2">Order</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Fixed Status</th>
              <th className="border px-4 py-2">Color</th>
            </tr>
          </thead>
          <tbody>
            {currentStatusItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="text-center py-3 flex justify-center space-x-2">
                  <IconButton onClick={() => handleDeleteStatus(item.id!)}>
                    <FiTrash2 className="text-red-600" />
                  </IconButton>
                </td>
                <td className="py-3 px-4 text-center">{item.order}</td>
                <td className="py-3 px-4">{item.status}</td>
                <td className="py-3 px-4 text-center">{item.fixed_state}</td>
                <td className="py-3 px-4 text-center">
                  <div
                    className="w-6 h-6 rounded-full mx-auto border border-gray-300"
                    style={{ backgroundColor: item.color }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusTab;
