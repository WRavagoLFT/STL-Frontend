import { z } from "zod";

export const addDeviceSchema = z.object({
  assignmentDate: z
    .string({ required_error: "Assignment Date is required" })
    .min(1, "Assignment Date is required"),

  usageNotes: z
    .string({ required_error: "Usage Notes are required" })
    .min(1, "Usage Notes are required"),

  simNumber: z
    .string({ required_error: "SIM Number is required" })
    .refine((val) => /^09\d{9}$/.test(val), {
      message: "Please enter a valid SIM number starting with 09 and 11 digits long.",
    }),
  telcoProvider: z
    .string({ required_error: "Telco Provider is required" })
    .min(1, "Telco Provider is required"),

  dataPlan: z
    .string({ required_error: "Data Plan is required" })
    .min(1, "Data Plan is required"),

//   assignedUser: z.preprocess(
//     (val) => (typeof val === "string" ? parseInt(val, 10) : val),
//     z.number({ required_error: "Assigned User is required" })
//   ),
});

export const updateDeviceSchema = z.object({
  simNumber: z
    .string({ required_error: "SIM Number is required" })
    .refine((val) => /^09\d{9}$/.test(val), {
      message: "Please enter a valid SIM number starting with 09 and 11 digits long.",
    }),

  dataPlan: z
    .string({ required_error: "Data Plan is required" })
    .min(1, "Data Plan is required"),

  remarks: z
    .string({ required_error: "Remarks is required." })
    .min(1, "Remarks is required.")
    .max(100, "Remarks cannot exceed 100 characters."),
});


