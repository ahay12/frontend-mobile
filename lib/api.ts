import axios from "axios";
import { Platform } from "react-native";

// Detect optimal default base URL based on platform
const getDefaultBaseUrl = () => {
  if (Platform.OS === "android") {
    return "https://103.150.101.123.nip.io"; // Android Emulator
  } else if (Platform.OS === "ios") {
    return "https://103.150.101.123.nip.io"; // iOS Simulator
  }
  return "https://103.150.101.123.nip.io"; // Web / Default
};

let API_BASE_URL = getDefaultBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setApiBaseUrl = (url: string) => {
  API_BASE_URL = url;
  apiClient.defaults.baseURL = API_BASE_URL;
};

export const getApiBaseUrl = () => API_BASE_URL;

export interface PreprocessingDetail {
  original: string;
  after_cleaning: string;
  after_stopword: string;
}

export interface ModelResult {
  label: "positif" | "negatif";
  confidence: number;
}

export interface AnalyzeResponse {
  preprocessing: PreprocessingDetail;
  svm: ModelResult;
  indobert: ModelResult;
}

export const analyzeSingle = async (text: string): Promise<AnalyzeResponse> => {
  const { data } = await apiClient.post<AnalyzeResponse>("/analyze", { text });
  return data;
};

export interface BatchResultItem {
  content: string;
  svm: string;
  indobert: string;
  actual: string | null;
}

export interface BatchAnalyzeResponse {
  total: number;
  has_labels: boolean;
  results: BatchResultItem[];
  summary: {
    svm: Record<string, number>;
    indobert: Record<string, number>;
  };
  accuracy?: {
    svm: number | null;
    indobert: number | null;
  };
}

export const analyzeBatch = async (fileUri: string, fileName: string, fileType: string = "text/csv"): Promise<BatchAnalyzeResponse> => {
  const formData = new FormData();
  
  // In React Native, we pass an object to FormData for files
  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: fileType,
  } as any);

  const { data } = await apiClient.post<BatchAnalyzeResponse>(
    "/analyze-batch",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};
