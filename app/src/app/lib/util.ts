// utils.ts
export function mergeClassNames(
  ...classes: (string | undefined | null | false)[]
) {
  return classes.filter(Boolean).join(" ");
}
