import { useNavigate } from "react-router-dom";
import logo from "../../../assets/skillforge-logo.webp";

const AuthHeader = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="grow w-fit flex items-center gap-2 mt-8 cursor-pointer"
    >
      <img src={logo} alt="skillforge logo" loading="lazy" width={30} />
      <span className="text-xl font-semibold">SkillForge</span>
    </button>
  );
};

export default AuthHeader;
