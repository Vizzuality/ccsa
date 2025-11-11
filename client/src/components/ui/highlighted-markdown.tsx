import React from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import { highlightMd } from "@/lib/utils/highlighted-text";

export function HighlightedMarkdown({ text, query }: { text: string; query: string }) {
  const processed = highlightMd(text, query);
  const schema = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames || []), "mark"],
  };

  return (
    <Markdown
      rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
      className="prose"
      components={{
        mark({ children }) {
          return <span className="rounded bg-brand1/50">{children}</span>;
        },
      }}
    >
      {processed}
    </Markdown>
  );
}
