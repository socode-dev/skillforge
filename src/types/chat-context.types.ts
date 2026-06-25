import type { FormState, UseFormHandleSubmit, UseFormRegister, UseFormReset } from "react-hook-form";
import type { LastMessage } from "@/types/message.types";
import type { ChatInputShema } from "@/schemas/chatInputSchema";

export interface ChatContextState {
    slug?: string;
    chatId?: string;
    lastMessage?: LastMessage;
    register: UseFormRegister<ChatInputShema>;
    reset: UseFormReset<ChatInputShema>;
    handleSubmit: UseFormHandleSubmit<ChatInputShema>;
    formState: FormState<ChatInputShema>;
    handleSendMessage: (e?: React.BaseSyntheticEvent) => Promise<void>;
}
