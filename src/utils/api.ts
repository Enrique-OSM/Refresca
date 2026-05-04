import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info.tsx';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

export interface InventoryItem {
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Map from Supabase string status to our UI status
function mapStatus(estatus: string): InventoryItem["status"] {
  switch (estatus) {
    case 'ONCOUNTER': return 'fresh';
    case 'INTERNALOFFER': return 'internal';
    case 'FLASHSALE': return 'flash';
    case 'DONATE': return 'donate';
    case 'EXPIRED': return 'expired';
    default: return 'fresh';
  }
}

// Map from UI status to Supabase string status
function unmapStatus(status: InventoryItem["status"]): string {
  switch (status) {
    case 'fresh': return 'ONCOUNTER';
    case 'internal': return 'INTERNALOFFER';
    case 'flash': return 'FLASHSALE';
    case 'donate': return 'DONATE';
    case 'expired': return 'EXPIRED';
    default: return 'ONCOUNTER';
  }
}

function calculateDaysLeft(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function mapDatabaseRowToInventoryItem(row: any): InventoryItem {
  return {
    id: String(row.id),
    batchId: `BTH-${row.BATCH_ID}`, // Ensure it looks like "BTH-123" in UI
    product: row.Nombre_Producto,
    stock: row.Stock_Actual,
    cost: row.Costo_Unitario,
    expiry: new Date(row.Fecha_Caducidad).toISOString().split('T')[0], // YYYY-MM-DD
    daysLeft: calculateDaysLeft(row.Fecha_Caducidad),
    status: mapStatus(row.Estatus),
    salesPace: (row.Ritmo_De_Ventas_Esperado || 'MEDIUM').toLowerCase() as any,
  };
}

export const inventoryAPI = {
  getAll: async (): Promise<ApiResponse<InventoryItem[]>> => {
    try {
      const { data, error } = await supabase
        .from('Productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const items = data.map(mapDatabaseRowToInventoryItem);
      return { success: true, data: items };
    } catch (error: any) {
      console.error('Error fetching inventory:', error);
      return { success: false, error: error.message };
    }
  },

  create: async (item: Omit<InventoryItem, 'id' | 'daysLeft' | 'status'>): Promise<ApiResponse<InventoryItem>> => {
    try {
      // Extrae solo los números del BATCH_ID (ej. "BTH-234" -> 234)
      const batchIdNumber = parseInt(item.batchId.replace(/\D/g, '')) || 0;
      
      const payload: any = {
        Nombre_Producto: item.product,
        Stock_Actual: item.stock,
        Fecha_Caducidad: new Date(item.expiry).toISOString(),
        Costo_Unitario: item.cost,
        BATCH_ID: batchIdNumber,
        Ritmo_De_Ventas_Esperado: item.salesPace.toUpperCase(),
        Pertenece_a: 1 // Por defecto, como pidió el usuario
      };

      // Determinar el estatus inicial basado en los días restantes y ritmo de ventas
      const daysLeft = calculateDaysLeft(item.expiry);
      let initialStatus = 'ONCOUNTER';
      if (daysLeft < 0) initialStatus = 'EXPIRED';
      else if (daysLeft <= 1 && item.salesPace === 'low') initialStatus = 'DONATE';
      else if (daysLeft <= 2) initialStatus = 'FLASHSALE';
      else if (daysLeft <= 5 && item.salesPace !== 'high') initialStatus = 'INTERNALOFFER';
      payload.Estatus = initialStatus;

      const { data, error } = await supabase
        .from('Productos')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: mapDatabaseRowToInventoryItem(data) };
    } catch (error: any) {
      console.error('Error creating product:', error);
      return { success: false, error: error.message };
    }
  },

  update: async (batchIdStr: string, item: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem>> => {
    try {
      const payload: any = {};
      if (item.product !== undefined) payload.Nombre_Producto = item.product;
      if (item.stock !== undefined) payload.Stock_Actual = item.stock;
      if (item.cost !== undefined) payload.Costo_Unitario = item.cost;
      if (item.expiry !== undefined) payload.Fecha_Caducidad = new Date(item.expiry).toISOString();
      if (item.salesPace !== undefined) payload.Ritmo_De_Ventas_Esperado = item.salesPace.toUpperCase();
      if (item.status !== undefined) payload.Estatus = unmapStatus(item.status);

      const batchIdNumber = parseInt(batchIdStr.replace(/\D/g, '')) || 0;

      const { data, error } = await supabase
        .from('Productos')
        .update(payload)
        .eq('BATCH_ID', batchIdNumber)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: mapDatabaseRowToInventoryItem(data) };
    } catch (error: any) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }
  },

  delete: async (batchIdStr: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const batchIdNumber = parseInt(batchIdStr.replace(/\D/g, '')) || 0;
      const { error } = await supabase
        .from('Productos')
        .delete()
        .eq('BATCH_ID', batchIdNumber);

      if (error) throw error;

      return { success: true, data: { message: 'Product deleted successfully' } };
    } catch (error: any) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }
  },
};
