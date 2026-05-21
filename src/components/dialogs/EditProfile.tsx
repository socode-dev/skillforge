import { Camera, Check, User, X } from "lucide-react";
import Dialog from "../ui/Dialog"
import useAuthStore from "@/store/useAuthStore";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuthForm } from "@/hooks/useAuthForm";
import { profileEditSchema, type ProfileEditSchema } from "@/schemas/profileSchema";
import useProfileStore from "@/store/useProfileStore";
import { useEffect, useState, type ChangeEvent } from "react";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

const EditProfile = () => {
    const currentUser = useAuthStore(state => state.currentUser);
    const openEditModal = useProfileStore(state => state.openEditModal);
    const setOpenEditModal = useProfileStore(state => state.setOpenEditModal);
    const onSubmit = useProfileStore(state => state.onSubmitProfileEdit);
    const [avatarUploading, setAvatarUploading] = useState<boolean>(false);

    if(!currentUser) return null;

    const form = useAuthForm<ProfileEditSchema>(
        profileEditSchema, 
        "onSubmit",
        {
            fullName: currentUser?.profile.name, 
            email: currentUser?.profile.email,
            avatar: currentUser?.profile.avatar ?? "", 
            bio: currentUser?.profile.bio ?? ""
        });

    const {register, watch, handleSubmit, setValue, reset, formState: {errors, isSubmitting}} = form;

    useEffect(() => {
        if(!openEditModal.profile) return;

        reset({
            fullName: currentUser.profile.name,
            email: currentUser.profile.email,
            avatar: currentUser.profile.avatar ?? "",
            bio: currentUser.profile.bio ?? "",
        });
    }, [currentUser.profile.avatar, currentUser.profile.bio, currentUser.profile.email, currentUser.profile.name, openEditModal.profile, reset]);

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setAvatarUploading(true);
        const file = e.target.files?.[0];
        if (!file) {
            setAvatarUploading(false);
            return;
        }

        try {
            const url = await uploadToCloudinary(file);
            if (!url) {
              throw Error("Failed to generate image url.");
            }
            setValue("avatar", url);
        } finally {
            setAvatarUploading(false);
        }
      };


    if(!openEditModal.profile) return null;

    const avatar = watch("avatar");

    return (
        <Dialog>
            <div className="w-full flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Edit Profile</h2>

                <button onClick={() => setOpenEditModal("profile", false)} className="cursor-pointer">
                    <X size={20} className="text-muted-foreground"/>
                </button>
                
            </div>

            <div className="w-24 h-24 mx-auto bg-soft-primary text-primary flex justify-center items-center rounded-full mb-4">
                <User size={40} />
                {avatar && (
                <img src={avatar} alt={`${currentUser.profile.name}'s avatar`} className="w-full h-full rounded-full bg-cover"/>
                )}
            </div>
            
            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>

            <fieldset>
                <label htmlFor="profileImage" className="w-fit flex items-center gap-3 px-3 py-2 border-1 border-muted-foreground bg-muted-foregroung mx-auto rounded-radius hover:bg-accent hover:border-accent hover:text-accent-foreground transition cursor-pointer">
                    {avatarUploading ? "Uploading..." : (
                        <>
                            <Camera size={18} />
                            <span className="text-sm font-medium">{`${avatar ? "Change" : "Upload"} Photo`}</span>
                        </>
                    )}
                </label>
                <input
                    type="file"
                    id="profileImage"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleAvatarChange}
                />
            </fieldset>


                <fieldset className="flex flex-col gap-1 mb-4">
                    <div className="flex flex-col gap-2">
                    <Input {...register("fullName")} type="text" label="Full Name *" name="fullName" className="p-2 bg-muted" labelClassName="text-foreground/80" />
                    </div>

                    {errors.fullName && (
                        <p className="text-xs text-destructive">{errors.fullName.message}</p>
                    )}
                </fieldset>

                <fieldset className="flex flex-col gap-1 mb-4">
                    <div className="flex flex-col gap-2">
                    <Input {...register("email")} type="email" label="Email *" name="email" className="p-2 bg-muted" labelClassName="text-foreground/80" />
                    </div>

                    {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                </fieldset>

                <fieldset className="flex flex-col gap-2 mb-6">
                    <div className="flex flex-col gap-2">
                    <label htmlFor="bio" className="text-sm text-foreground/80">Bio</label>
                    <textarea {...register("bio")} id="bio" className="h-24 p-2 bg-muted rounded-radius-xl text-foreground text-base border-1 border-border outline-none focus:border-2 focus:border-primary/80 focus:shadow shadow-soft-primary transition resize-none" />
                    </div>

                    {errors.bio && (
                        <p className="text-xs text-destructive">{errors.bio.message}</p>
                    )}
                </fieldset>

                <fieldset className="grid grid-cols-2 gap-2"> 
                <Button type="submit" variant="primary" isDisabled={isSubmitting} className="flex items-center justify-center gap-3">
                    {isSubmitting ? "Saving..." : (
                        <>
                            <Check size={20} />
                            <span className="text-sm">Save Changes</span>
                        </>
                    )}
                </Button>

                <Button type="button" variant="outline" onClick={() => setOpenEditModal("profile", false)} children="Cancel" />
                </fieldset>
            </form>
        </Dialog>
    )
}

export default EditProfile;
