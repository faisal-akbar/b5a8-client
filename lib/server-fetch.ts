import { getNewAccessToken } from "@/services/auth/auth.service";
import { getCookie } from "@/services/auth/tokenHandlers";


const BACKEND_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

// /auth/login
const serverFetchHelper = async (endpoint: string, options: RequestInit): Promise<Response> => {
    const { headers, ...restOptions } = options;
    const accessToken = await getCookie("accessToken");

    //to stop recursion loop
    if (endpoint !== "/auth/refresh-token") {
        await getNewAccessToken();
    }

    try {
        const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
            headers: {
                Cookie: accessToken ? `accessToken=${accessToken}` : "",
                ...headers,
            },
            ...restOptions,
        })

        return response;
    } catch (error: any) {
        // Handle connection errors gracefully
        if (error?.code === 'ECONNREFUSED' || error?.message?.includes('fetch failed')) {
            console.error(`Backend server is not running. Please start the backend server at ${BACKEND_API_URL}`);
            throw new Error(
                `Cannot connect to backend server at ${BACKEND_API_URL}. ` +
                `Please ensure the backend server is running. ` +
                `Start it with: cd b5a8-server && npm run dev`
            );
        }
        throw error;
    }
}

export const serverFetch = {
    get: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "GET" }),

    post: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "POST" }),

    put: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "PUT" }),

    patch: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

    delete: async (endpoint: string, options: RequestInit = {}): Promise<Response> => serverFetchHelper(endpoint, { ...options, method: "DELETE" }),

}

/**
 * 
 * serverFetch.get("/auth/me")
 * serverFetch.post("/auth/login", { body: JSON.stringify({}) })
 */

