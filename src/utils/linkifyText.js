/**
 * Converts raw URLs in text to markdown link format so that
 * ReactMarkdown can render them as clickable <a> tags.
 *
 * Handles:
 *  - https://example.com
 *  - http://example.com
 *  - www.example.com (without protocol)
 *
 * Skips URLs that are already inside markdown link syntax [text](url)
 * to avoid double-wrapping.
 *
 * @param {string} text - The raw text that may contain URLs
 * @returns {string} - Text with raw URLs wrapped in markdown link syntax
 */
const linkifyText = (text) => {
  if (!text || typeof text !== "string") return text;

  // This regex matches raw URLs that are NOT already inside markdown [text](url) syntax.
  // It uses a negative lookbehind for ]( and ( to avoid matching URLs already in markdown links.
  // Pattern breakdown:

  const urlRegex = /(?<!\]\()(?<!\()(https?:\/\/[^\s\])>]+)|(?<!\]\()(?<!\()(www\.[^\s\])>]+)/g;

  return text.replace(urlRegex, (match, fullUrl, wwwUrl) => {
    if (fullUrl) {
      // Already has protocol (http/https)
      return `[${fullUrl}](${fullUrl})`;
    }
    if (wwwUrl) {
      // www. without protocol — add https://
      return `[${wwwUrl}](https://${wwwUrl})`;
    }
    return match;
  });
};

export default linkifyText;
