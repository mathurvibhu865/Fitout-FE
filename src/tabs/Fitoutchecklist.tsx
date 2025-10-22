// import React, { useState, useEffect, useMemo } from 'react';
// import TopSearch from '../components/TopSearch';
// import ToggleSwitch from '../components/ToggleSwitch';
// import { FiEye } from 'react-icons/fi';
// import AddChecklist from '../forms/Addchecklist';
// import ViewChecklist from '../forms/Viewchecklist';
// import TopHead from '../components/TopHead';
// import TextInput from '../components/TextInput';
// import { getFitoutChecklists } from '../api/endpoint';

// interface ChecklistRow {
//   id: number;
//   name: string;
//   status: boolean;
//   category: string;
//   sub_category: string;
//   associations: string[] | string; // sometimes string from API
//   questionCount: number;
// }

// const FitoutChecklist: React.FC = () => {
//   const [checklists, setChecklists] = useState<ChecklistRow[]>([]);
//   const [filters, setFilters] = useState({
//     name: '',
//     category: '',
//     sub_category: '',
//     associations: '',
//     questionCount: '',
//   });
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [viewChecklist, setViewChecklist] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Fetch checklists dynamically
//   useEffect(() => {
//     const fetchChecklists = async () => {
//       try {
//         setLoading(true);
//         const data = await getFitoutChecklists();
//         const mappedData = data.map((item: any) => ({
//           id: item.id,
//           name: item.name,
//           status: item.status,
//           category: item.category,
//           sub_category: item.sub_category,
//           associations: Array.isArray(item.associations)
//             ? item.associations
//             : (item.associations || '').split(',').map((a: string) => a.trim()),
//           questionCount: item.questions?.length || 0,
//         }));
//         setChecklists(mappedData);
//       } catch (err) {
//         console.error('Failed to fetch checklists', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchChecklists();
//   }, []);

//   const handleToggle = (index: number) => {
//     setChecklists((prev) =>
//       prev.map((item, i) =>
//         i === index ? { ...item, status: !item.status } : item
//       )
//     );
//   };

//   const filteredList = useMemo(() => {
//     return checklists.filter((item) =>
//       Object.entries(filters).every(([key, value]) => {
//         if (!value.trim()) return true;
//         const val = (item as any)[key];
//         return val.toString().toLowerCase().includes(value.toLowerCase());
//       })
//     );
//   }, [checklists, filters]);

//   if (showAddForm)
//     return (
//       <AddChecklist
//         onBack={() => setShowAddForm(false)}
//         onCreated={() => setShowAddForm(false)}
//       />
//     );
//   if (viewChecklist) return <ViewChecklist />;
  

//   const columns = [
//     { label: 'Action', align: 'center' as const, className: 'w-12' },
//     { label: 'Name', align: 'left' as const },
//     { label: 'Status', align: 'center' as const, className: 'w-20' },
//     { label: 'Category', align: 'left' as const },
//     { label: 'Subcategory', align: 'left' as const },
//     { label: 'Associations', align: 'left' as const },
//     { label: 'No. of Q.', align: 'center' as const, className: 'w-16' },
//   ];

//   return (
//     <div className="p-4 flex flex-col gap-4 text-gray-700">
//       <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
//         <TopSearch
//           onSearch={() => {}}
//           buttons={['Add']}
//           onButtonClick={(label) => {
//             if (label === 'Add') setShowAddForm(true);
//           }}
//         />
//         <div className="ml-auto text-sm text-gray-500 px-2">
//           {filteredList.length} of {checklists.length}
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse text-sm text-center">
//           <TopHead columns={columns} />
//           <thead>
//             <tr className="bg-gray-50 border-b">
//               <td />
//               <td>
//                 <TextInput
//                   name="name"
//                   label=""
//                   value={filters.name}
//                   onChange={(e) => setFilters({ ...filters, name: e.target.value })}
//                   placeholder="Search"
//                   className="w-full text-left h-9"
//                 />
//               </td>
//               <td />
//               <td>
//                 <TextInput
//                   name="category"
//                   label=""
//                   value={filters.category}
//                   onChange={(e) => setFilters({ ...filters, category: e.target.value })}
//                   placeholder="Search"
//                   className="w-full text-left h-9"
//                 />
//               </td>
//               <td>
//                 <TextInput
//                   name="username"
//                   label=""
//                   value={filters.sub_category}
//                   onChange={(e) => setFilters({ ...filters, sub_category: e.target.value })}
//                   placeholder="Search"
//                   className="w-full text-left h-9"
//                 />
//               </td>
//               <td>
//                 <TextInput
//                   name="email"  
//                   label=""
//                   value={filters.associations}
//                   onChange={(e) => setFilters({ ...filters, associations: e.target.value })}
//                   placeholder="Search"
//                   className="w-full text-left h-9"
//                 />
//               </td>
//               <td>
//                 <TextInput
//                   name="username"
//                   label=""
//                   value={filters.questionCount}
//                   onChange={(e) => setFilters({ ...filters, questionCount: e.target.value })}
//                   placeholder="Search"
//                   className="w-full text-center h-9"
//                 />
//               </td>
//             </tr>
//           </thead>

