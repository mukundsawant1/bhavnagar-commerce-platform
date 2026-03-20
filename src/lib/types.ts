// Shared application types used across pages and components.

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  farmName?: string;
  [key: string]: unknown;
};

export type OrderMetadata = {
  assignedFarm?: string | null;
  adminPaymentReceived?: boolean;
  farmPaymentReceived?: boolean;
  deliveryDate?: string;
  rejectionNotes?: string;
  items?: OrderItem[];
  [key: string]: unknown;
};

export type OrderRecord = {
  id: string;
  user_id: string;
  status: string;
  amount: number;
  currency: string;
  metadata: OrderMetadata;
  created_at: string;
  updated_at: string;
};
