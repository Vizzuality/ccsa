import { forwardRef } from "react";

import dynamic from "next/dynamic";

import { MDEditorProps } from "@uiw/react-md-editor";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const MarkdownEditor = forwardRef<HTMLDivElement, MDEditorProps>((props, ref) => {
  return (
    <div ref={ref}>
      <MDEditor {...props} />
    </div>
  );
});

MarkdownEditor.displayName = "MarkdownEditor";

export default MarkdownEditor;
