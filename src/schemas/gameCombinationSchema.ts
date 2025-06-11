import { z } from "zod";

export const addGameCombination = z
  .object({
    gameType: z.string({ required_error: "Game Type is required" }),
    gameSchedule: z.string({ required_error: "Game Schedule is required" }),
    combinationOne: z.string({ required_error: "First Drawn Number is required" }),
    combinationTwo: z.string({ required_error: "Second Drawn Number is required" }),
    combinationThree: z.string().optional(),
    combinationFour: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const selectedGameType = parseInt(data.gameType);

    if ((selectedGameType === 3 || selectedGameType === 4) && !data.combinationThree?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["combinationThree"],
        message: "Third Drawn Number is required",
      });
    }

    if (selectedGameType === 4 && !data.combinationFour?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["combinationFour"],
        message: "Fourth Drawn Number is required",
      });
    }
  });