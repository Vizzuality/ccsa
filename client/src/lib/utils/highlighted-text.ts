function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightMd(md: string, query?: string) {
  const stripped = md.replaceAll("@@HIGHLIGHT@@", "").replaceAll("@@END@@", "");

  if (!query?.trim()) return stripped;

  const terms = query.trim().split(/\s+/).map(escapeRegExp);
  const re = new RegExp(`(${terms.join("|")})`, "gi");

  return stripped.replace(re, "<mark>$1</mark>");
}
