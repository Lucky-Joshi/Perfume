/**
 * XSS / injection-safe sanitization helpers.
 * Strips control characters and keeps only simple text.
 */
export function sanitizeText(input) {
  if (input == null) return '';
  return String(input)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/[<>]/g, (ch) => (ch === '<' ? '&lt;' : '&gt;'))
    .trim();
}

export function sanitizeEmail(input) {
  return String(input || '').toLowerCase().trim();
}

/** Strip HTML tags from a string. */
export function stripHtml(input) {
  return String(input || '').replace(/<[^>]*>/g, ' ');
}