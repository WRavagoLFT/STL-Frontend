import { z } from "zod";

export const addGameCombination = z
  .object({
    gameType: z.preprocess(
      (val) => {
        const parsed = parseInt(val as string);
        return isNaN(parsed) ? undefined : parsed;
      },
      z.number({ required_error: "Game Type is required." })
    ),
    gameSchedule: z.preprocess((val) => {
      const parsed = parseInt(val as string);
      return isNaN(parsed) ? undefined : parsed;
    }, z.number().optional()),
    combinationOne: z
      .string({ required_error: "First Drawn Number is required." })
      .min(1, "First Drawn Number is required."),
    combinationTwo: z
      .string({ required_error: "Second Drawn Number is required." })
      .min(1, "Second Drawn Number is required."),
    combinationThree: z.string().optional(),
    combinationFour: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { gameType } = data;

    // Early exit if gameType is invalid
    if (typeof gameType !== "number") return;

    const parseNumber = (val: string | undefined) => {
      const parsed = Number(val);
      return isNaN(parsed) ? null : parsed;
    };

    const one = parseNumber(data.combinationOne);
    const two = parseNumber(data.combinationTwo);
    const three = parseNumber(data.combinationThree);
    const four = parseNumber(data.combinationFour);

    const addIssue = (field: keyof typeof data, message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });

    const validateRange = (
      field: keyof typeof data,
      num: number | null,
      min: number,
      max: number
    ) => {
      if (num === null || num < min || num > max) {
        addIssue(field, `Must be a number from ${min} to ${max}`);
      }
    };

    if (data.gameSchedule === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gameSchedule"],
        message: "Game Schedule is required.",
      });
    }

    // required. fields based on gameType
    if (gameType >= 3 && !data.combinationThree?.trim()) {
      addIssue("combinationThree", "Third Drawn Number is required.");
    }

    if (gameType === 4 && !data.combinationFour?.trim()) {
      addIssue("combinationFour", "Fourth Drawn Number is required.");
    }

    // Range checks
    if (gameType === 1) {
      validateRange("combinationOne", one, 1, 40);
      validateRange("combinationTwo", two, 1, 40);
    } else if ([2, 3, 4].includes(gameType)) {
      validateRange("combinationOne", one, 0, 9);
      validateRange("combinationTwo", two, 0, 9);
      if (gameType >= 3) validateRange("combinationThree", three, 0, 9);
      if (gameType === 4) validateRange("combinationFour", four, 0, 9);
    }
  });
