export function ctfImage(url, { width = 800, quality = 75 } = {}) {
  if (!url || !url.includes('ctfassets.net')) return url;
  return url + (url.includes('?') ? '&' : '?') + `fm=webp&w=${width}&q=${quality}`;
}
