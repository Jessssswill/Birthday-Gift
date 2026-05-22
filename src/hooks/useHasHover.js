export function useHasHover() {
  return window.matchMedia('(hover: hover)').matches;
}
