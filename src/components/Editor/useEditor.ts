import { useRef, useState } from "react";
import { TStyle, applyStyle } from "./text-style";

export function useEditor() {
  const [text, setText] = useState("");
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const textRef = useRef<HTMLTextAreaElement | null>(null);

  const updateSelection = () => {
    if (!textRef.current) return;

    setSelectionStart(textRef.current.selectionStart);
    setSelectionEnd(textRef.current.selectionEnd);
  };

  const getSelectionText = (type: TStyle) => {
    const selectedText = text.slice(selectionStart, selectionEnd);

    if (!selectedText) return;

    const before = text.slice(0, selectionStart);
    const after = text.slice(selectionEnd);

    setText(before + applyStyle(type, selectedText) + after);
  };

  return {
    text,
    setText,
    updateSelection,
    getSelectionText,
    textRef,
  };
}
