import { z } from "zod";

export const userSchema = z
  .object({
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
      .superRefine((val, ctx) => {
        if (val.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must be at least 8 characters long.",
          });
          return; // stop validation here
        }
        if (!/[A-Z]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must include at least one uppercase letter.",
          });
          return;
        }
        if (!/[a-z]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must include at least one lowercase letter.",
          });
          return;
        }
        if (!/\d/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must include at least one number.",
          });
          return;
        }
        if (!/[!@#$%^&*]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Password must include at least one special character (!@#$%^&*).",
          });
          return;
        }
      }),

    middleName: z.string().optional(),
    suffix: z.string().optional(),
    street: z.string().optional(),
    CreatedBy: z.string().optional(),

    userTypeId: z.number({ required_error: "User Type is required" }),
    accountType: z.number(),

    operatorId: z.preprocess(
      (val) =>
        val === "" ? undefined : typeof val === "string" ? parseInt(val) : val,
      z
        .number({
          invalid_type_error: "Operator ID must be a number",
        })
        .optional()
    ),

    BranchId: z.preprocess(
      (val) =>
        val === "" ? undefined : typeof val === "string" ? parseInt(val) : val,
      z
        .number({
          invalid_type_error: "Branch ID must be a number",
        })
        .optional()
    ),
  })
  .superRefine((data, ctx) => {
    // Require operatorId for userTypeId === 4
    if (data.userTypeId === 4) {
      if (data.operatorId === undefined) {
        ctx.addIssue({
          path: ["operatorId"],
          code: z.ZodIssueCode.custom,
          message: "Assigned Company is required.",
        });
      }
    }

    // Require BranchId for userTypeId === 5
    if (data.userTypeId === 5) {
      if (data.BranchId === undefined) {
        ctx.addIssue({
          path: ["BranchId"],
          code: z.ZodIssueCode.custom,
          message: "Assigned PCSO Branch is required.",
        });
      }
    }
  });


export const updateUserSchema = z.object({
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
  remarks: z
    .string({ required_error: "Remarks is required." })
    .min(1, "Remarks is required.")
    .max(100, "Remarks cannot exceed 100 characters."),
});

export const getInputClassName = (hasError: boolean) => {
  return `w-full border rounded px-3 py-2 text-sm ${hasError ? 'border-[#CE1126]' : 'border-gray-300'}`;
};

