import { useMainThemeContext } from "@/mainThemeContext";
import { $registerCommandListener } from "@systems/commandsManager/commandsManager";
import { NOTES_CONVERTING_CMD, NOTES_CREATING_META_CMD, NOTES_FINISH_CONVERTING_CMD } from "@systems/notesManager/notesCommands";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog } from "../dialog/dialog";

function NotesConvert() {
    const {commonTheme: {notesConvertTheme}} = useMainThemeContext();
    const [id, setID] = useState<number>(0);
    const max = useRef<number>(0);

    useEffect(
        () => {
            return $registerCommandListener(
                NOTES_CONVERTING_CMD,
                (convertInfo) => {
                    max.current = convertInfo.max;
                    setID(convertInfo.id);
                }
            );
        },
        []
    );

    const text = useMemo(
        () => {
            let emptySpace = '';
            if ( max.current > 0 ) {
                const digitSpacesCount = max.current.toString().length - id.toString().length;
                for ( let i = 0; i < digitSpacesCount; ++i )
                    emptySpace += ' ';
            }
            return max.current > 0 ? `Converting Note: ${emptySpace}${id}/${max.current}` : 'Collecting Notes...';
        },
        [id]
    );

    return (
        <div className={notesConvertTheme}>
            <span>{text}</span> 
        </div>
    );
}

export function NotesConvertDialog() {
    return (
        <Dialog commandOpen={NOTES_CREATING_META_CMD} commandClose={NOTES_FINISH_CONVERTING_CMD}>
            <NotesConvert/>
        </Dialog>
    );
}