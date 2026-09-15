import DOMPurify from "dompurify";

/**
 * Sanitize HTML to prevent XSS attacks.
 * Allows <strong>, <em>, <br />, <p>, <ul>, <ol>, <li>, <a>, <code>, <pre>, <h1-h6>.
 * Strips everything else (scripts, iframes, event handlers, etc.).
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") {
    // Server-side: strip all tags as a safety measure
    return html.replace(/<[^>]*>/g, "");
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "strong",
      "em",
      "br",
      "p",
      "ul",
      "ol",
      "li",
      "a",
      "code",
      "pre",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });
}

/**
 * Format markdown-like bold syntax and newlines, then sanitize.
 * Safe for use in dangerouslySetInnerHTML.
 */
export function formatAndSanitize(text: string): string {
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
  return sanitizeHtml(formatted);
}
