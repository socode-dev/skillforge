import { ArrowRight, Sparkles, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import useUsersAndSkillsStore from "@/store/useUsersAndSkillsStore";
import useAuthStore from "@/store/useAuthStore";
import useRequestsStore from "@/store/useRequestsStore";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const DiscoverRecommendation = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const skills = useUsersAndSkillsStore(state => state.skills)
  const disablebutton = useUsersAndSkillsStore(state => state.disablebutton);
  const skillRequests = useRequestsStore(state => state.skillRequests);
  const getSkillRequestButtonChildren = useRequestsStore(state => state.getSkillRequestButtonChildren);
  const onSendRequest = useRequestsStore(state => state.onSendRequest);
  const loading = useRequestsStore(state => state.loading);

  const recommendations = useMemo(() => [...skills]
    .sort((a, b) => (b.learnersCount ?? 0) - (a.learnersCount ?? 0))
    .slice(0, 3), [skills]);

  if (!currentUser || !recommendations.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h4 className="flex items-center gap-2">
          <Sparkles size={20} className="text-primary" />
          <span className="text-base text-foreground">
            Discover Recommendations
          </span>
        </h4>

        <Link
          to="/home/discover"
          className="flex gap-2 items-center text-primary text-sm font-medium"
        >
          <span>View All</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="relative w-full max-sm:overflow-x-auto max-sm:overflow-y-hidden scrollbar-hide scroll-smooth">
        <div className="max-sm:flex gap-4 w-max max-w-full max-sm:snap-x max-sm:snap-mandatory sm:grid sm:grid-cols-2 md:grid-cols-3">
          {recommendations.map((skill) => {
            const requestStatus = skillRequests.find(
              (request) => request.skillId === skill.skillId
            )?.status;
            const { text: buttonText, icon: ButtonIcon } =
              getSkillRequestButtonChildren(requestStatus);
            const isButtonDisabled = disablebutton(requestStatus);
            const requestData = {
              skillId: skill.skillId,
              skillName: skill.skillName,
              skillDesc: skill.skillDesc,
              owner: {
                userId: skill.ownerId,
                name: skill.ownerName,
                role: skill.ownerRole,
                avatar: skill.ownerAvatar,
              },
              requester: {
                userId: currentUser.profile.userId,
                name: currentUser.profile.name,
                role: currentUser.profile.role,
                avatar: currentUser.profile.avatar,
              },
            };

            return (
              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: "0 5px 10px 5px rgba(0, 0, 0, 0.05)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                key={skill.skillId}
                className="min-w-64 p-4 bg-card border-1 border-border rounded-radius-xl shadow group"
              >
                <p className="w-fit text-xs px-3 py-1 rounded-full mb-2 bg-soft-primary text-primary">
                  {skill.ownerRole || "Skill"}
                </p>

                <h5 className="text-base text-card-foreground mb-3 line-clamp-1">
                  {skill.skillName}
                </h5>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {skill.skillDesc}
                </p>

                <div className="flex items-center justify-between gap-3 mb-4 text-xs text-muted-foreground">
                  <span className="truncate">By {skill.ownerName}</span>
                  <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    <Users size={14} />
                    {skill.learnersCount ?? 0}
                  </span>
                </div>

                <Button
                  onClick={() => onSendRequest(requestData)}
                  type="button"
                  variant="outline"
                  isDisabled={isButtonDisabled || loading.isRequesting[skill.skillId]}
                  className="w-full flex justify-center items-center gap-3 text-primary py-2 text-sm font-semibold group-hover:scale-105"
                >
                  {loading.isRequesting[skill.skillId] ? (
                    "Requesting..."
                  ) : (
                    <>
                      <ButtonIcon size={15} />
                      <span>{buttonText}</span>
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DiscoverRecommendation;
