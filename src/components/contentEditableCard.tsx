function ContentEditableCard(props) {
  const { editing, color, title, handleSave, contentEditableRef } = props;

  const cursorType = editing ? "cursor-auto" : "cursor-grab";

  return (
    <div
      className={`${color} ${cursorType} active:cursor-grabbing text-sm w-full py-3 px-2 hover:bg-opacity-50 transition-colors rounded-md font-semibold text-start empty:before:content-["Untitled..."] empty:before:text-neutral-400 `}
      contentEditable={editing}
      suppressContentEditableWarning={true}
      ref={contentEditableRef}
      onBlur={handleSave}
    >
      {title}
    </div>
  );
}

export default ContentEditableCard;
