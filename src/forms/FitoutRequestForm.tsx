// AddFitoutRequestForm.tsx
import React, { useEffect, useState } from "react";
import TextInput from "../components/TextInput";
import TextArea from "../components/TextArea";
import DatePicker from "../components/DatePicker";
import FileUpload from "../components/FileUpload";

import {
  getBuildingsBySite,
  getFloorsByBuilding,
  getUnitsByFloor,
  // getWorkCategories,
  getAnnexures,
  createFitoutRequest,
  getUsers,
 
} from "../api/endpoint";

import type { FitoutAnnexurePayload, FitoutRequestPayload } from "../api/endpoint";

interface AnnexureItem {
  id: number;
  name: string;
  file?: File;
  amount: number;
  convenience: number;
}

const AddFitoutRequestForm: React.FC<{ onSuccess: () => void; onCancel: () => void }> = ({ onSuccess, onCancel }) => {
  // const [towers, setTowers] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [annexureTypes, setAnnexureTypes] = useState<string[]>([]);
  // const [selectedTower, setSelectedTower] = useState<number | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedFlat, setSelectedFlat] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [contractorName, setContractorName] = useState("");
  const [contractorMobile, setContractorMobile] = useState("");
  const [requestedDate, setRequestedDate] = useState<Date | null>(null);
  const [refundDate, setRefundDate] = useState<Date | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  const [selectedAnnexure, setSelectedAnnexure] = useState("");
  const [annexureFile, setAnnexureFile] = useState<File | null>(null);
  const [annexureAmount, setAnnexureAmount] = useState<number>(0);
  const [annexureConvenience, setAnnexureConvenience] = useState<number>(0);
  const [annexures, setAnnexures] = useState<AnnexureItem[]>([]);

  // Fetch towers, users, annexures
  useEffect(() => {
    const fetchMeta = async () => {
      const siteId = localStorage.getItem("siteId");
      if (siteId) {
        // const buildings = await getBuildingsBySite(Number(siteId));
        // setTowers(buildings);
      }

      const annexRes = await getAnnexures();
      setAnnexureTypes(annexRes.map(a => a.name));

      const userRes = await getUsers();
      setUsers(userRes);
    };
    fetchMeta();
  }, []);

  // useEffect(() => {
  //   if (selectedTower) {
  //     getFloorsByBuilding(selectedTower).then(setFloors);
  //     setFlats([]);
  //     setSelectedFloor(null);
  //     setSelectedFlat(null);
  //   }
  // }, [selectedTower]);

  useEffect(() => {
    if (selectedFloor) {
      getUnitsByFloor(selectedFloor).then(setFlats);
      setSelectedFlat(null);
    }
  }, [selectedFloor]);

  // Annexure handlers
  const addAnnexure = () => {
    if (!selectedAnnexure || !annexureFile) return;
    setAnnexures(prev => [
      ...prev,
      {
        id: Date.now(),
        name: selectedAnnexure,
        file: annexureFile,
        amount: annexureAmount,
        convenience: annexureConvenience
      }
    ]);
    setSelectedAnnexure("");
    setAnnexureFile(null);
    setAnnexureAmount(0);
    setAnnexureConvenience(0);
  };

  const removeAnnexure = (id: number) => setAnnexures(prev => prev.filter(a => a.id !== id));

  const updateAnnexure = (index: number, field: "amount" | "convenience", value: number) => {
    if (value < 0) return;
    setAnnexures(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const totalAmount = annexures.reduce((sum, a) => sum + a.amount, 0);
  const totalConvenience = annexures.reduce((sum, a) => sum + a.convenience, 0);
  const grandTotal = totalAmount + totalConvenience;

  // Submit form
  const handleSubmit = async () => {
    if (!requestedDate || !selectedUser) {
      alert("Please fill all required fields.");
      return;
    }

    // Prepare fitout_annexures payload
    const fitout_annexures: FitoutAnnexurePayload[] = annexures.map(a => ({
      annexure: a.id,
      file: a.file || null
    }));

    const payload: FitoutRequestPayload = {
      // building_id: selectedTower,
      // floor_id: selectedFloor!,
      // unit_id: selectedFlat,
      user_id: selectedUser,
      description,
      contractor_name: contractorName,
      contractor_mobile: contractorMobile,
      requested_date: requestedDate,
      refund_date: refundDate || undefined,
      expiry_date: expiryDate || undefined,
      total_amount: grandTotal,
      payment_mode: "PAY_AT_SITE",
      fitout_annexures
    };

    await createFitoutRequest(payload);
    onSuccess();
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md text-gray-700 max-w-3xl mx-auto flex flex-col gap-6">
      {/* <div className="grid grid-cols-2 gap-4">
        {/* Tower */}
        <div>
          <label className="block mb-1">Tower*</label>
          <select className="w-full border px-3 py-2 rounded" value={selectedTower ?? ""} onChange={e => setSelectedTower(Number(e.target.value))}>
            <option value="">Select Tower</option>
            {towers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div> */}

        {/* Floor */}
        <div>
          <label className="block mb-1">Floor*</label>
          <select className="w-full border px-3 py-2 rounded" value={selectedFloor ?? ""} onChange={e => setSelectedFloor(Number(e.target.value))}>
            <option value="">Select Floor</option>
            {floors.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>

        {/* Flat */}
        <div>
          <label className="block mb-1">Flat*</label>
          <select className="w-full border px-3 py-2 rounded" value={selectedFlat ?? ""} onChange={e => setSelectedFlat(Number(e.target.value))}>
            <option value="">Select Flat</option>
            {flats.map(fl => <option key={fl.id} value={fl.id}>{fl.name}</option>)}
          </select>
        </div>

        {/* User */}
        <div>
          <label className="block mb-1">User*</label>
          <select className="w-full border px-3 py-2 rounded" value={selectedUser ?? ""} onChange={e => setSelectedUser(Number(e.target.value))}>
            <option value="">Select User</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        <TextArea label="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <TextInput label="Contractor Name" value={contractorName} onChange={e => setContractorName(e.target.value)} />
        <TextInput label="Contractor Mobile No" value={contractorMobile} onChange={e => setContractorMobile(e.target.value)} />
        <DatePicker label="Requested Date*" value={requestedDate} onChange={setRequestedDate} />
        <DatePicker label="Refund Date" value={refundDate} onChange={setRefundDate} />
        <DatePicker label="Expiry Date" value={expiryDate} onChange={setExpiryDate} />
      </div>

      {/* Annexure Section */}
      <div className="border p-4 rounded-md flex flex-col gap-4">
        <h3 className="font-semibold">Annexure Info</h3>
        <div className="flex gap-2 items-end">
          <select className="border px-3 py-2 rounded" value={selectedAnnexure} onChange={e => setSelectedAnnexure(e.target.value)}>
            <option value="">Select Annexure</option>
            {annexureTypes.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <FileUpload onFileSelect={setAnnexureFile} />
          <input type="number" placeholder="Amount" className="border px-2 py-1 rounded w-24" value={annexureAmount} onChange={e => setAnnexureAmount(Number(e.target.value))} />
          <input type="number" placeholder="Convenience" className="border px-2 py-1 rounded w-24" value={annexureConvenience} onChange={e => setAnnexureConvenience(Number(e.target.value))} />
          <button onClick={addAnnexure} type="button" className="px-3 py-2 bg-gray-200 rounded">+ Add Annexure</button>
        </div>

        <ul className="flex flex-col gap-2">
          {annexures.map((a, index) => (
            <li key={a.id} className="flex items-center gap-4">
              <span className="w-40">{a.name}</span>
              <input type="number" className="border px-2 py-1 rounded w-24" value={a.amount} onChange={e => updateAnnexure(index, "amount", Number(e.target.value))} placeholder="Amount" />
              <input type="number" className="border px-2 py-1 rounded w-24" value={a.convenience} onChange={e => updateAnnexure(index, "convenience", Number(e.target.value))} placeholder="Convenience" />
              <span className="font-semibold">Total: {a.amount + a.convenience}</span>
              <button type="button" onClick={() => removeAnnexure(a.id)} className="px-2 py-1 bg-red-300 rounded">Remove</button>
            </li>
          ))}
        </ul>

        <div className="mt-2 font-semibold">Grand Total: {grandTotal}</div>
      </div>

      <div className="flex gap-4 justify-end">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
      </div>
    </div>
  );
};

export default AddFitoutRequestForm;
