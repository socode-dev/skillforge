interface SkillRequestUser {
  userId: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface SendPayload {
  skillId: string;
  skillName: string;
  skillDesc: string;

  owner: SkillRequestUser;

  requester: SkillRequestUser;
}
