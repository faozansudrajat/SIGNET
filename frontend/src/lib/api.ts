import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000, // 2 minutes timeout untuk blockchain transaction
});

// Helper function untuk handle error
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Network error (backend tidak running)
    if (
      axiosError.code === "ECONNREFUSED" ||
      axiosError.code === "ERR_NETWORK"
    ) {
      return "Backend server is not running. Please start the backend server";
    }

    // Timeout
    if (axiosError.code === "ECONNABORTED") {
      return "Request timeout. Please check your connection and try again.";
    }

    // Server error dengan response
    if (axiosError.response) {
      const responseData = axiosError.response.data as any;
      return (
        responseData?.detail ||
        responseData?.message ||
        `Server error: ${axiosError.response.status}`
      );
    }

    // Request error tanpa response
    if (axiosError.request) {
      return "No response from server. Please check if the backend is running.";
    }
  }

  // Generic error
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
};

// Register content ke Story Protocol
// Backend Story Protocol endpoint: POST /register
// Parameters: file (File), owner_name (string, optional), description (string, optional)
// Returns: { status, ip_id, phash, tx_hash, license_status, pil_tx, ipfs_metadata, msg }
// Note: If owner_name is not provided, backend will use wallet address from env
export const registerContent = async (
  file: File,
  ownerName?: string,
  description?: string
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (ownerName) {
      formData.append("owner_name", ownerName);
    }
    if (description) {
      formData.append("description", description);
    }

    const response = await api.post("/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2 minutes timeout untuk blockchain transaction
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

// Verifikasi konten dengan Story Protocol backend
// Backend Story Protocol endpoint: POST /verify
// Parameters: file (File)
// Returns: { status: "MATCH_FOUND" | "NO_MATCH", match_data?, distance, similarity_percent?, is_scam? }
export const verifyContent = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/verify", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000,
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

// Get pHash from file (using verify endpoint)
export const getPHash = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/verify", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000,
    });

    // Story Protocol backend returns phash in match_data or directly
    return response.data.phash || response.data.match_data?.phash || "";
  } catch (error) {
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

// Helper function to map backend data to frontend format
const mapBackendToFrontend = (item: any) => {
  // Use created_at from backend if available (Unix timestamp in seconds)
  // If created_at is a string (DateTime), convert it to Unix timestamp
  // Otherwise, fallback to current time (should not happen if backend is correct)
  let timestamp: number;
  if (item.created_at) {
    if (typeof item.created_at === "number") {
      // Already a Unix timestamp
      timestamp = item.created_at;
    } else if (typeof item.created_at === "string") {
      // Convert DateTime string to Unix timestamp
      timestamp = Math.floor(new Date(item.created_at).getTime() / 1000);
    } else {
      // Fallback to current time if format is unexpected
      timestamp = Math.floor(Date.now() / 1000);
    }
  } else {
    // Fallback to current time if created_at is missing (should not happen)
    timestamp = Math.floor(Date.now() / 1000);
  }

  return {
    id: item.ip_id || item.phash || `item-${timestamp}`,
    title: item.filename || item.ip_id || "Untitled",
    name: item.filename || item.ip_id || "Untitled", // Name field for display
    description: item.filename
      ? `Registered file: ${item.filename}`
      : "No description",
    publisher: item.owner || "Unknown",
    txhash: item.tx_hash_register || item.tx_hash || "",
    tx_hash_register: item.tx_hash_register || item.tx_hash || "",
    tx_hash_mint: item.tx_hash_mint || "",
    tx_hash_license: item.license?.tx_hash || "",
    phash: item.phash || "",
    timestamp: timestamp, // Unix timestamp in seconds from backend
    ip_id: item.ip_id,
    filename: item.filename,
    license: item.license || { status: "NOT ATTACHED" },
    ipfs_metadata: item.ipfs_metadata || "",
    ipfs_file: null, // Will be populated async if needed
    owner: item.owner || "Unknown",
  };
};

// Get all registered contents dari Story Protocol
// Backend Story Protocol endpoint: GET /list
// Returns: Array of registered assets (mapped to frontend format)
export const getAllContents = async () => {
  try {
    const response = await api.get("/list");
    const backendData = response.data || [];

    // Map backend data to frontend format
    const mappedContents = backendData.map(mapBackendToFrontend);

    // Sort by timestamp (newest first) - using generated timestamp
    mappedContents.sort((a: any, b: any) => b.timestamp - a.timestamp);

    return {
      contents: mappedContents,
      total: mappedContents.length,
    };
  } catch (error) {
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

// Get user's registered contents
// Filter by wallet address if provided
export const getMyContents = async (ownerAddress?: string) => {
  try {
    const response = await api.get("/list");
    const backendData = response.data || [];

    // Filter by owner address if provided
    let filteredData = backendData;
    if (ownerAddress) {
      filteredData = backendData.filter((item: any) => {
        const itemOwner = item.owner || "";
        return itemOwner.toLowerCase() === ownerAddress.toLowerCase();
      });
    }

    // Map to frontend format and sort by timestamp (newest first)
    const mappedContents = filteredData.map(mapBackendToFrontend);
    mappedContents.sort((a: any, b: any) => b.timestamp - a.timestamp);

    return mappedContents;
  } catch (error) {
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

export default api;
