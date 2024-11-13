interface ExcelItem {
  Description: string; // Maps to Equipment Name
  "Tag Id": string; // Maps to Tag ID
  Make: string; // Maps to Make
  Model: string; // Maps to Model
  "Serial Number": string; // Maps to Serial Number
  Scope: string; // Maps to Type of Scope
  Type: string; // Maps to RangeType
  Range: string; // Maps to Range compiled
  "Range (min)": string; // Maps to Range (min)
  "Range (max)": string; // Maps to Range (max)
  "Certificate No.": string; // Maps to Certificate No.
  Traceability: string; // Maps to Traceability
}

export default ExcelItem;
