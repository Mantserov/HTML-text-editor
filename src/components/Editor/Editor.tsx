import { useRef, useState } from "react";
import "./Editor.scss";
import {
  Trash2,
  Bold,
  Italic,
  Underline,
  MoveRight,
  CircleX,
} from "lucide-react";
import { TStyle, applyStyle } from "./text-style";
import parse from "html-react-parser";
import { textService } from "../../services/text.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function EmailEditor() {
  const [text, setText] = useState("");

  // Попробовать вынести в отдельный хук:
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const textRef = useRef<HTMLTextAreaElement | null>(null);

  const updateSelection = () => {
    if (!textRef.current) return;

    setSelectionStart(textRef.current.selectionStart);
    setSelectionEnd(textRef.current.selectionEnd);
  };
  // Досюдова

  const getSelectionText = (type: TStyle) => {
    const selectedText = text.slice(selectionStart, selectionEnd);

    if (!selectedText) return;

    const before = text.slice(0, selectionStart);
    const after = text.slice(selectionEnd);

    setText(before + applyStyle(type, selectedText) + after);
  };

  const { data } = useQuery({
    queryKey: ["text list"],
    queryFn: () => textService.getTexts(),
  });

  const queryClient = useQueryClient();

  const { mutate: addText, isPending } = useMutation({
    mutationKey: ["add text"],
    mutationFn: () => textService.sendText(text),
    onSuccess() {
      setText("");
      queryClient.refetchQueries();
    },
  });

  const { mutate: deleteText } = useMutation({
    mutationKey: ["delete text"],
    mutationFn: (id: number) => textService.deleteText(id),
    onSuccess() {
      queryClient.refetchQueries();
    },
  });

  return (
    <div className="editor">
      <div className="card">
        <textarea
          ref={textRef}
          className="card__editor"
          spellCheck="false"
          autoFocus
          onClick={updateSelection}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="card__actions actions">
          <div className="actions__tools">
            <button onClick={() => setText("")}>
              <Trash2 className="tool" />
            </button>
            <button onClick={() => getSelectionText("bold")}>
              <Bold className="tool" />
            </button>
            <button onClick={() => getSelectionText("italic")}>
              <Italic className="tool" />
            </button>
            <button onClick={() => getSelectionText("underline")}>
              <Underline className="tool" />
            </button>
          </div>
        </div>
      </div>
      <div className="arrow">
        <MoveRight size={100} />
      </div>
      <div className="result">
        <div className="result__text">{parse(text)}</div>
        <div className="result__actions actions">
          <button
            className="result__save"
            disabled={isPending}
            onClick={() => addText()}
          >
            Save
          </button>
        </div>
      </div>

      <div className="saved">
        <ul className="saved__list">
          {data?.map((text) => (
            <>
              <li className="saved__item" key={text.id}>
                {parse(text.text)}
                <button
                  className="saved__delete"
                  onClick={() => deleteText(text.id)}
                >
                  <CircleX size={20} />
                </button>
              </li>
            </>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EmailEditor;
