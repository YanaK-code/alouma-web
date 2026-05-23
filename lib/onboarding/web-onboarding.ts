export type UserProfile = {
  careerStage: string;
  goal: string;
  sectors: string[];
  selectedRoleBySector: Record<string, string>;
  cvChallenge: string;
  applicationProcessConcern: string;
  activelyApplying: string;
  atsConcern: string;
};

export type OnboardingStep =
  | "careerStage"
  | "goal"
  | "revelation1"
  | "sector"
  | "cvChallenge"
  | "revelation2"
  | "atsConcern"
  | "revelationATS"
  | "applicationConcern"
  | "activelyApplying"
  | "revelationFinal";

export type RevelationKind = "first" | "second" | "ats" | "final";

export type Option = {
  id: string;
  label: string;
};

export type RevelationContent = {
  title: string;
  subtitle: string;
};

export type StrategyInput = {
  situation: string;
  goal: string;
  parentSectors: string[];
  challenge: string;
  applyingUrgency: string;
};

export const onboardingSteps = [
  "careerStage",
  "goal",
  "revelation1",
  "sector",
  "cvChallenge",
  "revelation2",
  "atsConcern",
  "revelationATS",
  "applicationConcern",
  "activelyApplying",
  "revelationFinal",
] as const satisfies readonly OnboardingStep[];

export const initialUserProfile: UserProfile = {
  careerStage: "",
  goal: "",
  sectors: [],
  selectedRoleBySector: {},
  cvChallenge: "",
  applicationProcessConcern: "",
  activelyApplying: "",
  atsConcern: "",
};

export const careerStageOptions: Option[] = [
  { id: "earlyCareer", label: "Early career (0–3 years)" },
  { id: "midLevel", label: "Mid-level (3–7 years)" },
  { id: "senior", label: "Senior (7+ years)" },
  { id: "leadershipExecutive", label: "Leadership / Executive" },
  { id: "freelancerConsultant", label: "Freelancer / Consultant" },
  { id: "returningToWork", label: "Returning to work (career break)" },
  { id: "switchingCareers", label: "Switching careers" },
  { id: "betweenRoles", label: "Between roles right now" },
];

const allGoalOptions: Option[] = [
  { id: "landing_first_job", label: "Landing my first job" },
  { id: "getting_promoted", label: "Getting promoted" },
  { id: "moving_to_new_company", label: "Moving to a new company" },
  { id: "switching_industries", label: "Switching industries" },
  { id: "stepping_into_leadership", label: "Stepping into leadership" },
  { id: "returning_after_break", label: "Returning after a break" },
  { id: "contract_freelance", label: "Finding contract / freelance work" },
  { id: "relocating_internationally", label: "Relocating internationally" },
  { id: "increasing_salary", label: "Increasing my salary" },
  { id: "exploring_possible", label: "Exploring what's possible" },
];

export const sectorOptions: Option[] = [
  { id: "tech", label: "Tech" },
  { id: "healthcare", label: "Healthcare" },
  { id: "finance", label: "Finance" },
  { id: "sales", label: "Sales" },
  { id: "marketing", label: "Marketing" },
  { id: "operations", label: "Operations" },
  { id: "hr_people", label: "HR / People" },
  { id: "legal", label: "Legal" },
  { id: "education", label: "Education" },
  { id: "public_sector", label: "Public sector" },
  { id: "creative", label: "Creative" },
  { id: "hospitality_tourism", label: "Hospitality / Tourism" },
  { id: "engineering", label: "Engineering" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "logistics_supply_chain", label: "Logistics / Supply Chain" },
  { id: "non_profit", label: "Non-profit" },
  { id: "consulting", label: "Consulting" },
  { id: "other", label: "Other" },
];

export const cvChallengeOptions: Option[] = [
  { id: "structure", label: "I'm not sure how to structure it" },
  { id: "impact", label: "I struggle to explain my impact clearly" },
  { id: "no_responses", label: "I'm not getting responses" },
  { id: "interviews_no_offers", label: "I get interviews but no offers" },
  { id: "switching_industries", label: "Switching industries feels overwhelming" },
  { id: "explaining_gaps", label: "Explaining gaps feels uncomfortable" },
  { id: "time_consuming", label: "It's too time consuming" },
  { id: "layout_formatting", label: "I struggle with layout and formatting" },
  { id: "improve_overall", label: "I just want to improve it overall" },
];

