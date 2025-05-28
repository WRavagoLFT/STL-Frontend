import { z } from "zod";

export const operatorSchema = z.object({
  name: z
    .string({ required_error: "Given Name is required" })
    .min(1, "Given Name is required")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "First Name can only contain letters and spaces.",
    }),
  contactNumber: z
    .string({ required_error: "Phone Number is required" })
    .min(1, "Phone Number is required")
    .refine((val) => /^09\d{9}$/.test(val), {
      message:
        "Please enter a valid phone number starting with 09 and 11 digits long (e.g. 09XXXXXXXXX).",
    }),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .refine((val) => /\S+@\S+\.\S+/.test(val), {
      message: "Please enter a valid email address e.g. xxx@email.com",
    }),
  gameTypes: z.preprocess(
    (val) => {
      if (Array.isArray(val)) {
        return val.map((v) => (typeof v === "string" ? parseInt(v, 10) : v));
      }
      return val;
    },
    z
      .array(
        z.number({
          required_error: "Game Type are required",
          invalid_type_error: "Each Game Type must be a number",
        })
      )
      .min(1, { message: "At least one Game Type is required" })
  ),
  regions: z.preprocess(
    (val) => {
      if (Array.isArray(val)) {
        return val.map((v) => (typeof v === "string" ? parseInt(v, 10) : v));
      }
      return val;
    },
    z
      .array(
        z.number({
          required_error: "Regions are required",
          invalid_type_error: "Each Region must be a number",
        })
      )
      .min(1, { message: "At least one Region is required" })
  ),
  provinces: z.preprocess(
    (val) => {
      if (Array.isArray(val)) {
        return val.map((v) => (typeof v === "string" ? parseInt(v, 10) : v));
      }
      return val;
    },
    z
      .array(
        z.number({
          required_error: "Provinces are required",
          invalid_type_error: "Each Province must be a number",
        })
      )
      .min(1, { message: "At least one Province is required" })
  ),
  cities: z.preprocess(
    (val) => {
      if (Array.isArray(val)) {
        return val.map((v) => (typeof v === "string" ? parseInt(v, 10) : v));
      }
      return val;
    },
    z
      .array(
        z.number({
          required_error: "Cities are required",
          invalid_type_error: "Each City must be a number",
        })
      )
      .min(1, { message: "At least one City is required" })
  ),
  dateOfOperation: z
    .string({ required_error: "Date of operations is required" })
    .min(1, "Date of operations is required"),
  address: z
    .string({ required_error: "Operator address is required" })
    .min(1, "Operator address is required"),
  areaOfOperations: z
    .string({ required_error: "Area of operations is required" })
    .min(1, "At least one area of operation is required"),
});
