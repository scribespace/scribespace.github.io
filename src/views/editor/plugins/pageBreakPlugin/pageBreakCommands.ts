import { LexicalCommand, createCommand } from "lexical";


export const INSERT_PAGE_BREAK_COMMAND: LexicalCommand<undefined> = createCommand();
export const CAN_INSERT_PAGE_BREAK_COMMAND: LexicalCommand<boolean> = createCommand();
