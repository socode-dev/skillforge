import useAuthStore from "@/store/useAuthStore";
import useProfileStore from "@/store/useProfileStore";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";

const Progress = () => {
    const currentUser = useAuthStore(state => state.currentUser);
    const skills = useProfileStore(state => state.skills);

    const completionItems = [
        { label: "Add your name", complete: !!currentUser?.profile.name?.trim() },
        { label: "Add your email", complete: !!currentUser?.profile.email?.trim() },
        { label: "Choose your role", complete: !!currentUser?.profile.role?.trim() },
        { label: "Add a short bio", complete: !!currentUser?.profile.bio?.trim() },
        { label: "Upload a profile photo", complete: !!currentUser?.profile.avatar?.trim() },
        { label: "Add at least one skill", complete: skills.length > 0 },
    ];

    const completedItems = useMemo(() => completionItems.filter(item => item.complete).length, [completionItems]);
    const progress = Math.round((completedItems / completionItems.length) * 100);
    const missingItems = useMemo(() => completionItems.filter(item => !item.complete), [completionItems]);

    if(progress >= 100) return null;
    
    return (
        <section className="w-full flex gap-4 p-4 rounded-radius-xl border border-primary/40 bg-soft-primary/50">
            <div className="w-fit h-fit p-2.5 rounded-radius bg-soft-primary text-primary"><TrendingUp size={20} /></div>

            <fieldset className="space-y-3 grow">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium">Profile {progress}% Complete</h3>

                    <p className="py-1.5 px-2.5 bg-soft-primary text-primary text-xs rounded-md">{progress}%</p>
                </div>

                <div className="h-2 w-full rounded-full bg-muted-foreground/20">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                
                <div>
                    <h4 className="text-xs text-muted-foreground">{missingItems.length ? "Complete your profile:" : "Your profile is complete."}</h4>
                    
                    {!!missingItems.length && (
                        <ul>
                            {missingItems.map(item => (
                                <li key={item.label} className="text-xs text-muted-foreground"><span className="mr-1 text-primary">&bull;</span> {item.label}</li>
                            ))}
                        </ul>
                    )}
                </div>
                
            </fieldset>
        </section>
    )
}

export default Progress;
