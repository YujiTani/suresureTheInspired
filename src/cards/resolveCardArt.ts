// ID専用のアート解決関数。ファイル名(拡張子なし)とカードIDを大文字小文字を無視して照合する。
// import.meta.glob の結果(path→url)を受け取り、URLまたは null を返す。
export function resolveCardArt(
  artModules: Record<string, string>,
  cardId: string
): string | null {
  const normalizedId = cardId.toLowerCase();
  for (const [path, url] of Object.entries(artModules)) {
    const stem = path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '';
    if (stem.toLowerCase() === normalizedId) {
      return url;
    }
  }
  return null;
}
