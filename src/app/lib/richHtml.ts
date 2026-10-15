import sanitizeHtml from "sanitize-html";

import { normalizeHtmlMediaUrls } from "./api";

const SAFE_RICH_TEXT_TAGS = [
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
];

export function prepareBackendRichHtml(html?: string | null) {
  const normalizedHtml = normalizeHtmlMediaUrls(html);

  return sanitizeHtml(normalizedHtml, {
    allowedTags: SAFE_RICH_TEXT_TAGS,
    allowedAttributes: {
      "*": ["class"],
      a: ["href", "name", "rel", "target", "title"],
      img: [
        "alt",
        "class",
        "height",
        "loading",
        "src",
        "title",
        "width",
      ],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attributes) => ({
        tagName: "a",
        attribs:
          attributes.target === "_blank"
            ? { ...attributes, rel: "noopener noreferrer" }
            : attributes,
      }),
    },
  });
}
