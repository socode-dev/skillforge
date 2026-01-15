import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SkillDataType } from "@/store/useUsersAndSkillsStore";

export const fetchSkills = async (currentUserId: string) => {
  const skillsRef = collection(db, "skills");

  try {
    const q = query(
      skillsRef,
      where("isActive", "==", true),
      where("ownerUserId", "!=", currentUserId),
      orderBy("ownerUserId"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const snapshot = await getDocs(q);

    const skills = snapshot.docs.map((doc) => ({
      ...doc.data(),
      skillId: doc.id,
    })) as SkillDataType[];

    return skills;
  } catch (err) {
    console.log("Error:", err);
  }
};

export const fetchUsers = async (currentUserId: string) => {
  const q = query(
    collection(db, "users"),
    where("userId", "!=", currentUserId),
    orderBy("userId", "desc"),
    limit(12)
  );

  try {
    const snapshot = await getDocs(q);

    const users = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        userId: doc.id,
        name: data.name,
        role: data.role,
        avatar: data.avatar ?? "",
        ratingAvg: data.ratingAvg,
        skillsReview: data.skillReview ?? [],
        createdAt: data.createdAt,
      };
    });

    return users;
  } catch (err) {
    console.log("Error:", err);
  }
};
