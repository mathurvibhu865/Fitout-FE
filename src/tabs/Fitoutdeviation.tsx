import React, { useEffect, useState } from 'react';
import SendViolation from '../forms/Sendviolation';
import TopHead from '../components/TopHead';
import IconButton from '../components/IconButton';
import Pagination from '../components/Pagination';
import { FiEye, FiEdit, FiCheck, FiX } from 'react-icons/fi';
import axiosInstance from "../api/axiosinstance";
import NoDataFound from '../components/NoDataFound';

interface Checklist {
  id: number;
  fitoutRequestId: number;
  tower: string;
  flat: string;
  description: string;
  status: string;
  createdOn: string;
  createdBy: string;
}

interface ViewDeviationProps {
  id: number;
}

const ViewDeviation: React.FC<ViewDeviationProps> = ({ id }) => {
  const [showViolation, setShowViolation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Checklist>>({});
  const itemsPerPage = 10;

  const fetchDeviations = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/fitout/deviations`, {
        params: { page: currentPage, limit: itemsPerPage, fitoutId: id }
      });

      setChecklists(response.data.results || []);
      setTotalItems(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching deviations:", error);
      setChecklists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviations();
  }, [currentPage, id]);

  const handleEdit = (item: Checklist) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSave = async (id: number) => {
    try {
      await axiosInstance.put(`/fitout/deviations/${id}`, editData);
      setChecklists((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...editData } as Checklist : item))
      );
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error("Error updating deviation:", error);
    }
  };

  const columns = [
    { label: 'Action', align: 'left' as const },
    { label: 'ID', align: 'left' as const },
    { label: 'Fitout Request ID', align: 'left' as const },
    { label: 'Description', align: 'left' as const },
    { label: 'Status', align: 'left' as const },
    { label: 'Created On', align: 'left' as const },
    { label: 'Created By', align: 'left' as const },
    { label: 'Comments', align: 'left' as const },
    { label: 'Attachments', align: 'left' as const },
    { label: 'Send Violation', align: 'left' as const },
  ];

  if (showViolation && checklists.length > 0) {
    return <SendViolation data={checklists[0]} onClose={() => setShowViolation(false)} />;
  }

  return (
    <div className="mt-4 bg-white rounded shadow px-6 py-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-md font-semibold">Deviations</h2>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          totalItems={totalItems}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <TopHead columns={columns} />
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : checklists.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                  <NoDataFound />
                </td>
              </tr>
            ) : (
              checklists.map((checklist) => (
                <tr key={checklist.id} className="border-b">
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      {editingId === checklist.id ? (
                        <>
                          <IconButton tooltip="Save" onClick={() => handleSave(checklist.id)}>
                            <FiCheck />
                          </IconButton>
                          <IconButton tooltip="Cancel" onClick={handleCancelEdit}>
                            <FiX />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton tooltip="View" onClick={() => setShowViolation(true)}>
                            <FiEye />
                          </IconButton>
                          <IconButton tooltip="Edit" onClick={() => handleEdit(checklist)}>
                            <FiEdit />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">{checklist.id}</td>
                  <td className="px-4 py-2">{checklist.fitoutRequestId}</td>
                  <td className="px-4 py-2">
                    {editingId === checklist.id ? (
                      <input
                        type="text"
                        value={editData.description || ""}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      checklist.description
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === checklist.id ? (
                      <select
                        value={editData.status || ""}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="border p-1 rounded"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                      </select>
                    ) : (
                      checklist.status
                    )}
                  </td>
                  <td className="px-4 py-2">{checklist.createdOn}</td>
                  <td className="px-4 py-2">{checklist.createdBy}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-[#7991BB] hover:bg-[#6f84ad] text-white px-3 py-1 rounded text-sm"
                      disabled
                    >
                      Send Violation
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewDeviation;
