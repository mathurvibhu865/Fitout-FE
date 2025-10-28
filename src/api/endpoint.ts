// // src/api/endpoint.ts
// import { FitoutRequestInstance, AccountInstance } from "./axiosinstance";

// // -------------------- Helpers --------------------
// const unwrap = <T>(data: any): T[] => {
//   if (Array.isArray(data)) return data;
//   if (data?.results) return data.results;
//   return data ?? [];
// };

// const readSiteId = (): number | null => {
//   const stored = localStorage.getItem("siteId");
//   return stored ? parseInt(stored, 10) : null;
// };

// // -------------------- Buildings / Floors / Units --------------------
// export const getBuildingsBySite = async (siteId: number) => {
//   const { data } = await AccountInstance.get(`/buildings/by-site/${siteId}/`);
//   return unwrap(data);
// };

// export const getBuildingById = async (id: number) => {
//   if (id == null) return null;
//   const { data } = await AccountInstance.get(`/buildings/${id}/`);
//   return data;
// };

// export const getFloorsByBuilding = async (buildingId: number) => {
//   const { data } = await AccountInstance.get(`/floors/by-building/${buildingId}/`);
//   return unwrap(data);
// };

// export const getUnitsByFloor = async (floorId: number) => {
//   const { data } = await AccountInstance.get(`/units/by-floor/${floorId}/`);
//   return unwrap(data);
// };

// // -------------------- Fitout Requests --------------------
// export interface FitoutAnnexurePayload {
//   annexure: number;
//   file?: File | null;
// }

// export interface FitoutRequestPayload {
//   building_id?: number;
//   floor_id?: number;
//   unit_id?: number;
//   user_id?: number;
//   description?: string;
//   contractor_name?: string;
//   contractor_mobile?: string;
//   requested_date?: Date;
//   refund_date?: Date;
//   expiry_date?: Date;
//   total_amount?: number;
//   payment_mode?: "PAY_AT_SITE" | "ONLINE";
//   unit_costs?: {
//     "1BHK"?: number;
//     "2BHK"?: number;
//     "1BHK_RK"?: number;
//     "2BHK_TERRIS"?: number;
//     "1BHK_again"?: number;
//   };
//   fitout_annexures?: FitoutAnnexurePayload[];
//   [key: string]: any;
// }

// export const getFitoutRequests = async () => {
//   const { data } = await FitoutRequestInstance.get("/fitout-requests/");
//   return unwrap(data);
// };

// export const getFitoutRequestById = async (id: number) => {
//   const { data } = await FitoutRequestInstance.get(`/fitout-requests/${id}/`);
//   return data;
// };

// // NOTE: Accepts FormData for file uploads
// export const createFitoutRequest = async (formData: FormData) => {
//   const { data } = await FitoutRequestInstance.post(`/fitout-requests/`, formData);
//   return data;
// };

// export const updateFitoutRequest = async (id: number, payload: FitoutRequestPayload) => {
//   const { fitout_annexures, ...rest } = payload;
//   const { data } = await FitoutRequestInstance.put(`/fitout-requests/${id}/`, rest);

//   if (fitout_annexures?.length) {
//     await Promise.all(
//       fitout_annexures.map((annexure) =>
//         uploadAnnexure(data.id, annexure.file as File)
//       )
//     );
//   }
//   return data;
// };

// export const deleteFitoutRequest = async (id: number) => {
//   await FitoutRequestInstance.delete(`/fitout-requests/${id}/`);
// };

// // Annexure upload for FitoutRequest
// export const uploadAnnexure = async (requestId: number, file: File) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   const { data } = await FitoutRequestInstance.post(
//     `/fitout-requests/${requestId}/upload-annexure/`,
//     formData,
//     { headers: { "Content-Type": "multipart/form-data" } }
//   );
//   return data;
// };

// // -------------------- Statuses --------------------
// export interface Status {
//   id: number;
//   status: string;
//   fixedStatus: string;
//   colour: string;
//   order: number;
// }

