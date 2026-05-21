import useAuthStore from "@/store/useAuthStore";
import { User } from "lucide-react";

const AvatarDisplay = () => {
    const currentUser = useAuthStore(state => state.currentUser);

    return (
        <fieldset className="w-24 h-24 bg-soft-primary text-primary flex justify-center items-center border-4 border-border rounded-full">
            <User size={45} />
            {(currentUser && currentUser.profile.avatar) && (
            <img src={currentUser.profile.avatar} alt={`${currentUser.profile.name}'s avatar`} className="w-full h-full rounded-full bg-cover"/>
            )}
        </fieldset>
    )
}

export default AvatarDisplay;