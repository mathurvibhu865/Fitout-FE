// import React, { useState, useMemo } from "react";
// import Button from "../../components/Button";
// import TextInput from "../../components/TextInput";
// import TopSearch from "../../components/TopSearch";
// import { FiEdit, FiSearch } from "react-icons/fi";
// import TopHead from "../../components/TopHead";

// import { useAnnexures } from "../../context/AnnexureContext";

// interface CategoryRow {
//   category: string;
//   bhk2: number;
//   bhk3: number;
//   bhk4: number;
//   flatRK: number;
//   flat1RK: number;
//   bhk2Small: number;
//   bhk1: number;
//   bhk2Terris: number;
//   bhk1RK: number;
//   annexures?: {id:number; fileName: string}[];
// }

// const Category: React.FC = () => {
//   const [categories, setCategories] = useState<CategoryRow[]>([
//     {
//       category: "Fitout",
//       bhk2: 75000,
//       bhk3: 100000,
//       bhk4: 30,
//       flatRK: 0,
//       flat1RK: 0,
//       bhk2Small: 0,
//       bhk1: 0,
//       bhk2Terris: 0,
//       bhk1RK: 0,
//     },
//   ]);

//   const [filters, setFilters] = useState<Record<string, string>>({
//     category: "",
//     bhk2: "",
//     bhk3: "",
//     bhk4: "",
//     flatRK: "",
//     flat1RK: "",
//     bhk2Small: "",
//     bhk1: "",
//     bhk2Terris: "",
//     bhk1RK: "",
//   });

//   // TopSearch state
//   // const [categories, setCategories] = useState<CategoryRow[]>([]);
//   const [allAnnexures, setAllAnnexures] = useState<{id: number; fileName: string;category: string }[]>([])
//   const [showFilters, setShowFilters] = useState(false);
//   const [showTopAdd, setShowTopAdd] = useState(false);
//   const [topCategory, setTopCategory] = useState("");

//   // Bottom form state
//   const [bottomCategory, setBottomCategory] = useState("");
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);

//   const columns = [
//     { label: "Action", align: "center" as const },
//     { label: "Category", align: "center" as const },
//     { label: "2BHK", align: "center" as const },
//     { label: "3BHK", align: "center" as const },
//     { label: "4BHK", align: "center" as const },
//     { label: "Flat RK", align: "center" as const },
//     { label: "Flat 1 RK", align: "center" as const },
//     { label: "2 BHK Small", align: "center" as const },
//     { label: "1 BHK", align: "center" as const },
//     { label: "2 BHK TERRIS BHK", align: "center" as const },
//     { label: "1 BHK RK", align: "center" as const },
//   ];

//   // Filtered categories
//   const { addAnnexure, annexures} = useAnnexures();
//   const filtered = useMemo(
//     () =>
//       categories.filter((row) =>
//         Object.entries(filters).every(([key, value]) => {
//           if (!value.trim()) return true;
//           return row[key as keyof CategoryRow]
//             .toString()
//             .toLowerCase()
//             .includes(value.toLowerCase());
//         })
//       ),
//     [categories, filters]
//   );

//   // Handlers
//   const handleTopAdd = () => setShowTopAdd(true);
//   const handleConfirmTopAdd = () => {
//     if (!topCategory.trim()) return;
//     setCategories([
//       ...categories,
//       {
//         category: topCategory,
//         bhk2: 0,
//         bhk3: 0,
//         bhk4: 0,
//         flatRK: 0,
//         flat1RK: 0,
//         bhk2Small: 0,
//         bhk1: 0,
//         bhk2Terris: 0,
//         bhk1RK: 0,
//       },
//     ]);
//     setTopCategory("");
//     setShowTopAdd(false);
//   };

//   const handleTopInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") handleConfirmTopAdd();
//     else if (e.key === "Escape") {
//       setShowTopAdd(false);
//       setTopCategory("");
//     }
//   };

//   const handleBottomAdd = async () => {
//     if (!bottomCategory.trim()) return;

//       const newCategory = {
      
//         category: bottomCategory,
//         bhk2: 0,
//         bhk3: 0,
//         bhk4: 0,
//         flatRK: 0,
//         flat1RK: 0,
//         bhk2Small: 0,
//         bhk1: 0,
//         bhk2Terris: 0,
//         bhk1RK: 0,
//         annexures: uploadedFile ? [{ id: Date.now(), fileName: uploadedFile.name}] : [],
//       };

//       setCategories([...categories, newCategory]);

//     if(uploadedFile) {
//       setAllAnnexures(prev => [
//         ...prev,
//         { id: Date.now(), fileName: uploadedFile.name, category: bottomCategory}
//       ]);
//     }

//     setBottomCategory("");
//     setUploadedFile(null);
//   };
 

