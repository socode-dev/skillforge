import { useState } from "react";
import { Mail, User, Lock, Eye, EyeOff, type LucideIcon } from "lucide-react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Heading from "./Heading";
import { motion } from "framer-motion";
import { useAuthForm } from "../../../hooks/useAuthForm";
import { accountSchema } from "../../../schemas/accountSchema";
import useAuthStore from "../../../store/useAuthStore";

const Account = () => {
  const onSignup = useAuthStore((state) => state.onSignup);
  const [revealPassword, setRevealPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const form = useAuthForm(accountSchema, "onChange", {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = form;

  const pascalCase = (str: string): string => {
    if (str === "") return "";

    const splitStr = str.split(" ");
    const transform = splitStr.map(
      (s) => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase()
    );

    return transform.join(" ");
  };

  const onSubmit = handleSubmit((data) => {
    if (!isValid) return;

    const userName = pascalCase(data.fullName);

    onSignup(data.email, data.password, userName, reset);
  });

  const RevealPasswordIcon: LucideIcon = revealPassword.password ? EyeOff : Eye;
  const RevealConfirmPasswordIcon: LucideIcon = revealPassword.confirmPassword
    ? EyeOff
    : Eye;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-auto"
    >
      <Heading
        icon={User}
        heading="Create You Account"
        desc="Join SkillForge to start learning and teaching. Let's get started
            with the basics."
      />

      <div className="space-y-5">
        {/* Full name field */}
        <fieldset className="space-y-1">
          <div className="relative flex flex-col gap-2">
            <Input
              {...register("fullName")}
              label={"Full Name"}
              name={"fullName"}
              type={"text"}
              placeholder={"John Doe"}
              className="w-full px-12 py-3"
            />
            <User
              size={20}
              className="absolute top-[45%] left-[4%] translate-y-[45%] translate-x-[2%] text-muted-foreground"
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </fieldset>

        {/* Email field */}
        <fieldset className="space-y-1">
          <div className="relative flex flex-col gap-2">
            <Input
              {...register("email")}
              label={"Email"}
              name={"email"}
              type={"email"}
              placeholder={"you@example.com"}
              className="w-full px-12 py-3"
            />
            <Mail
              size={20}
              className="absolute top-[45%] left-[4%] translate-y-[45%] translate-x-[2%] text-muted-foreground"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </fieldset>

        {/* Password & Confirm password fields */}

        <fieldset className="space-y-1">
          <div className="relative flex flex-col gap-2">
            <Input
              {...register("password")}
              label={"Password"}
              name={"password"}
              type={revealPassword.password ? "text" : "password"}
              placeholder="•••••••••"
              className="w-full px-12 py-3"
            />
            <Lock
              size={20}
              className="absolute top-[45%] left-[4%] translate-y-[45%] translate-x-[2%] text-muted-foreground"
            />

            <RevealPasswordIcon
              onClick={() =>
                setRevealPassword((prev) => ({
                  ...prev,
                  password: !prev.password,
                }))
              }
              size={20}
              className="absolute top-[45%] right-[5%] translate-y-[45%] translate-x-[5%] text-muted-foreground cursor-pointer hover:text-foreground transition"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </fieldset>
        {/* Confirm password */}
        <fieldset className="relative flex flex-col gap-2 space-y-1">
          <div className="relative flex flex-col gap-2">
            <Input
              {...register("confirmPassword")}
              label={"Confirm Password"}
              name={"confirmPassword"}
              type={revealPassword.confirmPassword ? "text" : "password"}
              placeholder="•••••••••"
              className="w-full px-12 py-3"
            />
            <Lock
              size={20}
              className="absolute top-[45%] left-[4%] translate-y-[45%] translate-x-[2%] text-muted-foreground"
            />

            <RevealConfirmPasswordIcon
              onClick={() =>
                setRevealPassword((prev) => ({
                  ...prev,
                  confirmPassword: !prev.confirmPassword,
                }))
              }
              size={20}
              className="absolute top-[45%] right-[5%] translate-y-[45%] translate-x-[5%] text-muted-foreground cursor-pointer hover:text-foreground transition"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </fieldset>

        <Button
          onClick={onSubmit}
          type="button"
          isDisabled={!isValid || isSubmitting}
          variant="primary"
          className="py-3 text-sm w-full font-semibold disabled:opacity-20 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Loading..." : "Next"}
        </Button>
      </div>
    </motion.div>
  );
};

export default Account;
