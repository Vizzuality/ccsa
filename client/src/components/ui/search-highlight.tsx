"use client";

type SearchHighlightProps = {
  query?: string;
  children?: string;
};

const SearchHighlight = ({ children, query }: SearchHighlightProps) => {
  if (typeof children !== "string") return;

  if (!query) {
    return children;
  }
  const regex = new RegExp(`(${query})`, "gi");
  const parts = children.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <span className="rounded bg-brand1/50" key={i}>
        {part}
      </span>
    ) : (
      part
    ),
  );
};

export default SearchHighlight;
