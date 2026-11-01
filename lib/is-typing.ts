/** True when a text field (or anything editable) has the focus, so key shortcuts should stand down. */
export function isTyping(target: EventTarget | null): boolean {
  const candidates = [target, document.activeElement];
  return candidates.some(
    (n) =>
      n instanceof HTMLElement &&
      (n.isContentEditable ||
        /^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName) ||
        n.getAttribute("role") === "textbox")
  );
}
