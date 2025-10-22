import React, { useState } from 'react';
import SendViolation from './Sendviolation';
import TopHead from '../components/TopHead';
import IconButton from '../components/IconButton';
import Pagination from '../components/Pagination';
import { FiEye, FiEdit } from 'react-icons/fi';

interface ViewDeviationProps {
  id: number;
}

const ViewDeviation: React.FC<ViewDeviationProps> = ({ id }) => {
  const [showViolation, setShowViolation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const checklist = {
    id: 148,
    fitoutRequestId: 1494,
    tower: 'A',
    flat: '1000',
    description: 'Demo Question1',
    status: 'Pending',
    createdOn: '30/04/2025',
    createdBy: 'Demo Demo',
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

  if (showViolation) {
    return <SendViolation data={checklist} onClose={() => setShowViolation(false)} />;
  }

  return (
    <div className="mt-4 bg-white rounded shadow px-6 py-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-md font-semibold">Demo Checklist</h2>
        <Pagination
          currentPage={currentPage}
          totalPages={1}
          totalItems={1}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <TopHead columns={columns} />
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <IconButton tooltip="View"><FiEye /></IconButton>
                  <IconButton tooltip="Edit"><FiEdit /></IconButton>
                </div>
              </td>
              <td className="px-4 py-2">{checklist.id}</td>
              <td className="px-4 py-2">{checklist.fitoutRequestId}</td>
              <td className="px-4 py-2">{checklist.description}</td>
              <td className="px-4 py-2">{checklist.status}</td>
              <td className="px-4 py-2">{checklist.createdOn}</td>
              <td className="px-4 py-2">{checklist.createdBy}</td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2">
                <button
                  onClick={() => setShowViolation(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Send Violation
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewDeviation;
