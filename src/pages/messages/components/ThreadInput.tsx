import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useChatContext } from "@/context/useChatContext";
import { Send } from "lucide-react";

const ThreadInput = () => {
    const {register, formState, handleSendMessage, chatId} = useChatContext();

    const {isValid} = formState;

    return(
        <footer className="w-full fixed bottom-18 left-0 lg:w-5/6 lg:left-1/6 right-0 flex items-center gap-3 bg-background px-4 md:px-6 lg:px-8 py-4 border-y-1 border-border">

            <form onSubmit={handleSendMessage} className="w-full flex gap-3">
                <Input {...register("message")} type="text" placeholder="Type a message..." className="grow px-4 py-2 text-base border-border border rounded-radius outline-none" disabled={!chatId} />

                <Button type="submit" variant="primary" isDisabled={!isValid || !chatId} className="py-2"><Send size={20} /></Button>
            </form>
        </footer>
    )
}

export default ThreadInput;
