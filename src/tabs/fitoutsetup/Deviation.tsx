import React, { useState, useMemo, useEffect } from "react";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import Select from "../../components/Select";
import TopSearch from "../../components/TopSearch";
import AddDeviation from "../../forms/Adddeviation";
import TableHead from "../../components/TopHead";
import { FitoutRequestInstance } from "../../api/axiosinstance";

interface DeviationRow {
  id?: number; // backend id
  order: number;
  status: string;
  fixedStatus: string;
  colour: string;
}

const Deviation: React.FC = () => {
  const [status, setStatus] = useState("");
  const [fixedState, setFixedState] = useState("");
  const [color, setColor] = useState("#ff0000");
  const [order, setOrder] = useState<number | string>("");
  const [showFilters, setShowFilters] = useState(false);

  const [deviationList, setDeviationList] = useState<DeviationRow[]>([]);
  const [filters, setFilters] = useState({
    order: "",
    status: "",
    fixedStatus: "",
    colour: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch deviations on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await FitoutRequestInstance.get("/fitout-deviations/");
        setDeviationList(res.data);
      } catch (err) {
        console.error("Error fetching deviations:", err);
        setError("Failed to load deviations.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Add new deviation
  const handleAdd = async () => {
    if (status.trim() && fixedState && order !== "") {
      const newDeviation: DeviationRow = {
        status,
        fixedStatus: fixedState,
        colour: color,
        order: Number(order),
      };

      try {
        setLoading(true);
        const res = await FitoutRequestInstance.post(
          "/fitout-deviations/",
          newDeviation
        );
        setDeviationList(
          [...deviationList, res.data].sort((a, b) => a.order - b.order)
        );
        setStatus("");
        setFixedState("");
        setColor("#ff0000");
        setOrder("");
      } catch (err) {
        console.error("Error adding deviation:", err);
        setError("Failed to add deviation.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Update row
  const handleUpdate = async (
    index: number,
    field: keyof DeviationRow,
    value: string | number
  ) => {
    const updatedList = [...deviationList];
    const updatedRow = { ...updatedList[index], [field]: value };
    updatedList[index] = updatedRow;
    setDeviationList(updatedList);

    if (updatedRow.id) {
      try {
        await FitoutRequestInstance.put(
          `/fitout-deviations/${updatedRow.id}/`,
          updatedRow
        );
      } catch (err) {
        console.error("Error updating deviation:", err);
        setError("Failed to update deviation.");
      }
    }
  };

  // Delete row
  const handleDelete = async (index: number) => {
    const row = deviationList[index];
    if (row.id) {
      try {
        await FitoutRequestInstance.delete(
          `/fitout-deviations/${row.id}/`
        );
      } catch (err) {
        console.error("Error deleting deviation:", err);
        setError("Failed to delete deviation.");
      }
    }
    setDeviationList(deviationList.filter((_, i) => i !== index));
  };

  const columns = [
    { label: "Action", align: "center" as const },
    { label: "Order", align: "center" as const },
    { label: "Status", align: "center" as const },
    { label: "Fixed Status", align: "center" as const },
    { label: "Colour", align: "center" as const },
  ];

  // Filtering
  const filteredList = useMemo(() => {
    return deviationList.filter((row) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value.trim()) return true;
        return row[key as keyof DeviationRow]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  }, [filters, deviationList]);

  return (
    <div
      className="flex flex-col gap-4 text-gray-700"
      style={{ fontFamily: "'PT Sans', sans-serif" }}
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <TopSearch
          onSearch={() => setShowFilters((prev) => !prev)}
          onButtonClick={() => {}}
          buttons={[]}
        />

        <TextInput
          label=""
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Enter Status"
          className="h-10"
        />
        <Select
          label=""
          name="fixedState"
          value={fixedState}
          onChange={(e) => setFixedState(e.target.value)}
          options={["Open", "Closed", "Pending"]}
          placeholder="Select Fixed State"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-10 mb-4 border rounded"
        />
        <TextInput
          label=""
          name="order"
          type="number"
          value={String(order)}
          onChange={(e) =>
            setOrder(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="Order"
          className="h-10"
        />
        <Button label="Add" variant="solid" onClick={handleAdd} className="h-10" />

        <div className="ml-auto text-sm text-gray-500 px-2">
          1–{filteredList.length} of {filteredList.length}
        </div>
      </div>

      {/* Error / Loading */}
      {loading && (
        <div className="text-center text-blue-500">Loading...</div>
      )}
      {error && (
        <div className="text-center text-red-500">{error}</div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-center">
          {/* Table Head */}
          <TableHead columns={columns} />

          {/* Filters */}
          <thead>
            {showFilters && (
              <tr className="bg-gray-50">
                <td className="border px-2 py-1" />
                {Object.entries(filters).map(([key, value]) => (
                  <td key={key} className="border px-2 py-1">
                    <TextInput
                      name={key}
                      label=""
                      value={value}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      placeholder="Search"
                      className="w-full text-center h-9"
                    />
                  </td>
                ))}
              </tr>
            )}
          </thead>

          {/* Table Body */}
          <tbody className="bg-white">
            {filteredList.length > 0 ? (
              filteredList.map((row, index) => (
                <AddDeviation
                  key={row.id ?? index}
                  rowData={row}
                  onUpdate={(field, value) => handleUpdate(index, field, value)}
                  onDelete={() => handleDelete(index)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-4 text-gray-400">
                  No deviation data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Deviation;
