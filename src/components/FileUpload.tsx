import React, { useRef, useState } from 'react';

interface FileUploadProps {
  required?: boolean;
  label?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onChange: (files: FileList | null) => void;
  name?: string;
  fileSize?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  required = false,
  label,
  accept,
  multiple = false,
  disabled = false,
  onChange,
  name = "file",
  fileSize,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFileName(files && files.length > 0 ? 
      `${files.length} file${files.length > 1 ? 's' : ''} selected` : 
      null
    );
    onChange(files);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col space-y-2 mb-8">
      {/* Display label if provided */}
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      
      <div className="flex items-center border border-gray-300 p-10 rounded-md">
        {/* Custom styled button */}
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={disabled}
          className='cursor-pointer'
        >
          Choose Files
        </button>
        
        {/* File name display with border */}
        <div 
          className={`
            ml-3 px-4 py-2 bg-gray-200 border border-gray-300 rounded-md text-center
            text-sm text-[#5E5E5E] min-w-[150px] ${disabled ? 'opacity-50' : ''}
          `}
        >
          {fileName || "No Files Chosen"}
        </div>
      </div>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        name={name}
        accept={accept}
        multiple={multiple}
        required={required}
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;