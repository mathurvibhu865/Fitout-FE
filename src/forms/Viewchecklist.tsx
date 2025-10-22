import React, { useState, useEffect } from "react";
import TextInput from "../components/TextInput";
import ToggleSwitch from "../components/ToggleSwitch";
import Button from "../components/Button";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { getFitoutChecklistById, getChecklistQuestions, deleteChecklist } from "../api/endpoint";

interface Question {
  id: number;
  question_text: string;
  answer_type: string;
  is_mandatory: boolean;
  options?: { option_text: string }[];
}

interface ViewChecklistProps {
  checklistId: number;
  onBack?: () => void;
  onEdit?: (checklistId: number) => void;
  onDeleted?: () => void;
}

const ViewChecklist: React.FC<ViewChecklistProps> = ({ checklistId, onBack, onEdit, onDeleted }) => {
  const [checklist, setChecklist] = useState({
    title: "",
    category: "",
    subCategory: "",
    numberOfQuestions: 0,
    status: true,
    questions: [] as Question[],
    associations: [] as string[],
  });

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const data = await getFitoutChecklistById(checklistId);
        const questionsData = await getChecklistQuestions({ checklist: checklistId });

        setChecklist({
          title: data.name || "",
          category: data.category || "",
          subCategory: data.sub_category || "",
          numberOfQuestions: questionsData.length,
          status: data.status !== undefined ? data.status : true,
          questions: questionsData.map((q: any) => ({
            id: q.id,
            question_text: q.question_text,
            answer_type: q.answer_type,
            is_mandatory: q.is_mandatory,
            options: q.options || [],
          })),
          associations: data.associations?.map((a: any) => a.name) || [],
        });
      } catch (err) {
        console.error("Failed to fetch checklist:", err);
      }
    };

    fetchChecklist();
  }, [checklistId]);

  const handleStatusToggle = (value: boolean) => {
    setChecklist((prev) => ({ ...prev, status: value }));
    // TODO: Call API to update checklist status
  };

  const handleMandatoryToggle = (id: number, value: boolean) => {
    setChecklist((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, is_mandatory: value } : q)),
    }));
    // TODO: Call API to update question
  };

  const handleDeleteChecklist = async () => {
    if (confirm("Are you sure you want to delete this checklist?")) {
      try {
        await deleteChecklist(checklistId);
        onDeleted?.();
      } catch (err) {
        console.error("Failed to delete checklist:", err);
      }
    }
  };

  return (
    <div className="p-6">
      {/* Checklist Info */}
      <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded shadow">
        <TextInput label="Title" value={checklist.title} onChange={() => {}} name="title" />
        <TextInput label="Category" value={checklist.category} onChange={() => {}} name="category" />
        <TextInput label="Sub Category" value={checklist.subCategory} onChange={() => {}} name="subCategory" />
        <TextInput label="No. Of Questions" value={String(checklist.numberOfQuestions)} onChange={() => {}} name="numberOfQuestions" />

        <div className="col-span-4 flex items-center gap-2 mt-2">
          <label className="font-medium">Status:</label>
          <ToggleSwitch checked={checklist.status} onChange={handleStatusToggle} />
        </div>
      </div>

      <div className="mt-6 bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-semibold flex justify-center items-center">
        Associations: {checklist.associations.join(", ") || "-"}
      </div>

      {/* Questions */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {checklist.questions.map((q) => (
          <div key={q.id} className="bg-gray-100 p-4 rounded shadow relative">
            <div className="absolute top-2 right-2 flex gap-2 text-gray-600">
              <FiEye className="cursor-pointer hover:text-blue-600" title="View Question" />
              <FiEdit
                className="cursor-pointer hover:text-green-600"
                title="Edit Question"
                onClick={() => onEdit?.(q.id)}
              />
              <FiTrash2 className="cursor-pointer hover:text-red-600" title="Delete Question" />
            </div>

            <TextInput label={`Question ${q.id}`} value={q.question_text} onChange={() => {}} name={`question_${q.id}`} />
            <TextInput label="Answer Type" value={q.answer_type} onChange={() => {}} name={`answerType_${q.id}`} />

            <div className="flex items-center gap-2 mt-2">
              <label className="font-medium">Mandatory:</label>
              <ToggleSwitch checked={q.is_mandatory} onChange={(val) => handleMandatoryToggle(q.id, val)} />
            </div>

            <div className="mt-2 flex gap-2 flex-wrap">
              {q.options?.map((opt, idx) => (
                <TextInput
                  key={idx}
                  label={`Option ${idx + 1}`}
                  value={opt.option_text}
                  onChange={() => {}}
                  name={`option_${q.id}_${idx}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-center gap-4">
        <Button label="Edit Checklist" onClick={() => onEdit?.(checklistId)} />
        <Button label="Delete Checklist" variant="red-outline" onClick={handleDeleteChecklist} />
        {onBack && <Button label="Back" variant="gray-outline" onClick={onBack} />}
      </div>
    </div>
  );
};

export default ViewChecklist;