//           <tbody className="bg-white">
//             {loading ? (
//               <tr>
//                 <td colSpan={columns.length} className="py-4 text-gray-400">
//                   Loading...
//                 </td>
//               </tr>
//             ) : filteredList.length > 0 ? (
//               filteredList.map((item, idx) => (
//                 <tr key={item.id} className="hover:bg-gray-50 border-t">
//                   <td className="px-2 py-2 text-center w-12">
//                     <FiEye
//                       className="cursor-pointer mx-auto"
//                       onClick={() => setViewChecklist(true)}
//                     />
//                   </td>
//                   <td className="px-2 py-2 text-left">{item.name}</td>
//                   <td className="px-2 py-2 text-center w-20">
//                     <ToggleSwitch checked={item.status} onChange={() => handleToggle(idx)} />
//                   </td>
//                   <td className="px-2 py-2 text-left">{item.category}</td>
//                   <td className="px-2 py-2 text-left">{item.sub_category}</td>
//                   <td className="px-2 py-2 text-left">{Array.isArray(item.associations) ? item.associations.join(', ') : item.associations}</td>
//                   <td className="px-2 py-2 text-center w-16">{item.questionCount}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={columns.length} className="py-4 text-gray-400">
//                   No checklist found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default FitoutChecklist;





import React, { useState, useEffect, useMemo } from 'react';
import TopSearch from '../components/TopSearch';
import ToggleSwitch from '../components/ToggleSwitch';
import { FiEye, FiEdit3, FiTrash2 } from 'react-icons/fi';
import AddChecklist from '../forms/Addchecklist';
import ViewChecklist from '../forms/Viewchecklist';
import TopHead from '../components/TopHead';
import TextInput from '../components/TextInput';
import { getFitoutChecklists } from '../api/endpoint'; 
// ⚠️ Assuming your delete API function is available here.
// import { getFitoutChecklists, deleteFitoutChecklist } from '../api/endpoint'; 

