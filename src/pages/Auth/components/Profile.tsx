import { Upload, User } from "lucide-react";
import Heading from "./Heading";
import Button from "../../../components/ui/Button";
import { motion } from "framer-motion";
import useMultiStepsStore from "../../../store/useMultiStepsStore";
import { ScrollToTop } from "../../../Layouts/ScrollToTop";
import { useAuthForm } from "../../../hooks/useAuthForm";
import {
  profileSchema,
  type ProfileSchema,
} from "../../../schemas/profileSchema";
import clsx from "clsx";
import { useState, type ChangeEvent } from "react";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";
import useAuthStore from "../../../store/useAuthStore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const Profile = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const currentUser = useAuthStore((state) => state.currentUser);
  const previousPage = useMultiStepsStore((state) => state.previousPage);
  const nextPage = useMultiStepsStore((state) => state.nextPage);

  const form = useAuthForm<ProfileSchema>(profileSchema, "onChange");

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const avatar = watch("avatar");

  const bio = watch("bio") as string;

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadToCloudinary(file);
    if (!url) {
      throw Error("Failed to generate image url.");
    }
    setValue("avatar", url);
    setUploading(false);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!currentUser) return;

    setCurrentUser({
      ...currentUser,
      profile: {
        ...currentUser.profile,
        avatar: data.avatar ?? "",
        bio: data.bio ?? "",
        signupStepsCompleted: currentUser.profile.signupStepsCompleted + 1,
      },
    });

    updateDoc(doc(db, "users", currentUser.profile.userId), {
      avatar: data.avatar ?? "",
      bio: data.bio ?? "",
      signupStepsCompleted: 3,
    });

    nextPage();
  });

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-auto"
    >
      <ScrollToTop />
      <Heading
        icon={User}
        heading="Set Up Your Profile"
        desc="Help others get to know you better. Add a photo and share a bit about yourself."
      />

      <div className="space-y-2">
        <p className="text-sm font-semibold">Profile Picture</p>

        <div className="flex max-small:flex-col gap-6">
          <div className="w-30 aspect-square p-1 border-border border-2 rounded-full shadow-lg">
            <div className="w-full h-full flex justify-center items-center rounded-full bg-soft-primary text-primary/50">
              {!avatar && <User size={40} />}

              {avatar && (
                <img
                  src={avatar}
                  alt="Display photo"
                  className="m-1 background-center w-full h-full rounded-full"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="">
              <label
                htmlFor="profileImage"
                className="w-fit flex items-center gap-3 p-3 border-border border-1 bg-background hover:bg-accent/90 hover:text-primary-foreground font-semibold text-sm rounded-radius cursor-pointer transition"
              >
                <Upload size={18} />

                <span>
                  {uploading
                    ? "Uploading..."
                    : `${avatar ? "Change" : "Upload"} Photo`}
                </span>
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleChange}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              JGP, JPEG, PNG or GIF. Max size 5mb. Optional but recommended.
            </p>
            {errors.avatar && (
              <p className="text-destructive text-xs">
                {errors.avatar.message}
              </p>
            )}
          </div>
        </div>

        <fieldset className="flex flex-col gap-2 mt-8">
          <label htmlFor="bio" className="text-sm font-semibold">
            Bio (Optional)
          </label>
          <textarea
            {...register("bio")}
            name="bio"
            id="bio"
            placeholder="Tell us about yourself..."
            className="w-full h-36 py-2 px-3 border-1 border-border outline-none focus:border-2 focus:border-primary/80 focus:shadow shadow-soft-primary rounded-radius resize-none"
          />
          <p
            className={clsx(
              "text-xs",
              bio?.length > 500 ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {bio?.length}/500
          </p>
        </fieldset>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-8">
        <Button
          variant="outline"
          type="button"
          onClick={previousPage}
          className="py-3 text-sm font-semibold"
        >
          Back
        </Button>
        <Button
          variant="primary"
          type="button"
          isDisabled={isSubmitting}
          onClick={onSubmit}
          className="py-3 text-sm font-semibold disabled:opacity-20 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : "Next"}
        </Button>
      </div>
    </motion.div>
  );
};

export default Profile;
