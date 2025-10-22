import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FitoutRequestInstance} from "../api/axiosinstance";
import { FiFileText } from "react-icons/fi";

interface AnnexureItem {
  id: number;
  name: string;
  file_url?: string;
}

interface FitoutRequest {
  id: number;
  tower_id: number;
  flat_id: number;
  floor_id: number;
  description: string;
  contractor_name: string;
  contractor_mobile: string;
  refund_date: string | null;
  requested_date: string | null;
  expiry_date: string | null;
  master_status: string;
  total_amount: string;
  amount_paid: string;
  payment_mode: string;
  annexures: AnnexureItem[];
}

const ViewFitoutRequest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<FitoutRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await FitoutRequestInstance.get(`/fitout-requests/${id}/`);
        setRequest(res.data);
      } catch (error) {
        console.error("Error fetching fitout request:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!request) {
    return <div className="p-6 text-center text-red-500">Request not found</div>;
  }

  return (
    <div className="p-6 flex flex-col gap-6 text-gray-700" style={{ fontFamily: "'PT Sans', sans-serif" }}>
      {/* Request Info */}
      <section>
        <h3 className="bg-[#d0d0d0] px-2 py-1 text-sm font-semibold flex justify-center gap-4">
          Request Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 text-sm">
          <p><span className="font-semibold">Tower:</span> {request.tower_id}</p>
          <p><span className="font-semibold">Flat:</span> {request.flat_id}</p>
          <p><span className="font-semibold">Floor:</span> {request.floor_id}</p>
          <p><span className="font-semibold">Requested Date:</span> {request.requested_date || "-"}</p>
          <p><span className="font-semibold">Contractor Name:</span> {request.contractor_name || "-"}</p>
          <p><span className="font-semibold">Contractor Mobile:</span> {request.contractor_mobile || "-"}</p>
          <p><span className="font-semibold">Expiry Date:</span> {request.expiry_date || "-"}</p>
          <p><span className="font-semibold">Refund Date:</span> {request.refund_date || "-"}</p>
          <div className="md:col-span-4">
            <span className="font-semibold">Description:</span>
            <p className="mt-1">{request.description || "N/A"}</p>
          </div>
        </div>
      </section>

      {/* Annexure Info */}
      <section>
        <h3 className="bg-[#d0d0d0] px-2 py-1 text-sm font-semibold flex justify-center gap-4">
          Annexure Info
        </h3>
        <div className="p-4 flex flex-col gap-4 text-sm">
          {request.annexures && request.annexures.length > 0 ? (
            <ul className="space-y-2">
              {request.annexures.map((a) => (
                <li key={a.id} className="flex items-center gap-2">
                  <FiFileText className="text-gray-600" />
                  <span>{a.name}</span>
                  {a.file_url && (
                    <a
                      href={a.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-xs"
                    >
                      View File
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No annexures uploaded</p>
          )}

          <div className="text-sm space-y-1 pt-2">
            <p><span className="font-semibold">Amount:</span> {request.total_amount}</p>
            <p><span className="font-semibold">Amount Paid:</span> {request.amount_paid}</p>
            <p><span className="font-semibold">Payment Mode:</span> {request.payment_mode}</p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className="px-2 py-1 rounded bg-gray-200">{request.master_status}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => navigate(-1)} // navigate back
          className="bg-gray-400 text-white px-8 py-2 rounded-md"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewFitoutRequest;
