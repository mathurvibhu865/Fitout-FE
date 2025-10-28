import React, { useState, useRef, useMemo, useEffect } from 'react';
import TextInput from '../components/TextInput';
import Select from '../components/Select';
import Button from '../components/Button';
import ToggleSwitch from '../components/ToggleSwitch';
import { FiPlus, FiX, FiArrowRight } from 'react-icons/fi';
import { 
    createFitoutChecklist, 
    createChecklistQuestion, 
    getWorkCategories, 
    getSubCategories  
} from '../api/endpoint';
import type { FitoutChecklistPayload, WorkCategory, SubCategory } from '../api/endpoint'; 

// =================================================================
//                     INTERFACES
// =================================================================

interface SelectOption {
    value: string;
    label: string;
}

// Interface to structure the API data for use in the component
interface DynamicFitoutCategory {
    name: string;
    subcategories: string[]; 
}

// =================================================================
//                      MAIN COMPONENT
// =================================================================

interface AddChecklistProps {
    onBack: () => void;
    onCreated: () => void;
}

const AddChecklist: React.FC<AddChecklistProps> = ({ onBack, onCreated }) => {
    // State to hold dynamic categories fetched from the API
    const [fitoutCategories, setFitoutCategories] = useState<DynamicFitoutCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [title, setTitle] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [answerType, setAnswerType] = useState('');
    const [isMandatory, setIsMandatory] = useState(false);
    const [numQuestions, setNumQuestions] = useState('01');
    const [totalQuestions, setTotalQuestions] = useState('1');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    // 🚀 Effect hook to fetch data on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch main categories and subcategories concurrently
                const [workCategories, subCategories] = await Promise.all([
                    getWorkCategories(),
                    getSubCategories(),
                ]);

                // Group subcategories by their category ID
                const subcategoriesMap = subCategories.reduce((acc, sub: SubCategory) => {
                    if (!acc[sub.work_category]) {
                        acc[sub.work_category] = [];
                    }
                    // Only store the name string
                    acc[sub.work_category].push(sub.name); 
                    return acc;
                }, {} as Record<number, string[]>); // Grouped by category ID

                // Map fetched data to the required component structure
                const dynamicCategories: DynamicFitoutCategory[] = workCategories.map((cat: WorkCategory) => ({
                    name: cat.name,
                    subcategories: subcategoriesMap[cat.id] || [],
                }));

                setFitoutCategories(dynamicCategories);
            } catch (error) {
                console.error("Failed to fetch fitout categories:", error);
                // Optionally handle error state
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []); 

    // Memoized options for the main Category Select based on fetched state
    const 
    
    CATEGORY_OPTIONS: SelectOption[] = useMemo(() => 
        fitoutCategories.map(cat => ({
            value: cat.name,
            label: cat.name,
        }))
    , [fitoutCategories]); 

    // Memoized logic for subCategory options based on the selected category
    const subCategoryOptions: SelectOption[] = useMemo(() => {
        const selectedCat = fitoutCategories.find(cat => cat.name === category);
        if (selectedCat) {
            return selectedCat.subcategories.map(sub => ({
                value: sub,
                label: sub,
            }));
        }
        return [];
    }, [category, fitoutCategories]); 

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
        setSubCategory(''); // Reset subCategory when category changes
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        try {
            // Step 1: Create Checklist
            // 💡 UPDATED: Using 'work_category' for category and 'sub_category' for subCategory in the payload
            const checklistPayload: FitoutChecklistPayload = {
                fitout_request: 1, // TODO: replace with actual request ID
                name: title,
                work_category: category, // <-- CHANGE 1: Use 'work_category'
                sub_category: subCategory, // <-- CHANGE 2: Use 'sub_category'
                
            };

            const checklist = await createFitoutChecklist(checklistPayload);

            // Step 2: Add Question
            if (newQuestion && answerType) {
                await createChecklistQuestion({
                    checklist: checklist.id,
                    question_text: newQuestion,
                    answer_type: answerType as 'text' | 'yes_no' | 'multiple_choice',
                    is_mandatory: isMandatory,
                    photo_required: !!selectedFile,
                    options:
                        answerType === 'multiple_choice'
                            ? [
                                { option_text: 'Option 1' },
                                { option_text: 'Option 2' },
                            ]
                            : undefined,
                });
            }

            onCreated();
        } catch (err) {
            console.error('Failed to create checklist:', err);
        }
    };

    const handleProceed = () => {
        // Handle proceed action
        console.log('Proceed clicked');
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="text-white text-lg">Loading categories...</div>
            </div>
        );
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Add Checklist</h2>
                    <button 
                        onClick={onBack}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Category - NOW DYNAMIC */}
                            <div>
                                <Select
                                    label="Work Category" // Label updated for clarity
                                    name="category"
                                    value={category}
                                    onChange={handleCategoryChange} 
                                    options={CATEGORY_OPTIONS} 
                                    placeholder="Select Work Category" // Placeholder updated for clarity
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <TextInput
                                    label="Title of the Checklist"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter the title"
                                />
                            </div>

                            {/* New Question */}
                            <div>
                                <TextInput
                                    label="New Question"
                                    name="new-question"
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    placeholder="Enter Your Question"
                                />
                            </div>

                            {/* Answer Type and Mandatory */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Select
                                        label="Select Answer Type"
                                        name="answer-type"
                                        value={answerType}
                                        onChange={(e) => setAnswerType(e.target.value)}
                                        options={[
                                            { value: 'text', label: 'Text' },
                                            { value: 'yes_no', label: 'Yes/No' },
                                            { value: 'multiple_choice', label: 'Multiple Choice' },
                                        ]}
                                        placeholder="Choose Answer Type"
                                    />
                                </div>
                                
                                <div className="flex flex-col justify-end">
                                    <div className="flex items-center space-x-3 pb-2">
                                        <span className="text-sm font-medium text-gray-700">Mandatory</span>
                                        <ToggleSwitch checked={isMandatory} onChange={setIsMandatory} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Sub-Category - DYNAMIC & DEPENDENT */}
                            <div>
                                <Select
                                    label="Sub-Category"
                                    name="subcategory"
                                    value={subCategory}
                                    onChange={(e) => setSubCategory(e.target.value)}
                                    options={subCategoryOptions} 
                                    placeholder={category ? "Select Sub-Category" : "Select Category first"}
                                    disabled={!category || isLoading} 
                                />
                            </div>

                            {/* Question Numbers */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Select
                                        label="Add No. of Questions"
                                        name="num-questions"
                                        value={numQuestions}
                                        onChange={(e) => setNumQuestions(e.target.value)}
                                        options={[
                                            { value: '01', label: '01' },
                                            { value: '02', label: '02' },
                                            { value: '03', label: '03' },
                                            { value: '04', label: '04' },
                                            { value: '05', label: '05' },
                                        ]}
                                        placeholder="01"
                                    />
                                </div>

                                <div className="flex items-end">
                                    <div className="w-full">
                                        <div className="flex items-center space-x-2">
                                            <FiArrowRight className="w-5 h-5 text-gray-400 mt-6" />
                                            <div className="flex-1">
                                                <TextInput
                                                    label="No. of Questions"
                                                    name="total-questions"
                                                    value={totalQuestions}
                                                    onChange={(e) => setTotalQuestions(e.target.value)}
                                                    placeholder="1"
                                                    className="text-center"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Add Questions Area */}
                            <div>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer">
                                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2">
                                        <FiPlus className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 text-sm">Click to add more questions</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 mt-8 pt-6 border-t">
                        <Button
                            label="Create Checklist"
                            variant="solid"
                            className="bg-[#7991BB] hover:bg-[#6f84ad] text-white px-6 py-2 rounded-md font-medium"
                            onClick={handleSubmit}
                        />
                        <Button
                            label="Proceed"
                            variant="outline"
                            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-md font-medium"
                            onClick={handleProceed}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddChecklist;