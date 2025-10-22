// src/api/endpoint.ts
import { FitoutRequestInstance, AccountInstance } from "./axiosinstance";

// -------------------- Helpers --------------------
const unwrap = <T>(data: any): T[] => {
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  return data ?? [];
};

const readSiteId = (): number | null => {
  const stored = localStorage.getItem("siteId");
  return stored ? parseInt(stored, 10) : null;
};

// -------------------- Buildings / Floors / Units --------------------
export const getBuildingsBySite = async (siteId: number) => {
  const { data } = await AccountInstance.get(`/buildings/by-site/${siteId}/`);
  return unwrap(data);
};

export const getBuildingById = async (id: number) => {
  if (id == null) return null;
  const { data } = await AccountInstance.get(`/buildings/${id}/`);
  return data;
};

export const getFloorsByBuilding = async (buildingId: number) => {
  const { data } = await AccountInstance.get(`/floors/by-building/${buildingId}/`);
  return unwrap(data);
};

export const getUnitsByFloor = async (floorId: number) => {
  const { data } = await AccountInstance.get(`/units/by-floor/${floorId}/`);
  return unwrap(data);
};

// -------------------- Fitout Requests --------------------
export interface FitoutAnnexurePayload {
  annexure: number;
  file?: File | null;
}

export interface FitoutRequestPayload {
  building_id?: number;
  floor_id?: number;
  unit_id?: number;
  user_id?: number;
  description?: string;
  contractor_name?: string;
  contractor_mobile?: string;
  requested_date?: Date;
  refund_date?: Date;
  expiry_date?: Date;
  total_amount?: number;
  payment_mode?: "PAY_AT_SITE" | "ONLINE";
  unit_costs?: {
    "1BHK"?: number;
    "2BHK"?: number;
    "1BHK_RK"?: number;
    "2BHK_TERRIS"?: number;
    "1BHK_again"?: number;
  };
  fitout_annexures?: FitoutAnnexurePayload[];
  [key: string]: any;
}

export const getFitoutRequests = async () => {
  const { data } = await FitoutRequestInstance.get("/fitout-requests/");
  return unwrap(data);
};

export const getFitoutRequest = async (id: number) => {
  const { data } = await FitoutRequestInstance.get(`/fitout-requests/${id}/`);
  return data;
};

// NOTE: Adjusted to accept FormData as per common API design for file uploads.
export const createFitoutRequest = async (formData: FormData) => {
  const { data } = await FitoutRequestInstance.post(`/fitout-requests/`, formData);
  return data;
};

export const updateFitoutRequest = async (id: number, payload: FitoutRequestPayload) => {
  const { fitout_annexures, ...rest } = payload;
  const { data } = await FitoutRequestInstance.put(`/fitout-requests/${id}/`, rest);

  if (fitout_annexures?.length) {
    await Promise.all(
      fitout_annexures.map((annexure) =>
        uploadAnnexure(data.id, annexure.file as File)
      )
    );
  }
  return data;
};

export const deleteFitoutRequest = async (id: number) => {
  await FitoutRequestInstance.delete(`/fitout-requests/${id}/`);
};

