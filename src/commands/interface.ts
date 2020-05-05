import { Message } from "discord.js";

export interface ChatCommand {
    name: string,
    description: string,
    execute: (message: Message, args: string[]) => void,
}