//   return (
//     <div className="flex flex-col gap-4 text-gray-700" style={{ fontFamily: "'PT Sans', sans-serif" }}>
//       {/* TopSearch */}
//       <TopSearch
//         onSearch={() => setShowFilters((prev) => !prev)}
//         onButtonClick={(type) => type === "Add" && handleTopAdd()}
//         buttons={["Add"]}
//       >
//         {showTopAdd && (
//           <div className="flex items-center gap-2 ml-2">
//             <TextInput
//               name="top-category"
//               label=""
//               value={topCategory}
//               onChange={(e) => setTopCategory(e.target.value)}
//               onKeyDown={handleTopInputKeyDown}
//               placeholder="Enter category name"
//               className="w-56"
//             />
//             <Button label="Add" variant="gray-outline" onClick={handleConfirmTopAdd} />
//           </div>
//         )}
//       </TopSearch>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full border border-gray-300 border-collapse text-sm text-center rounded-md">
//           <TopHead columns={columns} />
//           <thead>
//             {showFilters && (
//               <tr className="bg-gray-50">
//                 <td className="px-2 py-1" />
//                 {Object.entries(filters).map(([key, value]) => (
//                   <td key={key} className="px-2 py-1">
//                     <TextInput
//                       name={key}
//                       label=""
//                       value={value}
//                       onChange={(e) =>
//                         setFilters((prev) => ({
//                           ...prev,
//                           [key]: e.target.value,
//                         }))
//                       }
//                       placeholder="Search"
//                       className="w-full text-center"
//                     />
//                   </td>
//                 ))}
//               </tr>
//             )}
//           </thead>
//           <tbody>
//             {filtered.length > 0 ? (
//               filtered.map((row, idx) => (
//                 <tr key={idx} className="hover:bg-gray-100">
//                   <td className="px-4 py-2">
//                     <FiEdit className="inline text-gray-500" />
//                   </td>
//                   <td className="px-4 py-2">{row.category}</td>
//                   <td className="px-4 py-2">{row.bhk2}</td>
//                   <td className="px-4 py-2">{row.bhk3}</td>
//                   <td className="px-4 py-2">{row.bhk4}</td>
//                   <td className="px-4 py-2">{row.flatRK}</td>
//                   <td className="px-4 py-2">{row.flat1RK}</td>
//                   <td className="px-4 py-2">{row.bhk2Small}</td>
//                   <td className="px-4 py-2">{row.bhk1}</td>
//                   <td className="px-4 py-2">{row.bhk2Terris}</td>
//                   <td className="px-4 py-2">{row.bhk1RK}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={columns.length} className="py-4 text-gray-400">
//                   No data found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Bottom Form */}
//       <div className="mt-6 p-4 border border-gray-300 rounded-md bg-white shadow-sm max-w-3xl">
//         <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//           {/* Category */}
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Enter Category</label>
//             <TextInput
//               name="bottom-category"
//               label=""
//               value={bottomCategory}
//               onChange={(e) => setBottomCategory(e.target.value)}
//               placeholder="Enter Category"
//               className="w-full"
//             />
//           </div>

//           {/* File Upload */}
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Fincut Guide</label>
//             <input
//               type="file"
//               onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 if (file) addAnnexure(file);
//               }}
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//             {uploadedFile && <p className="mt-1 text-sm text-gray-600">Selected file: {uploadedFile.name}</p>}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="mt-4 flex gap-3">
//           <Button label="Add" variant="gray-outline" onClick={handleBottomAdd} />
//           <Button label="Cancel" variant="danger" onClick={() => { setBottomCategory(""); setUploadedFile(null); }} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Category;



import React, { useState, useMemo } from "react";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import TopSearch from "../../components/TopSearch";
import { FiEdit } from "react-icons/fi";
import TopHead from "../../components/TopHead";

import { useAnnexures } from "../../context/AnnexureContext";

interface CategoryRow {
  category: string;
  bhk2: number;
  bhk3: number;
  bhk4: number;
  flatRK: number;
  flat1RK: number;
  bhk2Small: number;
  bhk1: number;
  bhk2Terrace: number;
  bhk1RK: number;
  annexures?: { id: number; fileName: string }[];
}

