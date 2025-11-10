import { useNavigate } from "react-router-dom";
import logo from "../../../assets/skillforge-logo.webp";

const AuthHeader = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-2 mt-8 cursor-pointer"
    >
      <img src={logo} alt="skillforge" loading="lazy" width={30} />
      <span className="text-xl font-semibold">SkillForge</span>
    </button>
  );
};

export default AuthHeader;