export const atsConcernOptions: Option[] = [
  { id: "high", label: "Very important for my applications" },
  { id: "balanced", label: "Helpful, but not the whole focus" },
  { id: "low", label: "Not a priority right now" },
];

export const applicationConcernOptions: Option[] = [
  { id: "standing_out", label: "Standing out against other applicants" },
  { id: "relevance_signal", label: "Making my experience feel relevant" },
  { id: "key_details_seen", label: "Making the right details easy to notice" },
  {
    id: "staying_consistent",
    label: "Keeping applications organized and consistent",
  },
  {
    id: "interview_confidence",
    label: "Feeling confident through the interview process",
  },
  { id: "decision_overload", label: "Knowing what to improve first" },
];

export const activelyApplyingOptions: Option[] = [
  { id: "urgent", label: "Yes, urgently" },
  { id: "casual", label: "Yes, casually" },
  { id: "notYet", label: "Not yet" },
];

const stageAliases: Record<string, string> = {
  student: "earlyCareer",
  first_job: "earlyCareer",
  early: "earlyCareer",
  studentGraduate: "earlyCareer",
  firstJob: "earlyCareer",
  mid: "midLevel",
  leadership: "leadershipExecutive",
  freelancer: "freelancerConsultant",
  returning: "returningToWork",
  switching: "switchingCareers",
  between_roles: "betweenRoles",
};

const normalizedCareerStages = new Set(careerStageOptions.map((option) => option.id));

const sectorLabelById = Object.fromEntries(
  sectorOptions.map((option) => [option.id, option.label]),
);

export function normalizedStage(profile: Pick<UserProfile, "careerStage">) {
  if (!profile.careerStage) {
    return "";
  }

  const normalized = stageAliases[profile.careerStage] ?? profile.careerStage;

  return normalizedCareerStages.has(normalized) ? normalized : "";
}

export function visibleGoalOptions(profile: Pick<UserProfile, "careerStage">) {
  if (normalizedStage(profile) === "earlyCareer") {
    return allGoalOptions;
  }

  return allGoalOptions.filter((option) => option.id !== "landing_first_job");
}

export function goalLens(goal: string) {
  switch (goal) {
    case "landing_first_job":
      return "your first role";
    case "getting_promoted":
      return "your next promotion";
    case "moving_to_new_company":
      return "your next company move";
    case "switching_industries":
      return "your industry switch";
    case "stepping_into_leadership":
      return "your leadership step";
    case "returning_after_break":
      return "your return to work";
    case "contract_freelance":
      return "your contract or freelance work";
    case "relocating_internationally":
      return "your international move";
    case "increasing_salary":
      return "your salary move";
    case "exploring_possible":
      return "the direction you choose next";
    default:
      return "your next step";
  }
}

export function primaryTargetLabel(profile: UserProfile) {
  const firstSector = profile.sectors[0];
  const selectedRole = firstSector
    ? profile.selectedRoleBySector[firstSector]?.trim()
    : "";

  if (selectedRole && selectedRole.toLowerCase() !== "other") {
    return selectedRole;
  }

  if (firstSector) {
    return sectorLabelById[firstSector] ?? firstSector;
  }

  return "your target direction";
}

export function firstRevelationSubtitle(profile: UserProfile) {
  const lens = goalLens(profile.goal);

  switch (normalizedStage(profile)) {
    case "earlyCareer":
      if (profile.goal === "landing_first_job") {
        return `For ${lens}, recruiters need to see potential quickly, so we'll lead with skills, projects, education, and the proof you already have.`;
      }

      return `For ${lens}, we'll make your early experience, skills, and potential easy to connect to the role.`;
    case "midLevel":
    case "senior":
      return `For ${lens}, recruiters need clear scope and outcomes, so we'll make your experience feel relevant and easy to compare.`;
    case "leadershipExecutive":
      return `For ${lens}, we'll bring role scope, leadership context, and measurable outcomes to the front.`;
    case "switchingCareers":
      return `For ${lens}, we'll connect what you have already done to the direction you are moving toward.`;
    case "returningToWork":
      return `For ${lens}, we'll make your recent strengths, transferable value, and next step easy to read.`;
    case "freelancerConsultant":
      return `For ${lens}, we'll make your scope, credibility, and strongest proof easy for clients or hiring teams to understand.`;
    default:
      return `For ${lens}, we'll lead with the details that make your fit and next step easy to understand.`;
  }
}

