import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { CardOptions } from "@/components/cardOptions";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { createRoot } from "react-dom/client";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { getIndex } from "@/utils/getIndex";
import moveCaretToEnd from "@/utils/moveCaret";
import ContentEditableCard from "@/components/contentEditableCard";
import { useAppSelector, useAppDispatch } from "@/store/store";
import {
  Task,
  selectAllTasks,
  setAllCards,
  updateCard,
  deleteCard,
} from "@/store/taskSlice";

type Card = Task & {
  color: string;
};

// Custom DragPreview
function DragPreview({ title }: { title: string }) {
  return (
    <div className="max-w-72 text-ellipsis bg-black py-1 px-2 rounded-md line-clamp-1">
      {title}
    </div>
  );
}

function Card({ id, title, column, color }: Card) {
  const [editing, setEditing] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement | null>(null);
  const draggableRef = useRef(null);

  const allTasks = useAppSelector(selectAllTasks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const el = draggableRef.current;
    invariant(el);

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({ id, origin: column }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            render({ container }) {
              const root = createRoot(container);
              root.render(<DragPreview title={title} />);
              return function cleanup() {
                root.unmount();
              };
            },
            nativeSetDragImage,
          });
        },
      }),

      dropTargetForElements({
        element: el,
        getData: () => ({
          meow: id,
          destination: column,
          title,
        }),
        onDragEnter(args) {
          console.log("is entering: ", args.self.data);
        },
        onDrop(args) {
          console.log("Card onDrop:", args);

          const destinationCardPosition = args.self.data.meow as string;
          const originCardPostion = args.source.data.id as string;

          const newList = reorder({
            list: allTasks,
            startIndex: getIndex(allTasks, originCardPostion),
            finishIndex: getIndex(allTasks, destinationCardPosition),
          });

          dispatch(setAllCards(newList));
        },
      })
    );
  }, [id, column, title, allTasks, dispatch]);

  const handleEdit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setEditing((p) => !p);

    requestAnimationFrame(() => {
      invariant(contentEditableRef.current);
      moveCaretToEnd(contentEditableRef.current);
    });
  };

  const handleSave = (e: { target: { innerText: string } }) => {
    setEditing((p) => !p);

    dispatch(
      updateCard({
        id: id,
        changes: {
          title: String(e.target.innerText).trim() || "",
          column: column,
        },
      })
    );
  };

  const handleDelete = (id: string) => {
    dispatch(deleteCard(id));
  };

  return (
    <div className="relative group/card" ref={draggableRef}>
      <ContentEditableCard
        color={color}
        title={title}
        editing={editing}
        handleSave={handleSave}
        contentEditableRef={contentEditableRef}
      />

      {!editing && (
        <CardOptions
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          id={id}
        />
      )}
    </div>
  );
}

export default Card;