// export interface StatusPayload {
//   status: string;
//   fixedStatus: string;
//   colour: string;
//   order: number;
// }

// export const getStatuses = async (): Promise<Status[]> => {
//   const { data } = await FitoutRequestInstance.get("/statuses/");
//   return unwrap(data);
// };

// export const postStatus = async (payload: StatusPayload): Promise<Status> => {
//   const { data } = await FitoutRequestInstance.post("/statuses/", payload);
//   return data;
// };

// export const patchStatus = async (id: number, payload: Partial<StatusPayload>): Promise<Status> => {
//   const { data } = await FitoutRequestInstance.patch(`/statuses/${id}/`, payload);
//   return data;
// };

// export const deleteStatus = async (id: number) => {
//   await FitoutRequestInstance.delete(`/statuses/${id}/`);
// };

// // -------------------- Deviation Statuses --------------------
// export const getDeviationStatuses = async (params: Record<string, any> = {}) => {
//   const { data } = await FitoutRequestInstance.get("/deviation-statuses/", { params });
//   return unwrap(data);
// };

// export const getDeviationStatusById = async (id: number) => {
//   const { data } = await FitoutRequestInstance.get(`/deviation-statuses/${id}/`);
//   return data;
// };

// // -------------------- Associations / Checklists / Questions / Answers --------------------
// export interface FitoutChecklistPayload {
//   fitout_request: number;
//   name: string;
//   status?: string;
//   category?: string;
//   sub_category?: string;
//   associations?: number[];
//   questions?: {
//     question_text: string;
//     answer_type: string;
//     is_mandatory: boolean;
//     photo_required?: boolean;
//     options?: { option_text: string; is_correct?: boolean }[];
//   }[];
//   [key: string]: any;
// }

// // Associations
// export const getAssociations = async (params: Record<string, any> = {}) => {
//   const { data } = await AccountInstance.get("/associations/", { params });
//   return unwrap(data);
// };

// export const getAssociationById = async (id: number) => {
//   const { data } = await AccountInstance.get(`/associations/${id}/`);
//   return data;
// };

// // Fitout Checklists
// export const getFitoutChecklists = async (params: Record<string, any> = {}) => {
//   const { data } = await FitoutRequestInstance.get("/fitout-checklists/", { params });
//   return unwrap(data).map((item: any) => ({
//     ...item,
//     associations: item.associations ? JSON.parse(item.associations) : [],
//   }));
// };

// export const createChecklist = async (payload: FitoutChecklistPayload) => {
//   const safePayload = {
//     ...payload,
//     associations:
//       payload.associations && payload.associations.length
//         ? JSON.stringify(payload.associations)
//         : null,
//   };
//   const { data } = await FitoutRequestInstance.post("/fitout-checklists/", safePayload);
//   return data;
// };

// export const updateChecklistStatus = async (id: number, status: string) => {
//   const { data } = await FitoutRequestInstance.patch(`/fitout-checklists/${id}/`, { status });
//   return data;
// };

// // -------------------- Checklist Answers --------------------
// export interface ChecklistAnswerPayload {
//   fitout_request: number;
//   question: number;
//   answer_text?: string;
//   selected_option?: number | null;
//   photo?: File | null;
// }

// export const createChecklistAnswer = async (payload: ChecklistAnswerPayload) => {
//   const formData = new FormData();
//   Object.entries(payload).forEach(([key, value]) => {
//     if (value !== undefined && value !== null) {
//       if (value instanceof File) formData.append(key, value);
//       else formData.append(key, String(value));
//     }
//   });
//   const { data } = await FitoutRequestInstance.post("/checklist-answers/", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return data;
// };

// // -------------------- Checklist Questions / Options --------------------
// export interface QuestionOptionPayload {
//   option_text: string;
//   is_correct?: boolean;
// }

