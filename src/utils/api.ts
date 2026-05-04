import { projectId, publicAnonKey } from '/utils/supabase/info.tsx';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a748bb9b`;

interface InventoryItem {
  id: string;
  batchId: string;
  product: string;
  stock: number;
  cost: number;
  expiry: string;
  daysLeft: number;
  status: "fresh" | "flash" | "internal" | "donate" | "expired";
  salesPace: "high" | "medium" | "low";
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`API error on ${endpoint}:`, data);
      return { success: false, error: data.error || 'API request failed' };
    }

    return data;
  } catch (error) {
    console.error(`Network error on ${endpoint}:`, error);
    return { success: false, error: 'Network error occurred' };
  }
}

export const inventoryAPI = {
  getAll: async (): Promise<ApiResponse<InventoryItem[]>> => {
    return fetchAPI<InventoryItem[]>('/inventory');
  },

  create: async (item: Omit<InventoryItem, 'id' | 'daysLeft' | 'status'>): Promise<ApiResponse<InventoryItem>> => {
    return fetchAPI<InventoryItem>('/inventory', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  update: async (batchId: string, item: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem>> => {
    return fetchAPI<InventoryItem>(`/inventory/${batchId}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  },

  delete: async (batchId: string): Promise<ApiResponse<{ message: string }>> => {
    return fetchAPI<{ message: string }>(`/inventory/${batchId}`, {
      method: 'DELETE',
    });
  },
};
