import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { FaGoogle } from "react-icons/fa6";
import { Eye, EyeOff, Lock, Mail, type LucideIcon } from "lucide-react";
import { useCallback, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import AuthHeader from "./components/AuthHeader";
import { useAuthForm } from "../../hooks/useAuthForm";
import { loginSchema, type LoginSchema } from "../../schemas/loginSchema";
import useAuthStore from "../../store/useAuthStore";

const Login = () => {
  const navigate = useNavigate();
  const onLogin = useAuthStore(state => state.onLogin);
  const loginErr = useAuthStore(state => state.loginErr);
  const [revealPassword, setRevealPassword] = useState(false);

  const RevealIcon: LucideIcon = revealPassword ? EyeOff : Eye;

  const form = useAuthForm<LoginSchema>(loginSchema, "onChange");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = form;

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    void handleSubmit((data) => {
    onLogin(data.email, data.password, reset, navigate);
  })(e)
  }, [handleSubmit, onLogin, reset, navigate]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full h-auto flex"
    >
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="pb-8 px-6 md:px-12 lg:px-18 w-full max-tablet:max-w-[500px] tablet:w-6/12 max-tablet:mx-auto"
      >
        <AuthHeader />
        <div className="space-y-4 my-8">
          <h2 className="text-2xl font-semibold">Welcome Back to SkillForge</h2>
          <p className="text-muted-foreground text-base">
            Log in to cotinue learning and sharing skills.
          </p>
        </div>

        {loginErr && (
          <p className="w-fit text-destructive text-sm bg-soft-destructive px-10 py-2 my-8 mx-auto rounded-radius">
            {loginErr}
          </p>
        )}

        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <fieldset className="space-y-1">
            <div className="relative flex flex-col gap-2">
              <Input
                {...register("email")}
                label={"Email"}
                name={"email"}
                type={"email"}
                placeholder={"you@example.com"}
                className="px-12 py-3"
              />
              <Mail
                size={20}
                className="absolute top-[45%] left-[4%] translate-y-[45%] translate-x-[2%] text-muted-foreground"
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </fieldset>

          <fieldset className="space-y-1">
            <div className="relative flex flex-col gap-2">
              <Input
                {...register("password")}
                label={"Password"}
                name={"password"}
                type={revealPassword ? "text" : "password"}
                placeholder="•••••••••"
                className="px-12 py-3"
              />
              <Lock
                size={20}
                className="absolute top-[45%] left-[4%] translate-y-[45%] translate-x-[2%] text-muted-foreground"
              />

              <RevealIcon
                onClick={() => setRevealPassword((prev) => !prev)}
                size={20}
                className="absolute top-[45%] right-[5%] translate-y-[45%] translate-x-[5%] text-muted-foreground cursor-pointer hover:text-foreground transition"
              />
            </div>
            {errors.password && (
              <p className="text-destructive text-xs">
                {errors.password.message}
              </p>
            )}
          </fieldset>

          <fieldset className="flex justify-between items-center text-sm">
            <div className="w-fit flex items-center gap-2">
              <Input
                label="Remeber Me"
                name="remember-me"
                type={"checkbox"}
                className="accent-primary cursor-pointer"
                labelClassName="text-muted-foreground order-1 cursor-pointer"
              />
            </div>

            <Link
              to={"/forgot-password"}
              className="font-semibold text-accent hover:underline cursor-pointer transition"
            >
              Forgot Password?
            </Link>
          </fieldset>

          <Button
            type="submit"
            variant="primary"
            isDisabled={!isValid}
            className="w-full py-3 text-sm font-semibold disabled:opacity-20 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            Login
          </Button>
        </form>

        <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground my-8">
          <hr className="w-16" />
          <p>or continue with </p>
          <hr className="w-16" />
        </div>

        <Button
          onClick={() => console.log("Signup with google")}
          type="button"
          variant="outline"
          className="flex justify-center items-center gap-4 w-full py-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
        >
          <FaGoogle />
          <span className="text-sm font-semibold">Google</span>
        </Button>

        <p className="text-sm text-center mt-8">
          New to SkillForge?{" "}
          <Link
            to={"/signup/step-1"}
            className="font-semibold text-accent hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="max-tablet:hidden px-8 grow bg-gradient-to-br from-primary/15 to-primary/0 flex flex-col justify-center items-center gap-8"
      >
        <div className="w-24 h-24 rounded-full bg-primary/20 flex justify-center items-center animate-spin-scale">
          <div className="w-16 h-16 rounded-full bg-primary/30 flex justify-center items-center">
            <div className="w-8 h-8 rounded-full bg-primary/50"></div>
          </div>
        </div>

        <h3 className="text-xl font-semibold">Learn, Teach, Collaborate</h3>

        <p className="text-center text-muted-foreground">
          Join thousands of learners and mentors building skills together on
          SkillForge.
        </p>
      </motion.section>
    </motion.main>
  );
};

export default Login;
