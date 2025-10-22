import React, { useState } from 'react';
import DatePicker from '../components/DatePicker'; 
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { AiOutlineDoubleRight, AiOutlineDoubleLeft } from 'react-icons/ai';

const allFields = [
  'Id',
  'Tower',
  'Flat',
  'Flat Type',
  'Description',
  'Request',
  'Fitout Status',
  'Service Amount',
];

const FitoutReport: React.FC = () => {
  const [availableFields, setAvailableFields] = useState<string[]>(allFields);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([]);
  const [selectedSelected, setSelectedSelected] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const moveSelected = () => {
    const newAvailable = availableFields.filter(f => !selectedAvailable.includes(f));
    const newSelected = [...selectedFields, ...selectedAvailable];
    setAvailableFields(newAvailable);
    setSelectedFields(newSelected);
    setSelectedAvailable([]);
  };

  const moveAll = () => {
    setSelectedFields([...selectedFields, ...availableFields]);
    setAvailableFields([]);
    setSelectedAvailable([]);
  };

  const removeSelected = () => {
    const newSelected = selectedFields.filter(f => !selectedSelected.includes(f));
    const newAvailable = [...availableFields, ...selectedSelected];
    setAvailableFields(newAvailable);
    setSelectedFields(newSelected);
    setSelectedSelected([]);
  };

  const removeAll = () => {
    setAvailableFields([...availableFields, ...selectedFields]);
    setSelectedFields([]);
    setSelectedSelected([]);
  };

  return (
    <div
      className="mt-4 p-4 bg-white text-gray-700"
      style={{ fontFamily: "'PT Sans', sans-serif" }}
    >
      {/* Date Picker */}
      <div className="w-64 mb-4">
        <DatePicker
          label="Select Date Range"
          name="dateRange"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Dual list section */}
      <div className="flex gap-6">
        {/* All Values List */}
        <div className="flex-1">
          <label className="block font-medium mb-1">All Values</label>
          <select
            multiple
            className="border rounded w-full h-48 p-2 text-sm"
            value={selectedAvailable}
            onChange={(e) =>
              setSelectedAvailable(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {availableFields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>

        {/* Arrow Buttons */}
        <div className="flex flex-col justify-center items-center gap-2 mt-8">
          <button
            onClick={moveAll}
            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            <AiOutlineDoubleRight />
          </button>
          <button
            onClick={moveSelected}
            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            <FiChevronRight />
          </button>
          <button
            onClick={removeSelected}
            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={removeAll}
            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            <AiOutlineDoubleLeft />
          </button>
        </div>

        {/* Selected Values List */}
        <div className="flex-1">
          <label className="block font-medium mb-1">Selected Values</label>
          <select
            multiple
            className="border rounded w-full h-48 p-2 text-sm"
            value={selectedSelected}
            onChange={(e) =>
              setSelectedSelected(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {selectedFields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Export Button */}
   <div className="mt-6">
  <button className="bg-[#7991BB] hover:bg-[#6f84ad] text-white px-6 py-2 rounded text-sm">
    &#8681; Export
  </button>


      </div>
    </div>
  );
};

export default FitoutReport;
