import React, { useState } from 'react';
import DatePicker from '../../components/DatePicker';

interface TransferItem {
  id: number;
  name: string;
}

const FitoutReports: React.FC = () => {
  const [selectedAllValues, setSelectedAllValues] = useState<number[]>([]);
  const [selectedSelectedValues, setSelectedSelectedValues] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState('');
  const [allValues, setAllValues] = useState<TransferItem[]>([
    { id: 1, name: 'ID' },
    { id: 2, name: 'Flat' },
    { id: 3, name: 'Flat Type' },
    { id: 4, name: 'Tower' },
    { id: 5, name: 'Status' },
    { id: 6, name: 'Deviation Type' },
  ]);
  
  const [selectedValues, setSelectedValues] = useState<TransferItem[]>([]);


  const transferAllToRight = () => {
    setSelectedValues([...selectedValues, ...allValues]);
    setAllValues([]);
    setSelectedAllValues([]);
  };

  const transferSelectedToRight = () => {
    const itemsToTransfer = allValues.filter(item => selectedAllValues.includes(item.id));
    setSelectedValues([...selectedValues, ...itemsToTransfer]);
    setAllValues(allValues.filter(item => !selectedAllValues.includes(item.id)));
    setSelectedAllValues([]);
  };

  const transferSelectedToLeft = () => {
    const itemsToTransfer = selectedValues.filter(item => selectedSelectedValues.includes(item.id));
    setAllValues([...allValues, ...itemsToTransfer]);
    setSelectedValues(selectedValues.filter(item => !selectedSelectedValues.includes(item.id)));
    setSelectedSelectedValues([]);
  };

  const transferAllToLeft = () => {
    setAllValues([...allValues, ...selectedValues]);
    setSelectedValues([]);
    setSelectedSelectedValues([]);
  };

  const toggleAllSelection = (id: number) => {
    if (selectedAllValues.includes(id)) {
      setSelectedAllValues(selectedAllValues.filter(itemId => itemId !== id));
    } else {
      setSelectedAllValues([...selectedAllValues, id]);
    }
  };

  const toggleSelectedSelection = (id: number) => {
    if (selectedSelectedValues.includes(id)) {
      setSelectedSelectedValues(selectedSelectedValues.filter(itemId => itemId !== id));
    } else {
      setSelectedSelectedValues([...selectedSelectedValues, id]);
    }
  };

  return (
    <div>
      <div className="max-w-4xl"> 
        <div className="mb-6">
          <DatePicker
            label="Select Date Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            name="dateRange"
            type="date"
          />
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium text-gray-700">All Values</h3>
            <span className="text-sm text-gray-500">{allValues.length} items</span>
            <h3 className="text-base font-medium text-gray-700">Selected Values</h3>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <div className="border border-gray-300 rounded-md h-48 overflow-y-auto bg-white">
                {allValues.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 ${
                      selectedAllValues.includes(item.id) ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => toggleAllSelection(item.id)}
                  >
                    {item.name}
                  </div>
                ))}
                {allValues.length === 0 && (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No items available
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 px-2">
              <button 
                className="w-12 h-8 border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 disabled:opacity-50"
                onClick={transferAllToRight}
                disabled={allValues.length === 0}
              >
                ≫
              </button>
              <button 
                className="w-12 h-8 border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 disabled:opacity-50"
                onClick={transferSelectedToRight}
                disabled={selectedAllValues.length === 0}
              >
                &gt;
              </button>
              <button 
                className="w-12 h-8 border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 disabled:opacity-50"
                onClick={transferSelectedToLeft}
                disabled={selectedSelectedValues.length === 0}
              >
                &lt;
              </button>
              <button 
                className="w-12 h-8 border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 disabled:opacity-50"
                onClick={transferAllToLeft}
                disabled={selectedValues.length === 0}
              >
                ≪
              </button>
            </div>

            <div className="flex-1">
              <div className="border border-gray-300 rounded-md h-48 overflow-y-auto bg-white">
                {selectedValues.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 ${
                      selectedSelectedValues.includes(item.id) ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => toggleSelectedSelection(item.id)}
                  >
                    {item.name}
                  </div>
                ))}
                {selectedValues.length === 0 && (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No items selected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <span>📁</span>
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default FitoutReports;