import { z } from "zod";

export const userSchema = z.object({
  firstName: z
    .string({ required_error: "Given Name is required" })
    .min(1, "Given Name is required")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "First Name can only contain letters and spaces.",
    }),

  lastName: z
    .string({ required_error: "Last Name is required" })
    .min(1, "Last Name is required")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "Last Name can only contain letters and spaces.",
    }),

  phoneNumber: z
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

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .refine((val) => val.length >= 8, {
      message: "Password must be at least 8 characters long.",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must include at least one uppercase letter.",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must include at least one lowercase letter.",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must include at least one number.",
    })
    .refine((val) => /[!@#$%^&*]/.test(val), {
      message: "Password must include at least one special character (!@#$%^&*).",
    }),

  middleName: z.string().optional(),
  suffix: z.string().optional(),
  street: z.string().optional(),
  CreatedBy: z.string().optional(),

  operatorId: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val) : val),
    z.number({
      required_error: "Operator Name is required",
      invalid_type_error: "Operator ID must be a number",
    })
  ),
});

export const updateSchema = z.object({
  PhoneNumber: z
    .string({ required_error: "Phone Number is required" })
    .min(1, "Phone Number is required")
    .refine((val) => /^09\d{9}$/.test(val), {
      message:
        "Please enter a valid phone number starting with 09 and 11 digits long (e.g. 09XXXXXXXXX).",
    }),

  remarks: z
    .string({ required_error: "Remarks is required" })
    .min(1, "Remarks is required")
    .max(500, "Remarks must not exceed 500 characters"),

  Email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .refine((val) => /\S+@\S+\.\S+/.test(val), {
      message: "Please enter a valid email address e.g. xxx@email.com",
    }),
});

export const getInputClassName = (hasError: boolean) => {
  return `w-full border rounded px-3 py-2 text-sm ${hasError ? 'border-[#CE1126]' : 'border-gray-300'}`;
};

