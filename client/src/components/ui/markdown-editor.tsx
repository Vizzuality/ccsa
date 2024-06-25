import dynamic from "next/dynamic";

import { MDEditorProps } from "@uiw/react-md-editor";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function MarkdownEditor(props: MDEditorProps) {
  return <MDEditor {...props} />;
}
