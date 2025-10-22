import React, { useState, useRef } from 'react';
import { FiPlus, FiDownload, FiTrash2 } from 'react-icons/fi';
import Button from '../../components/Button';
import TopHead from '../../components/TopHead';
// import TopSearch from '../../components/TopSearch';

interface UploadedFile {
  id: number;
  name: string;
}

const FitoutGuide: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([
    { id: 1, name: 'Sample_FITOUT_guidelines.docx' },
  ]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const newFile: UploadedFile = {
        id: files.length + 1,
        name: selectedFile.name,
      };
      setFiles([...files, newFile]);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const columns = [
    { label: 'Action', align: 'center' as const },
    { label: 'SR No.', align: 'center' as const },
    { label: 'File Name', align: 'center' as const },
  ];

  return (
    <div
      className="flex flex-col gap-6 text-gray-700"
      style={{ fontFamily: "'PT Sans', sans-serif" }}
    >
      {/* TopSearch bar */}
      {/* <TopSearch onSearch={() => {}} buttons={[]} onButtonClick={() => {}} /> */}

      {/* Upload Section */}
      <div className="flex items-center gap-4">
        <label
          htmlFor="file-upload"
          className="w-64 h-32 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 text-center text-sm"
        >
          {selectedFile ? (
            <span className="text-sm text-gray-600 px-4">{selectedFile.name}</span>
          ) : (
            <FiPlus size={40} className="text-gray-400" />
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          label="Upload"
          variant="solid"
          onClick={handleUpload}
          disabled={!selectedFile}
          className="h-10"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-center">
          <TopHead columns={columns} />
          <tbody className="bg-white">
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  <div className="flex justify-center items-center gap-3">
                    <FiDownload
                      className="cursor-pointer text-gray-500 hover:text-blue-600"
                      title="Download"
                    />
                    <FiTrash2
                      onClick={() => handleDelete(file.id)}
                      className="cursor-pointer text-gray-500 hover:text-red-600"
                      title="Delete"
                    />
                  </div>
                </td>
                <td className="border px-4 py-2">{file.id}</td>
                <td className="border px-4 py-2">{file.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FitoutGuide;
