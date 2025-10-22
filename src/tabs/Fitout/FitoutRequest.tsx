// src/pages/FitoutRequest.tsx
import React, { useState, useEffect } from "react";
import TopBar from "../../components/TopBar";
import Pagination from "../../components/Pagination";
import TableHead from "../../components/TopHead";
import NoDataFound from "../../components/NoDataFound";
import IconButton from "../../components/IconButton";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Tabs from "../../components/Tabs";


import {
  getFitoutRequests,
  deleteFitoutRequest,

} from "../../api/endpoint";

import { FitoutRequestInstance } from "../../api/axiosinstance";

import AddFitoutRequestForm from "../../forms/Addfitoutrequest";

export interface Item {
  id: number;
  annexure?: string;
  description?: string;
  // tower_id: string;
  // flat_id: number;
  master_status: string;
  created_at: string;
  createdBy: string;
  total_amount?: number;
  amount_paid?: number;
  annexures?: File[];
}

const FitoutRequest: React.FC = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [searchValue, setSearchValue] = useState("");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<Item[]>([]);
  const itemsPerPage = 10;

  // -------------------- Fetch API Data --------------------
  const fetchData = async () => {
    try {
      const result = await getFitoutRequests();
      setData(result as Item[]);
    } catch (err) {
      console.error("Failed to fetch fitout requests:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  // -------------------- Actions --------------------
  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteClick = async (item: Item) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await deleteFitoutRequest(item.id);
      setData((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  // -------------------- Form Submission with FormData --------------------
  const handleFormSubmit = async (payload: any, annexures?: File[]) => {
    try {
      const toFormData = (payload: any, annexures: any[] =  []) => {
        const formData = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof Date) {
              formData.append(key, value.toISOString().split("T")[0]);
            } else {
              formData.append(key, String(value));
            }
          }
        });

    annexures.forEach((a, index) => {
    if (a.file) {
      formData.append(`fitout_annexures[${index}][file]`, a.file);
      formData.append(`fitout_annexures[${index}][annexure]`, a.id.toString());
    }
  });

        
        

        return formData;
      };

      let responseData;

      if (editingItem) {
        const formData = toFormData(payload, annexures);
        const { data } = await FitoutRequestInstance.put(
          `/fitout-requests/${editingItem.id}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        responseData = data;
        setData((prev) =>
          prev.map((item) => (item.id === editingItem.id ? responseData : item))
        );
      } else {
        const formData = toFormData(payload, annexures);
        const { data } = await FitoutRequestInstance.post(
          "/fitout-requests/",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        responseData = data;
        setData((prev) => [responseData, ...prev]);
      }

      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Failed to submit request:", err);
      alert("Error submitting request. Please try again.");
    }
  };

  const handleButtonClick = (type: string) => {
    if (type === "Add") {
      setEditingItem(null);
      setShowForm(true);
    }
  };

  const tabs = [{ label: "Fitout Requests", key: "requests" }];
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        orientation="horizontal"
      />

      {activeTab === "requests" && (
        <div className="mt-4">
          <div className="flex justify-between mb-4">
            <TopBar
              buttons={["Add", "Filter"]}
              onSearch={setSearchValue}
              onButtonClick={handleButtonClick}
            />
          </div>

          {showForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">
                {editingItem ? "Update Request" : "New Request"}
              </h2>
              <AddFitoutRequestForm
                onSuccess={(payload, annexures) =>
                  handleFormSubmit(payload, annexures)
                }
                onCancel={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                initialData={editingItem || undefined}
              />
            </div>
          )}

          {!showForm && (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  onPageChange={setCurrentPage}
                  showControls={true}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-200">
                  <TableHead
                    columns={[
                      { label: "Annexure" },
                      { label: "Description" },
                      // { label: "Tower" },
                      // { label: "Flat" },
                      { label: "Master Status" },
                      { label: "Created On" },
                      { label: "Created By" },
                      { label: "Total Amt" },
                      { label: "Amt Paid" },
                      { label: "Actions", align: "center" },
                    ]}
                  />
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="p-3 border-b">{item.annexure || "NA"}</td>
                          <td className="p-3 border-b">{item.description || "NA"}</td>
                          {/* <td className="p-3 border-b">{item.tower_id}</td>
                          <td className="p-3 border-b">{item.flat_id}</td> */}
                          <td className="p-3 border-b">{item.master_status}</td>
                          <td className="p-3 border-b">{item.created_at}</td>
                          <td className="p-3 border-b">{item.createdBy}</td>
                          <td className="p-3 border-b">{item.total_amount ?? 0}</td>
                          <td className="p-3 border-b">{item.amount_paid ?? 0}</td>
                          <td className="p-3 border-b text-center space-x-3">
                            <IconButton
                              tooltip="Edit"
                              className="hover:text-green-600 transition-colors"
                              onClick={() => handleEditClick(item)}
                            >
                              <FiEdit />
                            </IconButton>
                            <IconButton
                              tooltip="Delete"
                              className="hover:text-red-600 transition-colors"
                              onClick={() => handleDeleteClick(item)}
                            >
                              <FiTrash2 />
                            </IconButton>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={10}
                          className="text-center py-4 text-gray-500"
                        >
                          <NoDataFound />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FitoutRequest;
