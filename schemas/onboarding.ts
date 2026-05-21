import { z } from "zod";
import { onboardingSteps } from "@/lib/router/routes";

export const onboardingAnswersSchema = z.record(
  z.enum(onboardingSteps),
  z.string(),
);

export type OnboardingAnswers = z.infer<typeof onboardingAnswersSchema>;
