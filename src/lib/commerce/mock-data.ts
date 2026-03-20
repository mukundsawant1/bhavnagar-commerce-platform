export type ProduceListing = {
  id: string;
  name: string;
  category: "Vegetable" | "Fruit";
  unit: string;
  minBulkKg: number;
  pricePerKg: number;
  availableKg: number;
  farmName: string;
  location: string;
  photoHint?: string;
  qualityGrade: string;
  status: "available" | "low_stock" | "unavailable";
  imageUrl?: string;
  description?: string;
};

export type PurchaseOrder = {
  id: string;
  buyerName: string;
  item: string;
  requestedKg: number;
  orderDate: string;
  adminStatus: "new" | "reviewing" | "farm_confirmed" | "scheduled";
  assignedFarm: string;
  farmExpectedDispatch: string;
  adminCommittedDelivery: string;
};

export type FarmPartner = {
  id: string;
  name: string;
  owner: string;
  phone: string;
  location: string;
  produceCount: number;
  reliabilityScore: number;
  status: "active" | "attention";
};

export const produceCatalog: ProduceListing[] = [
  {
    id: "veg-1001",
    name: "A Grade Onion",
    category: "Vegetable",
    unit: "kg",
    minBulkKg: 100,
    pricePerKg: 26,
    availableKg: 2400,
    farmName: "Greenfield Farms",
    location: "Mahuva",
    photoHint: "Fresh red onions in sacks",
    qualityGrade: "A",
    status: "available",
  },
  {
    id: "veg-1002",
    name: "Hybrid Tomato",
    category: "Vegetable",
    unit: "kg",
    minBulkKg: 80,
    pricePerKg: 31,
    availableKg: 420,
    farmName: "Surya Agro",
    location: "Palitana",
    photoHint: "Ripe red tomatoes in crates",
    qualityGrade: "A",
    status: "low_stock",
  },
  {
    id: "fru-2001",
    name: "Kesar Mango",
    category: "Fruit",
    unit: "kg",
    minBulkKg: 60,
    pricePerKg: 88,
    availableKg: 1600,
    farmName: "Gir Orchard Collective",
    location: "Talaja",
    photoHint: "Kesar mangoes sorted by size",
    qualityGrade: "Premium",
    status: "available",
  },
  {
    id: "fru-2002",
    name: "Banana (Robusta)",
    category: "Fruit",
    unit: "kg",
    minBulkKg: 120,
    pricePerKg: 24,
    availableKg: 0,
    farmName: "Narmada Fruit Belt",
    location: "Ghogha",
    photoHint: "Green-yellow banana bunches",
    qualityGrade: "Standard",
    status: "unavailable",
  },
];

export const farmPartners: FarmPartner[] = [
  {
    id: "farm-1",
    name: "Greenfield Farms",
    owner: "Nitin Gohil",
    phone: "+91 98765 01234",
    location: "Mahuva",
    produceCount: 14,
    reliabilityScore: 4.8,
    status: "active",
  },
  {
    id: "farm-2",
    name: "Surya Agro",
    owner: "Meera Chauhan",
    phone: "+91 98989 45454",
    location: "Palitana",
    produceCount: 11,
    reliabilityScore: 4.4,
    status: "attention",
  },
  {
    id: "farm-3",
    name: "Gir Orchard Collective",
    owner: "Ravindra Barot",
    phone: "+91 97890 23232",
    location: "Talaja",
    produceCount: 8,
    reliabilityScore: 4.9,
    status: "active",
  },
];

export const inboundOrders: PurchaseOrder[] = [
  {
    id: "PO-3201",
    buyerName: "Shree Annapurna Traders",
    item: "A Grade Onion",
    requestedKg: 700,
    orderDate: "2026-03-08",
    adminStatus: "reviewing",
    assignedFarm: "Greenfield Farms",
    farmExpectedDispatch: "2026-03-10",
    adminCommittedDelivery: "2026-03-11",
  },
  {
    id: "PO-3202",
    buyerName: "Nidhi Fresh Foods",
    item: "Hybrid Tomato",
    requestedKg: 350,
    orderDate: "2026-03-09",
    adminStatus: "farm_confirmed",
    assignedFarm: "Surya Agro",
    farmExpectedDispatch: "2026-03-11",
    adminCommittedDelivery: "2026-03-12",
  },
  {
    id: "PO-3203",
    buyerName: "Western Hotels Supply",
    item: "Kesar Mango",
    requestedKg: 500,
    orderDate: "2026-03-09",
    adminStatus: "scheduled",
    assignedFarm: "Gir Orchard Collective",
    farmExpectedDispatch: "2026-03-12",
    adminCommittedDelivery: "2026-03-13",
  },
];

