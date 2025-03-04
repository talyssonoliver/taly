import api from "./api.js";

export interface Report {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportPayload {
  title: string;
  content: string;
}

const getAllReports = async (): Promise<Report[]> => {
  const response = await api.get<Report[]>("/reports");
  return response.data;
};

const getReportById = async (id: string): Promise<Report> => {
  const response = await api.get<Report>(`/reports/${id}`);
  return response.data;
};

const createReport = async (payload: CreateReportPayload): Promise<Report> => {
  const response = await api.post<Report>("/reports", payload);
  return response.data;
};

const deleteReport = async (id: string): Promise<void> => {
  await api.delete(`/reports/${id}`);
};

export const reportService = {
  getAllReports,
  getReportById,
  createReport,
  deleteReport,
};
