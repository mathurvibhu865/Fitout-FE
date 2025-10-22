import React from 'react';
import TopHead from '../components/TopHead';

interface SendViolationProps {
  data: {
    id: number;
    tower: string;
    flat: string;
    status: string;
    description: string;
    createdOn: string;
    createdBy: string;
  };
  onClose: () => void;
}

const SendViolation: React.FC<SendViolationProps> = ({ data }) => {
  const columns = [
    { label: 'Violation', align: 'left' as const },
    { label: 'Attachments', align: 'left' as const },
    { label: 'Created At', align: 'left' as const },
    { label: 'Created By', align: 'left' as const },
  ];

  return (
    <div className="mt-4 p-4 bg-white text-gray-700" style={{ fontFamily: "'PT Sans', sans-serif" }}>
      <h2 className="text-md font-semibold mb-3">Violation Detail</h2>

      <div className="space-y-4 mb-6">
        {/* First row - 3 inputs */}
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-2">
            <label className="block font-medium text-sm min-w-[100px] text-right">Status:</label>
            <span className="bg-red-500 text-white px-3 py-1 rounded text-xs inline-block">
              {data.status}
            </span>
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="block font-medium text-sm min-w-[100px] text-right">ID:</label>
            <input
              value={data.id}
              disabled
              className="border flex-1 px-2 py-1 rounded"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="block font-medium text-sm min-w-[100px] text-right">Tower:</label>
            <input
              value={data.tower}
              disabled
              className="border flex-1 px-2 py-1 rounded"
            />
          </div>
        </div>

        {/* Second row - 3 inputs */}
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-2">
            <label className="block font-medium text-sm min-w-[100px] text-right">Flat:</label>
            <input
              value={data.flat}
              disabled
              className="border flex-1 px-2 py-1 rounded"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="block font-medium text-sm min-w-[100px] text-right">Created on:</label>
            <input
              value={data.createdOn}
              disabled
              className="border flex-1 px-2 py-1 rounded"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="block font-medium text-sm min-w-[100px] text-right">Created By:</label>
            <input
              value={data.createdBy}
              disabled
              className="border flex-1 px-2 py-1 rounded"
            />
          </div>
        </div>

        {/* Third row - 2 inputs */}
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-2">
            <label className="block font-medium text-sm min-w-[100px] text-right">Comments:</label>
            <input
              placeholder="Enter comments"
              className="border flex-1 px-2 py-1 rounded"
            />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <label className="block font-medium text-sm min-w-[100px] text-right">Description:</label>
            <input
              value={data.description}
              disabled
              className="border flex-1 px-2 py-1 rounded"
            />
          </div>
          <div className="flex-1"></div> {/* Empty space to maintain layout */}
        </div>
      </div>

      <h3 className="text-md font-semibold mb-2">Violation Detail</h3>
      <div className="overflow-x-auto bg-gray-50 rounded">
        <table className="min-w-full text-sm border">
          <TopHead columns={columns} />
          <tbody>
            <tr>
              <td className="px-3 py-2 border text-center" colSpan={4}>
                No violation data found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SendViolation;
