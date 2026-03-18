import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

const EmptyChatState = () => {
    const navigate = useNavigate();

    return(
        <main className="h-full flex flex-col items-center text-center px-6">
            <div className="mb-6 text-muted-foreground">
                <svg
                width="150"
                height="150"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 24 24"
                >
                    <path d="M8 10h8M8 14h5m-9 7 3-3h11a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12z" />
                </svg>
            </div>

            <h2 className="text-lg font-semibold mb-2">No conversations yet</h2>

            <p className="text-sm text-muted-foreground mb-6">When you start chatting with someone, your conversations will appear here</p>

            <Button onClick={() => navigate("/home/discover")} type="button" variant="primary">Discover People</Button>
    </main>
    )
}

export default EmptyChatState;