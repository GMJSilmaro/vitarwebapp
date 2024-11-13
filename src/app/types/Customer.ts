export interface CustomerEquipment {
  equipmentID: string;
  equipmentName: string;
  typeOfScope: string;
  description: string;
  tagID: string;
  model: string;
  serialNumber: string;
  type: string;
  range: string;
  traceability: string;
}
export interface CustomerSite {
  customerID: string;
  customerName: string;
  siteID: string;
  siteName: string;
  street1: string;
  street2: string;
  street3: string;
  state: string;
  city: string;
  postCode: string;
  country: string;
}

export interface Customer {
  customerID: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  BRN: string;
  TIN: string;
  industry: string;
  status: string;
  contactFirstName: string;
  contactLastName: string;
  contactPhone: string;
  contactEmail: string;
  sites?: CustomerSite[];
  equipment?: CustomerEquipment[];
}
