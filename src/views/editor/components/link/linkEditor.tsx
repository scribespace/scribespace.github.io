import { useMainThemeContext } from "@/mainThemeContext";
import { MainTheme } from "@/theme";
import { openURL, validateUrl } from "@utils";
import { useEffect, useMemo, useRef } from "react";
import { IconBaseProps } from "react-icons";
import "./css/link.css";

interface LinkEditorProps {
  text?: string;
  url?: string;

  onTextChange?: (text: string) => void;
  onURLChange?: (url: string) => void;
}

export function LinkEditor({
  text,
  url,
  onTextChange,
  onURLChange,
}: LinkEditorProps) {
  const { editorTheme }: MainTheme = useMainThemeContext();
  const theme = useMemo(() => {
    return editorTheme.linkTheme;
  }, [editorTheme.linkTheme]);

  const urlInput = useRef<HTMLInputElement>(null);
  const textInput = useRef<HTMLInputElement>(null);
  const currentURL = useRef<string>("");

  function openURLFromInput() {
    const url = urlInput.current?.value;
    if (url) openURL(url);
  }

  function yextChangeAccepted(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key == "Enter" && onTextChange) {
      onTextChange((e.target as HTMLInputElement).value);
      e.preventDefault();
    }
  }

  function urlChangeAccepted(e: React.KeyboardEvent<HTMLInputElement>) {
    const inputeElement = e.target as HTMLInputElement;
    if (e.key == "Enter" && onURLChange) {
      if (validateUrl(inputeElement.value)) {
        onURLChange(inputeElement.value);
        currentURL.current = inputeElement.value;
      } else {
        inputeElement.value = currentURL.current;
      }
      e.preventDefault();
    }
  }

  useEffect(() => {
    if (textInput.current && text) textInput.current.value = text;
  }, [text]);

  useEffect(() => {
    if (urlInput.current && url != undefined) {
      urlInput.current.value = url;
      currentURL.current = url;
    }
  }, [url]);

  function TextIcon(props: IconBaseProps) {
    return theme.TextIcon(props);
  }

  function LinkIcon(props: IconBaseProps) {
    return theme.LinkIcon(props);
  }

  function OpenIcon(props: IconBaseProps) {
    return theme.OpenIcon(props);
  }

  return (
    <div className={theme.editor}>
      <div className={theme.container}>
        <TextIcon className={theme.icon} />
        <input
          ref={textInput}
          type="text"
          className={theme.input}
          defaultValue={text ? text : url}
          onKeyDown={yextChangeAccepted}
        />
      </div>
      <div className={theme.container}>
        <LinkIcon className={theme.icon} />
        <input
          ref={urlInput}
          type="text"
          className={theme.input}
          defaultValue={url}
          onKeyDown={urlChangeAccepted}
        />
        <OpenIcon className={theme.button} onClick={openURLFromInput} />
      </div>
    </div>
  );
}
