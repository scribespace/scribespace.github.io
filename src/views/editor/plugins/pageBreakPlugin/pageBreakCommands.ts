import { LexicalCommand, createCommand } from "lexical";


export const PAGE_BREAK_INSERT_COMMAND: LexicalCommand<undefined> = createCommand("PAGE_BREAK_INSERT_COMMAND");
export const PAGE_BREAK_CAN_INSERT_COMMAND: LexicalCommand<boolean> = createCommand("PAGE_BREAK_CAN_INSERT_COMMAND");
