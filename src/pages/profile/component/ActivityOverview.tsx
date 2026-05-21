import ActivityCard from "@/pages/profile/component/ActivityCard";
import useChatStore from "@/store/useChatStore";
import useRequestsStore from "@/store/useRequestsStore";
import { ArrowLeftRight, CircleCheck, MessageCircle } from "lucide-react";

const ActivityOverview = () => {
    const lastMessage =  useChatStore(state => state.lastMessages);
    const skillRequests = useRequestsStore(state => state.skillRequests);

    const chatCount = Object.keys(lastMessage)?.length ?? 0;
    
    const pendingRequestCount = skillRequests.filter(
        request => request.status === "PENDING"
    ).length;

    const completedRequestCount = skillRequests.filter(
        request => request.status === "COMPLETED"
    ).length;


    return (
        <section className="p-6 border border-border rounded-radius-xl shadow space-y-6">
            <fieldset className="space-y-0.5">
                <h3 className="font-medium text-lg">Activity Overview</h3>
                <p className="text-xs text-muted-foreground">Your current engagement on SkillForge</p>
            </fieldset>

            <fieldset className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ActivityCard icon={MessageCircle} count={chatCount} label="Active Chats" borderColorOnHover="hover:border-accent" iconStyle="bg-accent/10 text-accent" />

                <ActivityCard icon={ArrowLeftRight} count={pendingRequestCount} label="Pending Requests" borderColorOnHover="hover:border-amber-500" iconStyle="bg-soft-amber/70 text-amber-500" />

                <ActivityCard icon={CircleCheck} count={completedRequestCount} label="Completed" borderColorOnHover="hover:border-primary" iconStyle="bg-soft-primary text-primary" />
            </fieldset>
            
        </section>
    )
}

export default ActivityOverview;
