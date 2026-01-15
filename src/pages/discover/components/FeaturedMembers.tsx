import useUsersStore from "../../../store/useUsersAndSkillsStore";
import MemberCard from "./MemberCard";

const FeaturedMembers = () => {
  const { users } = useUsersStore();

  return (
    <section className="mb-6">
      <h3 className="mb-4">Featured Community Members</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 tablet:grid-cols-3 gap-4">
        {users.map((user, i) => (
          <MemberCard key={user.userId} user={user} index={i} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedMembers;
