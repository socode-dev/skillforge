import { useNavigate } from "react-router-dom"
import { ArrowLeft, EllipsisVertical, User } from "lucide-react";
import { useChatContext } from "@/context/useChatContext";

const ThreadHeader = () => {
    const navigate = useNavigate();
    const {lastMessage: {senderDisplay}} = useChatContext();

    return(
        <header className="fixed top-0 left-0 lg:w-5/6 lg:left-1/6 right-0 flex items-center gap-4 px-4 md:px-6 lg:px-8 py-3 border-b-1 border-border bg-background">
                <button type="button" onClick={() => navigate(-1)} className="hover:bg-muted p-1 rounded-full transition cursor-pointer"><ArrowLeft size={18} /></button>

                <button type="button" className="flex items-center gap-4 grow cursor-pointer">
                    
                    <div className="relative min-w-9 max-w-9 h-9 bg-primary text-primary-foreground rounded-full flex justify-center items-center">
                    {senderDisplay?.avatar ? ( 
                    <img src={senderDisplay?.avatar} alt={`${senderDisplay?.name}'s avatar`} aria-label={`${senderDisplay.name}'s avatar`} className="w-full h-full rounded-full"/> 
                    ) : (
                    <User size={15} />
                    )}
                    <span className="w-2.5 h-2.5 absolute bottom-0.5 -right-0.5 bg-green-500 rounded-full border-2 border-background"></span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{senderDisplay?.name}</p>
                        <p className="text-xs text-muted-foreground text-left">Online</p>
                    </div>
                </button>

                <button type="button" className="hover:bg-muted p-1 rounded-full transition cursor-pointer"><EllipsisVertical size={18} /></button>
            </header>
    )
}

export default ThreadHeader;