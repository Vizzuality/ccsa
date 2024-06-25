import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

const RichTextEditor = ({
  placeholder,
  className,
  value,
  onChange,
}: {
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || "Start typings...",
      content: value,
      direction: "ltr",
      toolbarAdaptive: false,
      toolbarButtonSize: "small",
      removeButtons: [
        "insert",
        "source",
        "about",
        "print",
        "about",
        "dots",
        "image",
        "eraser",
        "strikethrough",
        "file",
        "ul",
        "font",
        "fontsize",
        "ol",
        "li",
        "indent",
        "lineHeight",
        "table",
        "special",
        "outdent",
        "symbols",
        "left",
        "line",
        "speechRecognize",
        "fullsize",
        "print",
        "translations",
        "paragraph",
        "video",
        "brush",
        "align",
        "selectAll",
        "hr",
        "ai-commands",
        "ai-assistant",
        "spellChecker",
      ], // more options: https://xdsoft.net/jodit/play.html?currentTab=Buttons
      buttons: ["bold", "italic", "underline", "|", "|", "link", "|", "undo", "redo", "preview"],
    }),
    [placeholder],
  );

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      className={className}
      tabIndex={1} // tabIndex of textarea
      onChange={onChange}
    />
  );
};

export default RichTextEditor;
