import { LexicalCommand, createCommand } from "lexical";

export const INSERT_IMAGES_COMMAND: LexicalCommand<File[]> = createCommand("INSERT_IMAGES_COMMAND");