// export interface ChecklistQuestionPayload {
//   checklist: number;
//   question_text: string;
//   answer_type: "text" | "yes_no" | "multiple_choice";
//   is_mandatory: boolean;
//   photo_required?: boolean;
//   options?: QuestionOptionPayload[];
// }

// export const createChecklistQuestion = async (payload: ChecklistQuestionPayload) => {
//   const { options, ...rest } = payload;
//   const { data } = await FitoutRequestInstance.post("/checklist-questions/", rest);

//   if (options?.length) {
//     await Promise.all(
//       options.map((opt) =>
//         FitoutRequestInstance.post("/question-options/", { ...opt, question: data.id })
//       )
//     );
//   }

//   return data;
// };

// // -------------------- Chats --------------------
// export const getRequestChats = async (params: Record<string, any> = {}) => {
//   const { data } = await FitoutRequestInstance.get("/request-chats/", { params });
//   return unwrap(data);
// };

// -------------------- Users --------------------
// export const getUsers = async (params: Record<string, any> = {}) => {
//   const { data } = await FitoutRequestInstance.get("/users/", { params });
//   return unwrap(data);
// };

// // -------------------- Work Categories (Dynamic Categories) --------------------
// export interface WorkCategory {
//   id: number;
//   name: string;
//   description?: string;
// }

// export interface SubCategory {
//   id: number;
//   name: string;
//   work_category: number;
// }

// export const getWorkCategories = async (): Promise<WorkCategory[]> => {
//   const { data } = await FitoutRequestInstance.get("/work-categories/");
//   return unwrap(data);
// };

// export const getSubCategories = async (params: Record<string, any> = {}): Promise<SubCategory[]> => {
//   const { data } = await FitoutRequestInstance.get("/sub-categories/", { params });
//   return unwrap(data);
// };

// // -------------------- Fitout Categories --------------------
// export interface FitoutCategory {
//   id: number;
//   name: string;
//   oneBHK: number;
//   twoBHK: number;
//   oneBHK_RK: number;
//   twoBHK_TERRIS: number;
//   oneBHK_again: number;
// }

// export interface FitoutCategoryPayload {
//   name: string;
//   oneBHK: number;
//   twoBHK: number;
//   oneBHK_RK: number;
//   twoBHK_TERRIS: number;
//   oneBHK_again: number;
// }

// export const getFitoutCategories = async (): Promise<FitoutCategory[]> => {
//   const { data } = await FitoutRequestInstance.get("/fitout-requests/");
//   return unwrap(data);
// };

// // -------------------- Fitout Guides --------------------
// export interface FitoutGuidePayload {
//   title: string;
//   description?: string;
//   file?: File | null;
//   category: number;
// }

// export const getFitoutGuides = async () => {
//   const { data } = await FitoutRequestInstance.get("/fitout-guides/");
//   return unwrap(data);
// };

// export const createFitoutGuide = async (payload: FitoutGuidePayload) => {
//   const formData = new FormData();
//   Object.entries(payload).forEach(([key, value]) => {
//     if (value !== undefined && value !== null) {
//       if (value instanceof File) formData.append(key, value);
//       else formData.append(key, String(value));
//     }
//   });

//   const { data } = await FitoutRequestInstance.post("/fitout-guides/", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return data;
// };

// // -------------------- Annexures --------------------
// export interface Annexure {
//   id: number;
//   name: string;
//   file?: File | null;
// }

// export const getAnnexures = async (): Promise<Annexure[]> => {
//   const { data } = await FitoutRequestInstance.get("/annexures/");
//   return unwrap(data);
// };






/// src/api/endpoints.ts
// src/api/endpoint.ts
import { FitoutRequestInstance } from "./axiosinstance";

// -------------------- Helpers --------------------
const unwrap = <T>(data: any): T[] => {
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  return data ?? [];
};

// Utility to convert JSON to FormData
export const toFormData = (payload: Record<string, any>) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) formData.append(key, value);
      else if (Array.isArray(value)) formData.append(key, JSON.stringify(value));
      else formData.append(key, String(value));
    }
  });
  return formData;
};