// Annexure upload for FitoutRequest
export const uploadAnnexure = async (requestId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await FitoutRequestInstance.post(
    `/fitout-requests/${requestId}/upload-annexure/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

// -------------------- Statuses --------------------
export interface Status {
  id: number;
  status: string;
  fixedStatus: string; // "Open", "Closed", "Pending"
  colour: string;
  order: number;
}

export interface StatusPayload {
  status: string;
  fixedStatus: string;
  colour: string;
  order: number;
}

export const getStatuses = async (): Promise<Status[]> => {
  const { data } = await FitoutRequestInstance.get("/statuses/");
  return unwrap(data);
};

export const postStatus = async (payload: StatusPayload): Promise<Status> => {
  const { data } = await FitoutRequestInstance.post("/statuses/", payload);
  return data;
};

export const patchStatus = async (id: number, payload: Partial<StatusPayload>): Promise<Status> => {
  const { data } = await FitoutRequestInstance.patch(`/statuses/${id}/`, payload);
  return data;
};

export const deleteStatus = async (id: number) => {
  await FitoutRequestInstance.delete(`/statuses/${id}/`);
};

// -------------------- Deviation Statuses --------------------
export const getDeviationStatuses = async (params: Record<string, any> = {}) => {
  const { data } = await FitoutRequestInstance.get("/deviation-statuses/", { params });
  return unwrap(data);
};

export const getDeviationStatusById = async (id: number) => {
  const { data } = await FitoutRequestInstance.get(`/deviation-statuses/${id}/`);
  return data;
};

// -------------------- Associations / Checklists / Questions / Answers --------------------
export interface FitoutChecklistPayload {
  fitout_request: number;
  name: string;
  status?: string;
  category?: string;
  sub_category?: string;
  associations?: number[];
  questions?: {
    question_text: string;
    answer_type: string;
    is_mandatory: boolean;
    photo_required?: boolean;
    options?: { option_text: string; is_correct?: boolean }[];
  }[];
  [key: string]: any;
}

// Associations
export const getAssociations = async (params: Record<string, any> = {}) => {
  const { data } = await AccountInstance.get("/associations/", { params });
  return unwrap(data);
};

export const getAssociationById = async (id: number) => {
  const { data } = await AccountInstance.get(`/associations/${id}/`);
  return data;
};

// Fitout Checklists
export const getFitoutChecklists = async (params: Record<string, any> = {}) => {
  const { data } = await FitoutRequestInstance.get("/fitout-checklists/", { params });
  return unwrap(data).map((item: any) => ({
    ...item,
    associations: item.associations ? JSON.parse(item.associations) : [],
  }));
};

export const createChecklist = async (payload: FitoutChecklistPayload) => {
  const safePayload = {
    ...payload,
    associations: payload.associations && payload.associations.length ? JSON.stringify(payload.associations) : null,
  };
  const { data } = await FitoutRequestInstance.post("/fitout-checklists/", safePayload);
  return data;
};

/**
 * Updates the status of a specific Fitout Checklist.
 * @param id The ID of the checklist to update.
 * @param status The new status value (e.g., "Completed", "Pending").
 * @returns The updated checklist data.
 */
export const updateChecklistStatus = async (id: number, status: string) => { 
  const { data } = await FitoutRequestInstance.patch(`/fitout-checklists/${id}/`, { status });
  return data;
};

// -------------------- Checklist Answers --------------------
export interface ChecklistAnswerPayload {
  fitout_request: number;
  question: number;
  answer_text?: string;
  selected_option?: number | null;
  photo?: File | null;
}

export const createChecklistAnswer = async (payload: ChecklistAnswerPayload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) formData.append(key, value);
      else formData.append(key, String(value));
    }
  });
  const { data } = await FitoutRequestInstance.post("/checklist-answers/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// -------------------- Checklist Questions / Options --------------------
export interface QuestionOptionPayload {
  option_text: string;
  is_correct?: boolean;
}

export interface ChecklistQuestionPayload {
  checklist: number;
  question_text: string;
  answer_type: "text" | "yes_no" | "multiple_choice";
  is_mandatory: boolean;
  photo_required?: boolean;
  options?: QuestionOptionPayload[];
}

export const createChecklistQuestion = async (payload: ChecklistQuestionPayload) => {
  const { options, ...rest } = payload;
  const { data } = await FitoutRequestInstance.post("/checklist-questions/", rest);

  if (options?.length) {
    await Promise.all(
      options.map((opt) => FitoutRequestInstance.post("/question-options/", { ...opt, question: data.id }))
    );
  }

  return data;
};

// -------------------- Chats --------------------
export const getRequestChats = async (params: Record<string, any> = {}) => {
  const { data } = await FitoutRequestInstance.get("/request-chats/", { params });
  return unwrap(data);
};

// -------------------- Users --------------------
export const getUsers = async (params: Record<string, any> = {}) => {
  const { data } = await AccountInstance.get("/users/", { params });
  return unwrap(data);
};

// -------------------- Work Categories (Dynamic Categories) --------------------
export interface WorkCategory {
  id: number;
  name: string; // e.g., "Electrical"
  description?: string;
}

export interface SubCategory {
  id: number;
  name: string; // e.g., "Wiring"
  work_category: number; // Foreign key ID to WorkCategory
}

export const getWorkCategories = async (): Promise<WorkCategory[]> => {
  const { data } = await FitoutRequestInstance.get("/work-categories/",);
  return unwrap(data);
};

export const getSubCategories = async (params: Record<string, any> = {}): Promise<SubCategory[]> => {
  const { data } = await FitoutRequestInstance.get("/sub-categories/", { params });
  return unwrap(data);
};


// -------------------- Fitout Categories --------------------
export interface FitoutCategory { 
  id: number;
  name: string;
  oneBHK: number;
  twoBHK: number;
  oneBHK_RK: number;
  twoBHK_TERRIS: number;
  oneBHK_again: number;
}


export interface FitoutCategoryPayload {
  name: string;
  oneBHK: number;
  twoBHK: number;
  oneBHK_RK: number;
  twoBHK_TERRIS: number;
  oneBHK_again: number;
};

export const createFitoutCategory = async (payload: FitoutCategoryPayload) => {
  // NOTE: The endpoint /fitout-requests/ is used here, which might be incorrect for creating a Category.
  const { data } = await FitoutRequestInstance.post("/fitout-requests/", payload, { headers: { "Content-Type": "multipart/form-data" } });
  return data;
};

export const updateFitoutCategory = async (id: number, payload: FitoutCategoryPayload) => {
  const { data } = await FitoutRequestInstance.put(`/fitout-requests/${id}/`, payload);
  return data;
};

export const deleteFitoutCategory = async (id: number) => {
  await FitoutRequestInstance.delete(`/fitout-requests/${id}/`);
};

export const uploadCategoryAnnexure = async (categoryId: number, annexureId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await FitoutRequestInstance.post(
    `/fitout-requests/${categoryId}/upload-annexure/${annexureId}/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

export const deleteCategoryAnnexure = async (categoryId: number, annexureId: number) => {
  await FitoutRequestInstance.delete(`/fitout-requests/${categoryId}/delete-annexure/${annexureId}/`);
};


export const getFitoutCategories = async (): Promise<FitoutCategory[]> => {
  const { data } = await FitoutRequestInstance.get("/fitout-requests/");
  return unwrap(data);
};

// -------------------- Fitout Guides --------------------
export interface FitoutGuidePayload {
  title: string;
  description?: string;
  file?: File | null;
  category: number;
}

export interface FitoutGuide {
  id: number;
  title: string;
  description: string;
  file: string;
  category: number;
  category_name: string;
}

export const getFitoutGuides = async (): Promise<FitoutGuide[]> => {
  const { data } = await FitoutRequestInstance.get("/fitout-guides/");
  return unwrap(data);
};

export const createFitoutGuide = async (payload: FitoutGuidePayload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) formData.append(key, value);
      else formData.append(key, String(value));
    }
  });

  const { data } = await FitoutRequestInstance.post("/fitout-guides/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};



// -------------------- Annexures --------------------
export interface Annexure {
  id: number;
  name: string;
  file?: File | null;
}

export const getAnnexures = async (): Promise<Annexure[]> => {
  const { data } = await FitoutRequestInstance.get("/annexures/");
  return unwrap(data);
};