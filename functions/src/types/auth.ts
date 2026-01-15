export interface FinalizeSignupPayload {
  profile: {
    name: string;
    email: string;
    bio?: string;
    role: string;
    avatar?: string;
    skillsReview: { skillId: string; skillName: string; skillDesc: string }[];
  };
  skills: {
    skillName: string;
    skillDesc: string;
  }[];
}

export type UserDocPayload = Pick<FinalizeSignupPayload, "profile">;
