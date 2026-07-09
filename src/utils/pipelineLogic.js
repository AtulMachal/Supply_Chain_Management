// Maps Requirement and PO status to the PIPELINE_STAGES array index
// PIPELINE_STAGES:
// 0: "Requirement Raised", 1: "RFQ Sent", 2: "Quotation Received", 3: "PO Created",
// 4: "PO Approved", 5: "Dispatched by Vendor", 6: "Received at Site", 7: "Payment Settled"

export const getStageFromRequirement = (req) => {
  switch (req.status) {
    case "Draft":
      return 0; // Requirement Raised
    case "Sent to Vendor":
      return 1; // RFQ Sent
    case "Quoted":
      return 2; // Quotation Received
    case "PO Created":
      return 3; // PO Created
    default:
      return 0;
  }
};

export const getStageFromPO = (po) => {
  if (po.paymentStatus === "Paid") return 7;
  
  switch (po.status) {
    case "Draft":
    case "Pending Approval":
    case "Rejected": // treating Rejected as still sitting at the PO Creation step
      return 3;
    case "Approved":
      return 4;
    case "Sent to Vendor":
    case "Dispatched": // depending on naming convention
      return 5;
    case "Received":
      return 6;
    default:
      return 3;
  }
};
