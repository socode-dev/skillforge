import { profilesData } from "../data/profilesData";
import MemberCard from "./MemberCard";

const FeaturedMembers = () => {
  return (
    <section className="mb-6">
      <h3 className="mb-4">Featured Community Members</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 tablet:grid-cols-3 gap-4">
        {profilesData.map((data, i) => (
          <MemberCard key={data.id} data={data} index={i} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedMembers;
