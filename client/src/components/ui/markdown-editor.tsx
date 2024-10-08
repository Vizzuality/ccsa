import { forwardRef } from "react";

import dynamic from "next/dynamic";

import { MDEditorProps, commands } from "@uiw/react-md-editor";
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const MarkdownEditor = forwardRef<HTMLDivElement, MDEditorProps>((props, ref) => {
  const customCommands = [commands.bold, commands.italic, commands.link];
  return (
    <div ref={ref}>
      <MDEditor {...props} commands={customCommands} />
    </div>
  );
});

MarkdownEditor.displayName = "MarkdownEditor";

export default MarkdownEditor;