export function secondRevelationSubtitle(profile: UserProfile) {
  const target = primaryTargetLabel(profile);
  const lens = goalLens(profile.goal);

  switch (profile.cvChallenge) {
    case "layout_formatting":
    case "structure":
      return `For ${target}, we'll give your CV a cleaner structure, clearer spacing, and an order that supports ${lens}.`;
    case "impact":
    case "improve_overall":
      return `For ${target}, we'll choose the strongest proof and turn raw experience into clearer evidence.`;
    case "switching_industries":
    case "explaining_gaps":
      return `For ${target}, we'll connect your story clearly so changes, gaps, or pivots feel intentional.`;
    case "no_responses":
    case "interviews_no_offers":
      return `For ${target}, we'll sharpen the relevance signals so the right experience is easier to notice.`;
    case "time_consuming":
      return `For ${target}, we'll focus the CV around the details that matter most, so the next edits feel more manageable.`;
    default:
      switch (normalizedStage(profile)) {
        case "earlyCareer":
          return `For ${target}, we'll highlight skills, projects, and evidence that support ${lens}.`;
        case "switchingCareers":
        case "returningToWork":
          return `For ${target}, we'll connect your direction with the transferable proof you already have.`;
        default:
          return `For ${target}, we'll order your experience, skills, and evidence around what matters most.`;
      }
  }
}

export function atsRevelationSubtitle(profile: UserProfile) {
  switch (profile.atsConcern) {
    case "high":
      return "We'll use clear labels, plain structure, and scan-safe wording so systems can read the CV without losing your strongest points.";
    case "balanced":
      return "We'll balance ATS readability with a human recruiter scan, keeping the structure clean and the story easy to follow.";
    case "low":
      return "We'll keep the CV clean and readable without making it feel robotic or over-optimized.";
    default:
      return "We'll use a clean structure that works for systems and still reads naturally for recruiters.";
  }
}

export function finalUrgencyPhrase(id: string) {
  switch (id) {
    case "urgent":
      return "Your next version should be practical and ready to build from now.";
    case "casual":
      return "Your CV can start as a calm foundation that stays easy to adjust.";
    case "notYet":
      return "Your CV can become a clear foundation before applications start.";
    default:
      return "Your CV can start from a clearer, more useful foundation.";
  }
}

export function finalConcernPhrase(id: string) {
  switch (id) {
    case "interview_confidence":
    case "decision_overload":
      return "We'll reduce the noise and make the next decisions easier.";
    case "key_details_seen":
      return "We'll make the right details easier to notice before the next conversation.";
    case "standing_out":
    case "relevance_signal":
      return "We'll shape it around relevance, proof, and the signals that help you stand out.";
    case "staying_consistent":
      return "We'll keep the structure consistent so each application is easier to adapt.";
    default:
      return "We'll shape the structure around your answers, then you can refine each section next.";
  }
}

export function finalRevelationSubtitle(profile: UserProfile) {
  return `${finalUrgencyPhrase(profile.activelyApplying)} ${finalConcernPhrase(
    profile.applicationProcessConcern,
  )}`;
}

export function buildRevelationContent(
  kind: RevelationKind,
  profile: UserProfile,
): RevelationContent {
  switch (kind) {
    case "first":
      return {
        title: "Start with fit",
        subtitle: firstRevelationSubtitle(profile),
      };
    case "second":
      return {
        title: "Lead with your strongest signal",
        subtitle: secondRevelationSubtitle(profile),
      };
    case "ats":
      return {
        title: "Keep it clean for ATS",
        subtitle: atsRevelationSubtitle(profile),
      };
    case "final":
      return {
        title: "Here's what we'll build from",
        subtitle: finalRevelationSubtitle(profile),
      };
  }
}

export function buildStrategyInput(profile: UserProfile): StrategyInput {
  return {
    situation: profile.careerStage,
    goal: profile.goal,
    parentSectors: profile.sectors.slice(0, 2),
    challenge: profile.cvChallenge,
    applyingUrgency: profile.activelyApplying,
  };
}
