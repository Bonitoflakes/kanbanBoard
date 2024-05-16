import invariant from "tiny-invariant";

const moveCaretToEnd = (ref: HTMLDivElement) => {
  const sel = window.getSelection();
  invariant(sel);

  const range = new Range();
  invariant(range);

  range.selectNodeContents(ref);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);

  ref.focus();
};

export default moveCaretToEnd;
