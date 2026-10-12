/** `tags` is an array in current documents and a comma-separated string in
 *  legacy ones. Either way, a clean list. */
export function toTagArray(
  tags: string | string[] | undefined | null
): string[] {
  const list = Array.isArray(tags) ? tags : (tags ?? "").split(/[,·]/);
  return list.map((tag) => tag.trim()).filter(Boolean);
}
