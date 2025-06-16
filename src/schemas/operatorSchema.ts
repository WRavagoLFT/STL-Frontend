import { z } from "zod";

export const operatorSchema = z.object({
  execFirstName: z
    .string({ required_error: "Given Name is required." })
    .min(1, "Given Name is required.")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "First Name can only contain letters and spaces.",
    }),
  execLastName: z
    .string({ required_error: "Last Name is required." })
    .min(1, "Last Name is required.")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "First Name can only contain letters and spaces.",
    }),
  execSuffix: z.string().optional(),
  execNumber: z
    .string({ required_error: "Phone Number is required." })
    .min(1, "Phone Number is required.")
    .refine((val) => /^09\d{9}$/.test(val), {
      message:
        "Please enter a valid phone number starting with 09 and 11 digits long (e.g. 09XXXXXXXXX).",
    }),
  execEmail: z
    .string({ required_error: "Email is required." })
    .min(1, "Email is required.")
    .refine((val) => /\S+@\S+\.\S+/.test(val), {
      message: "Please enter a valid email address e.g. xxx@email.com",
    }),
  execPassword: z
    .string({ required_error: "Password is required." })
    .superRefine((val, ctx) => {
      const isValid =
        val.length >= 8 &&
        /[A-Z]/.test(val) &&
        /[a-z]/.test(val) &&
        /\d/.test(val) &&
        /[!@#$%^&*]/.test(val);

      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        });
      }
    }),
  name: z
    .string({ required_error: "Operator Name is required." })
    .min(1, "Operator Name is required.")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "Operator Name can only contain letters and spaces.",
    }),
  contactNumber: z
    .string({ required_error: "Phone Number is required." })
    .min(1, "Phone Number is required.")
    .refine((val) => /^09\d{9}$/.test(val), {
      message:
        "Please enter a valid phone number starting with 09 and 11 digits long (e.g. 09XXXXXXXXX).",
    }),
  email: z
    .string({ required_error: "Email is required." })
    .min(1, "Email is required.")
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
          required_error: "Game Type are required.",
          invalid_type_error: "Each Game Type must be a number",
        })
      )
      .min(1, { message: "Game Type are required." })
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
          required_error: "Regions are required.",
          invalid_type_error: "Each Region must be a number.",
        })
      )
      .min(1, { message: "At least one Region is required." })
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
          required_error: "Provinces are required.",
          invalid_type_error: "Each Province must be a number.",
        })
      )
      .min(1, { message: "At least one Province is required." })
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
          required_error: "Cities are required.",
          invalid_type_error: "Each City must be a number.",
        })
      )
      .min(1, { message: "At least one City is required." })
  ),

  dateOfOperation: z
    .string({ required_error: "Date of operations is required." })
    .min(1, "Date of operations is required."),
  address: z
    .string({ required_error: "Operator address is required." })
    .min(1, "Operator address is required."),
  areaOfOperations: z
    .string({ required_error: "Area of operations is required." })
    .min(1, "At least one area of operation is required."),
});
    
export const updateOperatorSchema = z.object({
  execNumber: z
    .string({ required_error: "Phone Number is required." })
    .min(1, "Phone Number is required.")
    .refine((val) => /^09\d{9}$/.test(val), {
      message:
        "Please enter a valid phone number starting with 09 and 11 digits long (e.g. 09XXXXXXXXX).",
    }),
  execEmail: z
    .string({ required_error: "Email is required." })
    .min(1, "Email is required.")
    .refine((val) => /\S+@\S+\.\S+/.test(val), {
      message: "Please enter a valid email address e.g. xxx@email.com",
    }),
  execPassword: z
    .string({ required_error: "Password is required." })
    .superRefine((val, ctx) => {
      const isValid =
        val.length >= 8 &&
        /[A-Z]/.test(val) &&
        /[a-z]/.test(val) &&
        /\d/.test(val) &&
        /[!@#$%^&*]/.test(val);

      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        });
      }
    }),
  name: z
    .string({ required_error: "Operator Name is required." })
    .min(1, "Operator Name is required.")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "Operator Name can only contain letters and spaces.",
    }),
  contactNumber: z
    .string({ required_error: "Phone Number is required." })
    .min(1, "Phone Number is required.")
    .refine((val) => /^09\d{9}$/.test(val), {
      message:
        "Please enter a valid phone number starting with 09 and 11 digits long (e.g. 09XXXXXXXXX).",
    }),
  email: z
    .string({ required_error: "Email is required." })
    .min(1, "Email is required.")
    .refine((val) => /\S+@\S+\.\S+/.test(val), {
      message: "Please enter a valid email address e.g. xxx@email.com",
    }),
  gameTypes: z.preprocess(
    (val) => {
      if (Array.isArray(val)) {
        const values = val.map((v) =>
          typeof v === "object" && v !== null && "value" in v ? v.value : null
        );
        return values.some((v) => v === null) ? undefined : values;
      }
      return undefined;
    },
    z
      .array(
        z.number({
          required_error: "Game Type is required.",
          invalid_type_error: "Each Game Type must be a number",
        })
      )
      .min(1, { message: "Game Type is required." })
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
          required_error: "Cities are required.",
          invalid_type_error: "Each City must be a number.",
        })
      )
      .min(1, { message: "Cities are required." })
  ),
  dateOfOperation: z
    .string({ required_error: "Date of operations is required." })
    .min(1, "Date of operations is required."),
  address: z
    .string({ required_error: "Operator address is required." })
    .min(1, "Operator address is required."),
  areaOfOperations: z.preprocess(
    (val) => (typeof val === "number" ? String(val) : val),
    z
      .string({ required_error: "Area of operations is required." })
      .min(1, "Cities are required.")
  ),
  remarks: z
    .string({ required_error: "Remarks is required." })
    .min(1, "Remarks is required.")
    .max(100, "Remarks cannot exceed 100 characters."),
});