const Category: React.FC = () => {
  const [categories, setCategories] = useState<CategoryRow[]>([
    {
      category: "Fitout",
      bhk2: 75000,
      bhk3: 100000,
      bhk4: 30,
      flatRK: 0,
      flat1RK: 0,
      bhk2Small: 0,
      bhk1: 0,
      bhk2Terrace: 0,
      bhk1RK: 0,
    },
  ]);

  const [filters, setFilters] = useState<Record<string, string>>({
    category: "",
    bhk2: "",
    bhk3: "",
    bhk4: "",
    flatRK: "",
    flat1RK: "",
    bhk2Small: "",
    bhk1: "",
    bhk2Terrace: "",
    bhk1RK: "",
  });

  const [allAnnexures, setAllAnnexures] = useState<{id: number; fileName: string; category: string}[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showTopAdd, setShowTopAdd] = useState(false);
  const [topCategory, setTopCategory] = useState("");

  // Bottom form state
  const [bottomCategory, setBottomCategory] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const columns = [
    { label: "Action", align: "center" as const },
    { label: "Category", align: "center" as const },
    { label: "2BHK", align: "center" as const },
    { label: "3BHK", align: "center" as const },
    { label: "4BHK", align: "center" as const },
    { label: "Flat RK", align: "center" as const },
    { label: "Flat 1 RK", align: "center" as const },
    { label: "2 BHK Small", align: "center" as const },
    { label: "1 BHK", align: "center" as const },
    { label: "2 BHK TERRIS BHK", align: "center" as const },
    { label: "1 BHK RK", align: "center" as const },
  ];

  const { addAnnexure } = useAnnexures();

  const filtered = useMemo(
    () =>
      categories.filter((row) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value.trim()) return true;
          return row[key as keyof CategoryRow]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        })
      ),
    [categories, filters]
  );

  // Top add handlers
  const handleTopAdd = () => setShowTopAdd(true);
  const handleConfirmTopAdd = () => {
    if (!topCategory.trim()) return;
    setCategories([
      ...categories,
      {
        category: topCategory,
        bhk2: 0,
        bhk3: 0,
        bhk4: 0,
        flatRK: 0,
        flat1RK: 0,
        bhk2Small: 0,
        bhk1: 0,
        bhk2Terrace: 0,
        bhk1RK: 0,
      },
    ]);
    setTopCategory("");
    setShowTopAdd(false);
  };

  const handleTopInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleConfirmTopAdd();
    else if (e.key === "Escape") {
      setShowTopAdd(false);
      setTopCategory("");
    }
  };

  // Bottom add handler
  const handleBottomAdd = async () => {
    if (!bottomCategory.trim()) return;

    const newCategory: CategoryRow = {
      category: bottomCategory, // ✅ Corrected from name -> category
      bhk2: 0,
      bhk3: 0,
      bhk4: 0,
      flatRK: 0,
      flat1RK: 0,
      bhk2Small: 0,
      bhk1: 0,
      bhk2Terrace: 0,
      bhk1RK: 0,
      annexures: uploadedFile ? [{ id: Date.now(), fileName: uploadedFile.name }] : [],
    };

    setCategories([...categories, newCategory]);

    if (uploadedFile) {
      setAllAnnexures(prev => [
        ...prev,
        { id: Date.now(), fileName: uploadedFile.name, category: bottomCategory }
      ]);
    }

    setBottomCategory("");
    setUploadedFile(null);
  };

  return (
    <div className="flex flex-col gap-4 text-gray-700" style={{ fontFamily: "'PT Sans', sans-serif" }}>
      {/* TopSearch */}
      <TopSearch
        onSearch={() => setShowFilters(prev => !prev)}
        onButtonClick={(type) => type === "Add" && handleTopAdd()}
        buttons={["Add"]}
      >
        {showTopAdd && (
          <div className="flex items-center gap-2 ml-2">
            <TextInput
              name="top-category"
              label=""
              value={topCategory}
              onChange={(e) => setTopCategory(e.target.value)}
              onKeyDown={handleTopInputKeyDown}
              placeholder="Enter category name"
              className="w-56"
            />
            <Button label="Add" variant="gray-outline" onClick={handleConfirmTopAdd} />
          </div>
        )}
      </TopSearch>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 border-collapse text-sm text-center rounded-md">
          <TopHead columns={columns} />
          <thead>
            {showFilters && (
              <tr className="bg-gray-50">
                <td className="px-2 py-1" />
                {Object.entries(filters).map(([key, value]) => (
                  <td key={key} className="px-2 py-1">
                    <TextInput
                      name={key}
                      label=""
                      value={value}
                      onChange={(e) =>
                        setFilters(prev => ({ ...prev, [key]: e.target.value }))
                      }
                      placeholder="Search"
                      className="w-full text-center"
                    />
                  </td>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="px-4 py-2"><FiEdit className="inline text-gray-500" /></td>
                  <td className="px-4 py-2">{row.category}</td>
                  <td className="px-4 py-2">{row.bhk2}</td>
                  <td className="px-4 py-2">{row.bhk3}</td>
                  <td className="px-4 py-2">{row.bhk4}</td>
                  <td className="px-4 py-2">{row.flatRK}</td>
                  <td className="px-4 py-2">{row.flat1RK}</td>
                  <td className="px-4 py-2">{row.bhk2Small}</td>
                  <td className="px-4 py-2">{row.bhk1}</td>
                  <td className="px-4 py-2">{row.bhk2Terrace}</td>
                  <td className="px-4 py-2">{row.bhk1RK}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-4 text-gray-400">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Form */}
      <div className="mt-6 p-4 border border-gray-300 rounded-md bg-white shadow-sm max-w-3xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Category</label>
            <TextInput
              name="bottom-category"
              label=""
              value={bottomCategory}
              onChange={(e) => setBottomCategory(e.target.value)}
              placeholder="Enter Category"
              className="w-full"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fincut Guide</label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setUploadedFile(file); // ✅ fix
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploadedFile && <p className="mt-1 text-sm text-gray-600">Selected file: {uploadedFile.name}</p>}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button label="Add" variant="gray-outline" onClick={handleBottomAdd} />
          <Button label="Cancel" variant="danger" onClick={() => { setBottomCategory(""); setUploadedFile(null); }} />
        </div>
      </div>
    </div>
  );
};

export default Category;
