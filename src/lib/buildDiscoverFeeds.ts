interface SkillsDataType {
  id: string;
  skillName: string;
  skillDesc: string;
  skillLearners: number;
}

export interface FetchedUserDataType {
  id: string;
  uid: string;
  avatar: string;
  name: string;
  email: string;
  role: string;
  bio: string;
  isEmailVerified: boolean;
  signupStepsCompleted: string;
  skills: SkillsDataType[];
}

export interface SkillsFeedDataType {
  skillId: string;
  name: string;
  role: string;
  avatar: string;
  skillName: string;
  skillDesc: string;
  skillLearners: number;
}

export interface UsersFeedDataType {
  name: string;
  email: string;
  role: string;
  bio: string;
  id: string;
  avatar: string;
  skills: SkillsDataType[];
}

export const buildDiscoverFeeds = (users: FetchedUserDataType[]) => {
  const skillsFeed: SkillsFeedDataType[] = [];
  const usersFeed: UsersFeedDataType[] = [];

  users.forEach((user) => {
    const userExist = usersFeed.find((u) => u.id === user.id);

    if (!userExist) {
      usersFeed.push({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar,
        skills: user.skills,
      });
    }

    user.skills.forEach((skill: SkillsDataType) => {
      const skillExist = skillsFeed.find((data) => data.skillId === skill.id);
      if (!skillExist) {
        skillsFeed.push({
          skillId: skill.id,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          skillName: skill.skillName,
          skillDesc: skill.skillDesc,
          skillLearners: skill.skillLearners,
        });
      }
    });
  });

  return { usersFeed, skillsFeed };
};
