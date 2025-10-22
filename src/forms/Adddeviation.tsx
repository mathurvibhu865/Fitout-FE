import React, { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import TextInput from "../components/TextInput";
import Select from "../components/Select";


interface DeviationRow {
  id?: number; // Add id for backend reference
  order: number;
  status: string;
  fixedStatus: string;
  colour: string;
}

interface AddDeviationProps {
  rowData: DeviationRow;
  onDelete: (id?: number) => void; // parent callback
  onUpdate: (updatedRow: DeviationRow) => void; // parent callback
}

const AddDeviation: React.FC<AddDeviationProps> = ({ rowData, onDelete, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  // ✅ Update API
  const handleUpdate = async (field: keyof DeviationRow, value: string | number) => {
    const updatedRow = { ...rowData, [field]: value };
    onUpdate(updatedRow);

    if (rowData.id) {
      try {
        setLoading(true);
        await FitoutRequestInstance.put(`/fitout-deviations/${rowData.id}/`, updatedRow);
      } catch (error) {
        console.error("Update error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // ✅ Delete API
  const handleDelete = async () => {
    if (rowData.id) {
      try {
        setLoading(true);
        await FitoutRequestInstance.delete(`/fitout-deviations/${rowData.id}/`);
        onDelete(rowData.id);
      } catch (error) {
        console.error("Delete error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      // if it's a new unsaved row
      onDelete(rowData.id);
    }
  };

  return (
    <tr className={`hover:bg-gray-50 ${loading ? "opacity-50" : ""}`}>
      <td className="border px-4 py-2">
        <div className="flex items-center gap-2">
          <FiEdit2 className="cursor-pointer text-gray-500 hover:text-blue-600" />
          <FiTrash2
            onClick={handleDelete}
            className="cursor-pointer text-gray-500 hover:text-red-600"
          />
        </div>
      </td>
      <td className="border px-2 py-1">
        <TextInput
          name="order"
          label=""
          type="number"
          value={String(rowData.order)}
          onChange={(e) => handleUpdate("order", Number(e.target.value))}
        />
      </td>
      <td className="border px-2 py-1">
        <TextInput
          name="status"
          label=""
          value={rowData.status}
          onChange={(e) => handleUpdate("status", e.target.value)}
        />
      </td>
      <td className="border px-2 py-1">
        <Select
          name="fixedStatus"
          label=""
          value={rowData.fixedStatus}
          options={["Open", "Closed", "Pending"]}
          onChange={(e) => handleUpdate("fixedStatus", e.target.value)}
          placeholder="Select Fixed State"
        />
      </td>
      <td className="border px-2 py-1">
        <div className="flex items-center justify-center">
          <input
            type="color"
            value={rowData.colour}
            onChange={(e) => handleUpdate("colour", e.target.value)}
            className="w-10 h-10"
          />
        </div>
      </td>
    </tr>
  );
};

export default AddDeviation;
