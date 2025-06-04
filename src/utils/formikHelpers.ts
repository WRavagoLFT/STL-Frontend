import { ZodSchema } from "zod";

export function toFormikValidationSchema(schema: ZodSchema) {
  return (values: any) => {
    const result = schema.safeParse(values);
    if (result.success) return {};

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      if (issue.path.length > 0) {
        const field = issue.path[0];
        errors[field] = errors[field]
          ? errors[field] + " | " + issue.message
          : issue.message;
      } else {
        errors["form"] = issue.message;
      }
    }
    return errors;
  };
}
