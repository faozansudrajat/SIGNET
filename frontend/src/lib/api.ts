import axios, { AxiosError } from "axios";

/* =====================================================
   CONFIG
===================================================== */
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000, // 2 minutes (blockchain tx)
});

/* =====================================================
   TYPES
===================================================== */
export interface FrontendContent {
  id: string;
  title: string;
  name: string;
  description: string;
  publisher: string;
  txhash: string;
  tx_hash_register: string;
  tx_hash_mint: string;
  tx_hash_license: string;
  phash: string;
  timestamp: number;
  ip_id?: string;
  filename?: string;
  license: any;
  ipfs_metadata: string;
  ipfs_file: any;
  owner: string;
}

/* =====================================================
   ERROR HANDLER
===================================================== */
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    if (
      axiosError.code === "ECONNREFUSED" ||
      axiosError.code === "ERR_NETWORK"
    ) {
      return "Backend server is not running. Please start the backend server.";
    }

    if (axiosError.code === "ECONNABORTED") {
      return "Request timeout. Please try again.";
    }

    if (axiosError.response) {
      return (
        axiosError.response.data?.detail ||
        axiosError.response.data?.message ||
        `Server error: ${axiosError.response.status}`
      );
    }

    if (axiosError.request) {
      return "No response from server.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred.";
};

/* =====================================================
   API FUNCTIONS
===================================================== */
export const registerContent = async (
  file: File,
  ownerName?: string,
  description?: string
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (ownerName) formData.append("owner_name", ownerName);
    if (description) formData.append("description", description);

    const response = await api.post("/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const verifyContent = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/verify", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getPHash = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/verify", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return (
      response.data?.phash ||
      response.data?.match_data?.phash ||
      ""
    );
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/* =====================================================
   DATA MAPPER
===================================================== */
const mapBackendToFrontend = (item: any): FrontendContent => {
  let timestamp: number;

  if (item.created_at) {
    if (typeof item.created_at === "number") {
      timestamp = item.created_at;
    } else {
      timestamp = Math.floor(
        new Date(item.created_at).getTime() / 1000
      );
    }
  } else {
    timestamp = Math.floor(Date.now() / 1000);
  }

  return {
    id: item.ip_id || item.phash || `item-${timestamp}`,
    title: item.filename || item.ip_id || "Untitled",
    name: item.filename || item.ip_id || "Untitled",
    description: item.filename
      ? `Registered file: ${item.filename}`
      : "No description",
    publisher: item.owner || "Unknown",
    txhash: item.tx_hash_register || item.tx_hash || "",
    tx_hash_register: item.tx_hash_register || item.tx_hash || "",
    tx_hash_mint: item.tx_hash_mint || "",
    tx_hash_license: item.license?.tx_hash || "",
    phash: item.phash || "",
    timestamp,
    ip_id: item.ip_id,
    filename: item.filename,
    license: item.license || { status: "NOT ATTACHED" },
    ipfs_metadata: item.ipfs_metadata || "",
    ipfs_file: null,
    owner: item.owner || "Unknown",
  };
};

/* =====================================================
   FETCH CONTENTS
===================================================== */
export const getAllContents = async () => {
  try {
    const response = await api.get("/list");
    const backendData: any[] = Array.isArray(response.data) ? response.data : [];

    const mappedContents: FrontendContent[] =
      backendData.map(mapBackendToFrontend);

    // Sort by timestamp (newest first - most recent registration on top)
    mappedContents.sort(
      (a: FrontendContent, b: FrontendContent) =>
        b.timestamp - a.timestamp
    );

    return {
      contents: mappedContents,
      total: mappedContents.length,
    };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getMyContents = async (ownerAddress?: string) => {
  try {
    const response = await api.get("/list");
    let backendData: any[] = response.data || [];

    if (ownerAddress) {
      backendData = backendData.filter(
        (item: any) =>
          item.owner?.toLowerCase() === ownerAddress.toLowerCase()
      );
    }

    const mappedContents: FrontendContent[] =
      backendData.map(mapBackendToFrontend);

    mappedContents.sort(
      (a: FrontendContent, b: FrontendContent) =>
        b.timestamp - a.timestamp
    );

    return mappedContents;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/* =====================================================
   REPORT INFRINGEMENT
===================================================== */
export const reportInfringement = async (
  scamFilename: string,
  originalIpId: string,
  similarity: number
) => {
  try {
    const formData = new FormData();
    formData.append("scam_filename", scamFilename);
    formData.append("original_ip_id", originalIpId);
    formData.append("similarity", similarity.toString());

    const response = await api.post("/report", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "evidence.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default api;
