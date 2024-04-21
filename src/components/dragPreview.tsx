export function DragPreview({ title }: { title: string }) {
  return (
    <div className="max-w-72 text-ellipsis bg-black py-1 px-2 rounded-md line-clamp-1">
      {title}
    </div>
  );
}
