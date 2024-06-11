import { LexicalCommand, createCommand } from "lexical";


export const INSERT_PAGE_BREAK: LexicalCommand<undefined> = createCommand();
export const CAN_INSERT_PAGE_BREAK: LexicalCommand<boolean> = createCommand();
