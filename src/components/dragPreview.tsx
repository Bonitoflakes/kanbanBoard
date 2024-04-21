export function DragPreview({ title }: { title: string }) {
  return (
    <div className="line-clamp-1 max-w-72 text-ellipsis rounded-md bg-black px-2 py-1">
      {title}
    </div>
  );
}