// -------------------- Fitout Requests --------------------
export const getFitoutRequests = async () => unwrap((await FitoutRequestInstance.get("/fitout-requests/")).data);
export const getFitoutRequestById = async (id: number) => (await FitoutRequestInstance.get(`/fitout-requests/${id}/`)).data;
export const createFitoutRequest = async (payload: Record<string, any>) =>
  (await FitoutRequestInstance.post("/fitout-requests/", toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const updateFitoutRequest = async (id: number, payload: Record<string, any>) =>
  (await FitoutRequestInstance.put(`/fitout-requests/${id}/`, toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const deleteFitoutRequest = async (id: number) => await FitoutRequestInstance.delete(`/fitout-requests/${id}/`);

// -------------------- Fitout Types --------------------
export const getFitoutTypes = async () => unwrap((await FitoutRequestInstance.get("/fitout-types/")).data);
export const getFitoutTypeById = async (id: number) => (await FitoutRequestInstance.get(`/fitout-types/${id}/`)).data;
export const createFitoutType = async (payload: Record<string, any>) =>
  (await FitoutRequestInstance.post("/fitout-types/", toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const updateFitoutType = async (id: number, payload: Record<string, any>) =>
  (await FitoutRequestInstance.put(`/fitout-types/${id}/`, toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const deleteFitoutType = async (id: number) => await FitoutRequestInstance.delete(`/fitout-types/${id}/`);

// -------------------- Fitout Deviations --------------------
export const getFitoutDeviations = async () => unwrap((await FitoutRequestInstance.get("/fitout-deviations/")).data);
export const getFitoutDeviationById = async (id: number) => (await FitoutRequestInstance.get(`/fitout-deviations/${id}/`)).data;
export const createFitoutDeviation = async (payload: Record<string, any>) =>
  (await FitoutRequestInstance.post("/fitout-deviations/", toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const updateFitoutDeviation = async (id: number, payload: Record<string, any>) =>
  (await FitoutRequestInstance.put(`/fitout-deviations/${id}/`, toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const deleteFitoutDeviation = async (id: number) => await FitoutRequestInstance.delete(`/fitout-deviations/${id}/`);

// -------------------- Fitout Checklists --------------------
export const getFitoutChecklists = async (params: Record<string, any> = {}) => unwrap((await FitoutRequestInstance.get("/fitout-checklists/", { params })).data);
export const getFitoutChecklistById = async (id: number) => (await FitoutRequestInstance.get(`/fitout-checklists/${id}/`)).data;
export const createFitoutChecklist = async (payload: Record<string, any>) =>
  (await FitoutRequestInstance.post("/fitout-checklists/", toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const updateFitoutChecklist = async (id: number, payload: Record<string, any>) =>
  (await FitoutRequestInstance.put(`/fitout-checklists/${id}/`, toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const deleteFitoutChecklist = async (id: number) => await FitoutRequestInstance.delete(`/fitout-checklists/${id}/`);

// -------------------- Request Chats --------------------
export const getRequestChats = async (params: Record<string, any> = {}) => unwrap((await FitoutRequestInstance.get("/request-chats/", { params })).data);
export const getRequestChatById = async (id: number) => (await FitoutRequestInstance.get(`/request-chats/${id}/`)).data;
export const createRequestChat = async (payload: Record<string, any>) =>
  (await FitoutRequestInstance.post("/request-chats/", toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const updateRequestChat = async (id: number, payload: Record<string, any>) =>
  (await FitoutRequestInstance.put(`/request-chats/${id}/`, toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const deleteRequestChat = async (id: number) => await FitoutRequestInstance.delete(`/request-chats/${id}/`);


export const getUsers = async () => {
  const { data } = await FitoutRequestInstance.get("/users/");
  return data;
};

export const updateChecklistStatus = async (id: number, status: string) => {
  const { data } = await FitoutRequestInstance.patch(`/fitout-checklists/${id}/`, { status });
  return data;
};


// -------------------- Deviation Chats --------------------
export const getDeviationChats = async (params: Record<string, any> = {}) => unwrap((await FitoutRequestInstance.get("/deviation-chats/", { params })).data);
export const getDeviationChatById = async (id: number) => (await FitoutRequestInstance.get(`/deviation-chats/${id}/`)).data;
export const createDeviationChat = async (payload: Record<string, any>) =>
  (await FitoutRequestInstance.post("/deviation-chats/", toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const updateDeviationChat = async (id: number, payload: Record<string, any>) =>
  (await FitoutRequestInstance.put(`/deviation-chats/${id}/`, toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const deleteDeviationChat = async (id: number) => await FitoutRequestInstance.delete(`/deviation-chats/${id}/`);

// -------------------- Checklist Answers --------------------
export const getChecklistAnswers = async (params: Record<string, any> = {}) => unwrap((await FitoutRequestInstance.get("/checklist-answers/", { params })).data);
export const getChecklistAnswerById = async (id: number) => (await FitoutRequestInstance.get(`/checklist-answers/${id}/`)).data;
export const createChecklistAnswer = async (payload: Record<string, any>) =>
  (await FitoutRequestInstance.post("/checklist-answers/", toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const updateChecklistAnswer = async (id: number, payload: Record<string, any>) =>
  (await FitoutRequestInstance.put(`/checklist-answers/${id}/`, toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const deleteChecklistAnswer = async (id: number) => await FitoutRequestInstance.delete(`/checklist-answers/${id}/`);

// -------------------- Annexures --------------------
export const getAnnexures = async () => unwrap((await FitoutRequestInstance.get("/annexures/")).data);
export const getAnnexureById = async (id: number) => (await FitoutRequestInstance.get(`/annexures/${id}/`)).data;
export const createAnnexure = async (payload: Record<string, any>) =>
  (await FitoutRequestInstance.post("/annexures/", toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const updateAnnexure = async (id: number, payload: Record<string, any>) =>
  (await FitoutRequestInstance.put(`/annexures/${id}/`, toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const deleteAnnexure = async (id: number) => await FitoutRequestInstance.delete(`/annexures/${id}/`);

// -------------------- Work Categories / Sub Categories --------------------
export const getWorkCategories = async () => unwrap((await FitoutRequestInstance.get("/work-categories/")).data);
export const getWorkCategoryById = async (id: number) => (await FitoutRequestInstance.get(`/work-categories/${id}/`)).data;

export const createWorkCategory = async (payload: Record<string, unknown>) =>
  (await FitoutRequestInstance.post("/work-categories/", payload)).data;


export const updateWorkCategory = async (id: number, payload: Record<string, any>) =>
  (await FitoutRequestInstance.put(`/work-categories/${id}/`, payload)).data;
export const deleteWorkCategory = async (id: number) => await FitoutRequestInstance.delete(`/work-categories/${id}/`);

export const getSubCategories = async () => unwrap((await FitoutRequestInstance.get("/sub-categories/")).data);
export const getSubCategoryById = async (id: number) => (await FitoutRequestInstance.get(`/sub-categories/${id}/`)).data;
export const createSubCategory = async (payload: Record<string, any>) =>
  (await FitoutRequestInstance.post("/sub-categories/", payload)).data;
export const updateSubCategory = async (id: number, payload: Record<string, any>) =>
  (await FitoutRequestInstance.put(`/sub-categories/${id}/`, payload)).data;
export const deleteSubCategory = async (id: number) => await FitoutRequestInstance.delete(`/sub-categories/${id}/`);

// -------------------- Statuses / Deviation Statuses --------------------
export const getStatuses = async () => unwrap((await FitoutRequestInstance.get("/statuses/")).data);
export const getStatusById = async (id: number) => (await FitoutRequestInstance.get(`/statuses/${id}/`)).data;
export const createStatus = async (payload: Record<string, any>) => (await FitoutRequestInstance.post("/statuses/", payload)).data;
export const updateStatus = async (id: number, payload: Record<string, any>) => (await FitoutRequestInstance.put(`/statuses/${id}/`, payload)).data;
export const deleteStatus = async (id: number) => await FitoutRequestInstance.delete(`/statuses/${id}/`);

export const getDeviationStatuses = async () => unwrap((await FitoutRequestInstance.get("/deviation-statuses/")).data);
export const getDeviationStatusById = async (id: number) => (await FitoutRequestInstance.get(`/deviation-statuses/${id}/`)).data;
export const createDeviationStatus = async (payload: Record<string, any>) => (await FitoutRequestInstance.post("/deviation-statuses/", payload)).data;
export const updateDeviationStatus = async (id: number, payload: Record<string, any>) => (await FitoutRequestInstance.put(`/deviation-statuses/${id}/`, payload)).data;
export const deleteDeviationStatus = async (id: number) => await FitoutRequestInstance.delete(`/deviation-statuses/${id}/`);

// -------------------- Checklist Questions / Options --------------------
export const getChecklistQuestions = async () => unwrap((await FitoutRequestInstance.get("/checklist-questions/")).data);
export const getChecklistQuestionById = async (id: number) => (await FitoutRequestInstance.get(`/checklist-questions/${id}/`)).data;
export const createChecklistQuestion = async (payload: Record<string, any>) => (await FitoutRequestInstance.post("/checklist-questions/", payload)).data;
export const updateChecklistQuestion = async (id: number, payload: Record<string, any>) => (await FitoutRequestInstance.put(`/checklist-questions/${id}/`, payload)).data;
export const deleteChecklistQuestion = async (id: number) => await FitoutRequestInstance.delete(`/checklist-questions/${id}/`);

export const getQuestionOptions = async () => unwrap((await FitoutRequestInstance.get("/question-options/")).data);
export const getQuestionOptionById = async (id: number) => (await FitoutRequestInstance.get(`/question-options/${id}/`)).data;
export const createQuestionOption = async (payload: Record<string, any>) => (await FitoutRequestInstance.post("/question-options/", payload)).data;
export const updateQuestionOption = async (id: number, payload: Record<string, any>) => (await FitoutRequestInstance.put(`/question-options/${id}/`, payload)).data;
export const deleteQuestionOption = async (id: number) => await FitoutRequestInstance.delete(`/question-options/${id}/`);

// -------------------- Fitout Guides --------------------
export const getFitoutGuides = async () => unwrap((await FitoutRequestInstance.get("/fitout-guide/")).data);
export const getFitoutGuideById = async (id: number) => (await FitoutRequestInstance.get(`/fitout-guide/${id}/`)).data;
export const createFitoutGuide = async (payload: Record<string, any>) =>
  (await FitoutRequestInstance.post("/fitout-guide/", toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const updateFitoutGuide = async (id: number, payload: Record<string, any>) =>
  (await FitoutRequestInstance.put(`/fitout-guide/${id}/`, toFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })).data;
export const deleteFitoutGuide = async (id: number) => await FitoutRequestInstance.delete(`/fitout-guide/${id}/`);

// -------------------- Payment Modes --------------------
export const getPaymentModes = async () => unwrap((await FitoutRequestInstance.get("/payment-modes/")).data);
export const getPaymentModeById = async (id: number) => (await FitoutRequestInstance.get(`/payment-modes/${id}/`)).data;
export const createPaymentMode = async (payload: Record<string, any>) => (await FitoutRequestInstance.post("/payment-modes/", payload)).data;
export const updatePaymentMode = async (id: number, payload: Record<string, any>) => (await FitoutRequestInstance.put(`/payment-modes/${id}/`, payload)).data;
export const deletePaymentMode = async (id: number) => await FitoutRequestInstance.delete(`/payment-modes/${id}/`);
