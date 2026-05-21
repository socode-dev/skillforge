import Button from "@/components/ui/Button";
import AvatarDisplay from "@/pages/profile/component/AvatarDisplay";
import useAuthStore from "@/store/useAuthStore";
import useProfileStore from "@/store/useProfileStore";
import { Coins, Edit2, Info, Mail } from "lucide-react";

const PersonalInfo = () => {
    const currentUser = useAuthStore(state => state.currentUser);
    const coinBalance = useProfileStore(state => state.coinBalance);  
    const setOpenEditModal = useProfileStore(state => state.setOpenEditModal)

    return (
        <section className="p-6 border border-border rounded-radius-xl shadow">
        <fieldset className="flex flex-col md:flex-row gap-5 mb-8">
        <AvatarDisplay />
        
        <div className="grow flex justify-between items-start gap-2">
        <div className="grow">
            <h3 className="mb-2 text-foreground text-3xl">{currentUser?.profile.name}</h3>
            <p className="text-sm text-muted-foreground">{currentUser?.profile.bio}</p>
        </div>

        <Button onClick={() => setOpenEditModal("profile", true)} type="button" variant="primary" className="flex items-center gap-3 py-3">
            <Edit2 size={16} />

            <span className="max-md:hidden text-sm">Edit profile</span>
        </Button>
        </div>
        </fieldset>

        <hr className="w-11/12 border-muted mx-auto" />

        <fieldset className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2">
                <div className="p-2.5 bg-muted text-muted-foreground rounded-radius"><Mail size={20} /></div>
                
                <div className="space-y-0.5`">
                    <h4 className="text-xs text-muted-foreground">Email</h4>
                    <p className="text-sm">{currentUser?.profile.email}</p>
                </div>
            </div>

            <div className="md:w-1/2 flex items-center gap-2 p-2 border border-amber-500/20 bg-soft-orange rounded-radius">
                <div className="p-2.5 bg-soft-amber text-amber-500 rounded-radius"><Coins size={20} /></div>

                <div className="space-y-1">
                    <h4 className="text-amber-500 text-xs flex items-center gap-2"><span>SkillForge Coins</span> <Info size={15} /></h4>
                    <p className="text-2xl text-amber-500/80">{coinBalance}</p>
                    <p className="text-xs text-amber-700">Earned from completed exchanges</p>
                </div>
            </div>
        </fieldset>
        </section>
    )
}

export default PersonalInfo;