// ⚠️ MOCK DELETE API FUNCTION - REPLACE WITH YOUR ACTUAL API CALL
const deleteFitoutChecklist = async (id: number) => {
    console.log(`Simulating deletion of checklist ID: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
};

interface ChecklistRow {
  id: number;
  name: string;
  status: boolean;
  category: string;
  sub_category: string;
  // ❌ Removed: associations
  questionCount: number;
}

const FitoutChecklist: React.FC = () => {
  const [checklists, setChecklists] = useState<ChecklistRow[]>([]);
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    sub_category: '',
    // ❌ Removed: associations filter
    questionCount: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewChecklist, setViewChecklist] = useState(false);
  const [selectedChecklistId, setSelectedChecklistId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        setLoading(true);
        const data = await getFitoutChecklists();
        const mappedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          status: item.status,
          category: item.category,
          sub_category: item.sub_category,
          // ❌ Excluded: associations from mapping
          questionCount: item.questions?.length || 0,
        }));
        setChecklists(mappedData);
      } catch (err) {
        console.error('Failed to fetch checklists', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChecklists();
  }, []);

  // --- State Handlers ---
  const handleToggle = (index: number) => {
    setChecklists((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, status: !item.status } : item
      )
    );
    // ⚠️ TODO: Call API here to update status on backend
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the checklist: "${name}"?`)) {
        return;
    }

    try {
        // ⚠️ REPLACE WITH YOUR ACTUAL API CALL
        await deleteFitoutChecklist(id); 
        setChecklists((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
        console.error(`Failed to delete checklist ID ${id}`, err);
        alert('Failed to delete checklist. Please try again.');
    }
  };

  const handleEdit = (id: number) => {
    console.log(`Edit checklist ID: ${id}`);
    alert(`Starting edit mode for checklist ID: ${id}`);
  };


  // --- DYNAMIC FILTERING LOGIC ---
  const filteredList = useMemo(() => {
    return checklists.filter((item) => {
      const lowerFilters = Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, value.toLowerCase().trim()])
      );

      return Object.entries(lowerFilters).every(([key, value]) => {
        if (!value) return true; 

        const itemValue = (item as any)[key];

        // The questionCount filter can remain, as it exists in the new interface
        if (key === 'questionCount') {
          return itemValue.toString().toLowerCase().includes(value);
        }
        
        // Default text-based filtering for Name, Category, Subcategory
        return itemValue.toString().toLowerCase().includes(value);
      });
    });
  }, [checklists, filters]);

  // --- Conditional Renders for Forms ---
  if (showAddForm)
    return (
      <AddChecklist
        onBack={() => setShowAddForm(false)}
        onCreated={() => setShowAddForm(false)}
      />
    );

  if (viewChecklist && selectedChecklistId !== null)
    return <ViewChecklist checklistId={selectedChecklistId} onBack={() => setViewChecklist(false)} />; 

  const columns = [
    { label: 'Action', align: 'center' as const, className: 'w-16' }, 
    { label: 'Name', align: 'left' as const },
    { label: 'Status', align: 'center' as const, className: 'w-20' },
    { label: 'Category', align: 'left' as const },
    { label: 'Subcategory', align: 'left' as const },
    // ❌ Removed: Associations column
    { label: 'No. of Q.', align: 'center' as const, className: 'w-16' },
  ];

  return (
    <div className="p-4 flex flex-col gap-4 text-gray-700">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <TopSearch
          onSearch={() => {}} 
          buttons={['Add']}
          onButtonClick={(label) => {
            if (label === 'Add') setShowAddForm(true);
          }}
        />
        <div className="ml-auto text-sm text-gray-500 px-2">
          {filteredList.length} of {checklists.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-center">
          <TopHead columns={columns} />
          {/* Filter row inputs */}
          <thead>
            <tr className="bg-gray-50 border-b">
              <td /> 
              <td>
                <TextInput
                  name="name" label="" value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  placeholder="Search Name" className="w-full text-left h-9"
                />
              </td>
              <td />
              <td>
                <TextInput
                  name="category" label="" value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  placeholder="Search Category" className="w-full text-left h-9"
                />
              </td>
              <td>
                <TextInput
                  name="sub_category" label="" value={filters.sub_category}
                  onChange={(e) => setFilters({ ...filters, sub_category: e.target.value })}
                  placeholder="Search Subcategory" className="w-full text-left h-9"
                />
              </td>
              {/* ❌ Removed: Associations filter input */}
              <td>
                <TextInput
                  name="questionCount" label="" value={filters.questionCount}
                  onChange={(e) => setFilters({ ...filters, questionCount: e.target.value })}
                  placeholder="Search No. Q" className="w-full text-center h-9"
                />
              </td>
            </tr>
          </thead>

          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-4 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : filteredList.length > 0 ? (
              // Dynamic row content
              filteredList.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50 border-t">
                  {/* Action Cell */}
                  <td className="px-2 py-2 text-center w-16">
                    <div className="flex justify-center items-center gap-2">
                      <FiEye
                        className="cursor-pointer text-blue-600"
                        title="View Checklist"
                        onClick={() => {
                          setSelectedChecklistId(item.id);
                          setViewChecklist(true);
                        }}
                      />
                      <FiEdit3 
                        className="cursor-pointer text-yellow-600"
                        title="Edit Checklist"
                        onClick={() => handleEdit(item.id)}
                      />
                      <FiTrash2 
                        className="cursor-pointer text-red-600"
                        title="Delete Checklist"
                        onClick={() => handleDelete(item.id, item.name)}
                      />
                    </div>
                  </td>
                  <td className="px-2 py-2 text-left">{item.name}</td>
                  <td className="px-2 py-2 text-center w-20">
                    <ToggleSwitch checked={item.status} onChange={() => handleToggle(idx)} />
                  </td>
                  <td className="px-2 py-2 text-left">{item.category}</td>
                  <td className="px-2 py-2 text-left">{item.sub_category}</td>
                  {/* ❌ Removed: Associations data cell */}
                  <td className="px-2 py-2 text-center w-16">{item.questionCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-4 text-gray-400">
                  No checklist found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FitoutChecklist;