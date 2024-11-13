export interface Equipment {
  id: string;
  customerID?: string; // Make these optional
  customerName?: string;
  siteID?: string;
  siteName?: string;
  equipmentID: string;
  equipmentName: string;
  typeOfScope: string;
  description: string;
  tagID: string;
  make: string;
  model: string;
  serialNumber: string;
  rangeType: string;
  rangeMinTemp: string;
  rangeMaxTemp: string;
  rangeMinPercent: string;
  rangeMaxPercent: string;
  certificateNo: string;
  traceability: string;
}
