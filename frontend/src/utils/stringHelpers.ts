export function safeInitial(value?: string, fallback = '?'): string {
  const s = value || '';
  const ch = s.charAt(0) || fallback;
  return String(ch).toUpperCase();
}

export function safeReplace(value?: string, search = '_', replace = ' '): string {
  return (value || '').replace(search, replace);
}
