import { LexicalCommand, createCommand } from "lexical";


export const PAGE_BREAK_INSERT_COMMAND: LexicalCommand<undefined> = createCommand();
export const PAGE_BREAK_CAN_INSERT_COMMAND: LexicalCommand<boolean> = createCommand();
