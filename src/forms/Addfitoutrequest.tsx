// src/forms/AddFitoutRequestForm.tsx
import React, { useEffect, useState } from "react";
import { FiX, FiPlus } from "react-icons/fi";
import DatePicker from "../components/DatePicker";
import FileUpload from "../components/FileUpload";
import { getAnnexures, getUsers } from "../api/endpoint";

export interface AnnexureItem {
  id: number;
  name: string;
  file?: File;
  amount: number;
  convenience: number;
}

interface AddFitoutRequestFormProps {
  onSuccess: (formData: FormData) => void;
  onCancel: () => void;
  initialData?: any;
}

const AddFitoutRequestForm: React.FC<AddFitoutRequestFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [annexureTypes, setAnnexureTypes] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const [description, setDescription] = useState("");
  const [contractorName, setContractorName] = useState("");
  const [contractorMobile, setContractorMobile] = useState("");
  const [requestedDate, setRequestedDate] = useState<string>("");
  const [refundDate, setRefundDate] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");

  const [annexures, setAnnexures] = useState<AnnexureItem[]>([]);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const annexRes = await getAnnexures();
        setAnnexureTypes(annexRes.map((a: any) => a.name));

        const userRes = await getUsers();
        setUsers(userRes);
      } catch (err) {
        console.error("Error fetching meta:", err);
      }
    };
    fetchMeta();
  }, []);

  const addAnnexure = () => {
    setAnnexures((prev) => [
      ...prev,
      { id: Date.now(), name: "", file: undefined, amount: 0, convenience: 0 },
    ]);
  };

  const removeAnnexure = (id: number) =>
    setAnnexures((prev) => prev.filter((a) => a.id !== id));

  const updateAnnexure = (
    index: number,
    field: "amount" | "convenience" | "name" | "file",
    value: any
  ) => {
    setAnnexures((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const totalAmount = annexures.reduce((sum, a) => sum + a.amount, 0);
  const totalConvenience = annexures.reduce((sum, a) => sum + a.convenience, 0);
  const grandTotal = totalAmount + totalConvenience;

  const handleSubmit = () => {
    if (!requestedDate || !selectedUser) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", String(selectedUser));
    formData.append("description", description);
    formData.append("flour", flour);
    formData.append("contractor_name", contractorName);
    formData.append("contractor_mobile", contractorMobile);
    formData.append("requested_date", new Date(requestedDate).toISOString());
    if (refundDate) formData.append("refund_date", new Date(refundDate).toISOString());
    if (expiryDate) formData.append("expiry_date", new Date(expiryDate).toISOString());
    formData.append("total_amount", String(grandTotal));
    formData.append("payment_mode", "PAY_AT_SITE");

    annexures.forEach((annex, index) => {
      if (!annex.name || !annex.file) return;
      formData.append(`fitout_annexures[${index}][annexure]`, annex.name);
      formData.append(`fitout_annexures[${index}][file]`, annex.file);
      formData.append(`fitout_annexures[${index}][amount]`, String(annex.amount));
      formData.append(`fitout_annexures[${index}][convenience]`, String(annex.convenience));
    });

    onSuccess(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium text-gray-700">Request Info</h2>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
            <FiX className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>

            {/* User Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User*
              </label>
              <select
                value={selectedUser ?? ""}
                onChange={(e) => setSelectedUser(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm text-gray-500"
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.username || `User ${u.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Fields (fixed binding) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requested Date*
              </label>
              <DatePicker
                value={requestedDate}
                onChange={(e: any) => setRequestedDate(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refund Date
              </label>
              <DatePicker
                value={refundDate}
                onChange={(e: any) => setRefundDate(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <DatePicker
                value={expiryDate}
                onChange={(e: any) => setExpiryDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Annexure Section */}
          <div className="border-t pt-6 mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Annexure Info</h3>

            {annexures.map((annex, index) => (
              <div
                key={annex.id}
                className="p-4 mb-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annexure*
                    </label>
                    <select
                      value={annex.name}
                      onChange={(e) => updateAnnexure(index, "name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm text-gray-500"
                    >
                      <option value="">Select Annexure</option>
                      {annexureTypes.map((a, i) => (
                        <option key={i} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File Upload*
                    </label>
                    <FileUpload onFileSelect={(file) => updateAnnexure(index, "file", file)} />
                    {annex.file && <p className="text-xs mt-1">{annex.file.name}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <input
                    type="number"
                    value={annex.amount}
                    onChange={(e) => updateAnnexure(index, "amount", Number(e.target.value))}
                    placeholder="Amount"
                    className="w-24 px-2 py-1 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    value={annex.convenience}
                    onChange={(e) =>
                      updateAnnexure(index, "convenience", Number(e.target.value))
                    }
                    placeholder="Convenience"
                    className="w-24 px-2 py-1 border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => removeAnnexure(annex.id)}
                    className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addAnnexure}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
            >
              <FiPlus className="w-4 h-4" />
              <span className="text-sm">Add Annexure</span>
            </button>
          </div>

          {/* Total */}
          <div className="flex justify-between text-sm mb-6">
            <span>Total: ₹{grandTotal.toFixed(2)}</span>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-md font-medium"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFitoutRequestForm;
