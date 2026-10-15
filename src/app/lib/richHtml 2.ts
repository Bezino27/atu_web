import sanitizeHtml from "sanitize-html";

import { normalizeMediaUrl } from "./api";

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
  return sanitizeHtml(html ?? "", {
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
      a: (_tagName, attributes) => {
        const href = attributes.href;
        const normalizedAttributes = { ...attributes };

        // Keep page links, anchors, mailto and tel intact. Only media URLs
        // need rewriting; executable schemes must reach the sanitizer unchanged.
        if (href && /^(?:\/?media\/|https?:\/\/)/i.test(href)) {
          normalizedAttributes.href = normalizeMediaUrl(href, href);
        }
        if (attributes.target === "_blank") {
          normalizedAttributes.rel = "noopener noreferrer";
        }

        return { tagName: "a", attribs: normalizedAttributes };
      },
      img: (_tagName, attributes) => {
        const src = attributes.src;
        const normalizedAttributes = { ...attributes };

        if (src && (
          /^https?:\/\//i.test(src) ||
          !/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(src)
        )) {
          normalizedAttributes.src = normalizeMediaUrl(src, src);
        }

        return { tagName: "img", attribs: normalizedAttributes };
      },
    },
  });
}
