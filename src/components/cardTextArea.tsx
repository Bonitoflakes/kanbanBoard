function CardTextArea(props) {
  const { handleSubmit, value, setValue, columnColors } = props;
  return (
    <textarea
      onBlur={handleSubmit}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      autoFocus
      placeholder="Add new task..."
      className={`
    ${columnColors.bg} 
    ${columnColors.border}
    placeholder-slate-200 w-full rounded border mt-2 p-3 text-sm text-neutral-50  focus:outline-0 resize-none contentEditable`}
    />
  );
}

export default CardTextArea;
