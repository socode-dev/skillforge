import { Sparkles, TrendingUp } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();

  if (!currentUser) return;

  return (
    <section className="p-8 text-primary-foreground bg-gradient-to-br from-primary via-accent to-accent/90 rounded-radius-xl space-y-5">
      <h2 className="flex gap-3 text-xl small:text-2xl font-medium">
        <Sparkles size={25} />{" "}
        <span>Hey {currentUser.profile.name} 👋🏻, ready to level up today?</span>
      </h2>

      <p className="text-sm">
        Explore new skills, track your progress, and manage your connections.
      </p>

      <div className="text-sm font-medium flex flex-col small:flex-row gap-4">
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          type="button"
          variant="secondary"
          onClick={() => navigate("/home/discover")}
          className="bg-white flex items-center justify-center gap-3 py-3"
        >
          <TrendingUp size={20} />
          <span>Discover Skills</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/home/skill-requests")}
          className="border-primary"
        >
          View Requests
        </Button>
      </div>
    </section>
  );
};

export default Hero;
