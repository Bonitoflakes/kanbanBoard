import { useRef, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  Edge,
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import invariant from "tiny-invariant";

import {
  useDeleteTaskMutation,
  useGetPlaceholderQuery,
  useUpdateTaskMutation,
  usePrefetch,
} from "./card.api";

import { CardOptions } from "@/features/kanban/card/cardOptions";
import moveCaretToEnd from "@/utils/moveCaret";
import { cn } from "@/utils/cn";
import { useToggle } from "@/utils/useToggle";
import { IoCheckbox } from "react-icons/io5";
import { RiFlagFill } from "react-icons/ri";

type CardProps = {
  id: number;
  title: string;
  column: string;
  order: number;
};

const Card = ({ id, title, column, order }: CardProps) => {
  const [editing, toggleEditing] = useToggle();
  const contentEditableRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const { data: placeholder } = useGetPlaceholderQuery(id);
  const [imageSrc, setImageSrc] = useState("");

  const prefetchCard = usePrefetch("getTask");

  const cardData = useMemo(
    () => ({
      type: "card",
      id,
      title,
      order,
      column,
    }),
    [id, order, title, column],
  );

  useEffect(() => {
    const el = cardRef.current;
    invariant(el);

    return combine(
      draggable({
        element: el,
        getInitialData: () => cardData,
      }),

      dropTargetForElements({
        element: el,
        canDrop: ({ source }) => {
          if (source.data.type === "card") return true;
          return false;
        },
        getData: (args) => {
          const result = attachClosestEdge(cardData, {
            element: el,
            input: args.input,
            allowedEdges: ["top", "bottom"],
          });

          return result;
        },
        onDrag({ self, source }) {
          if (source.data.type === "column") {
            setClosestEdge(null);
            return;
          }

          const isSource = source.element === el;
          if (isSource) {
            setClosestEdge(null);
            return;
          }

          const closestEdge = extractClosestEdge(self.data);
          const sourceOrder = source.data.order as number;

          const isItemBeforeSource = order === sourceOrder - 1;
          const isItemAfterSource = order === sourceOrder + 1;

          // Don't show the drop indicator if the item is before the source
          // or after the source (i.e. the edge is near the source)

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === "bottom") ||
            (isItemAfterSource && closestEdge === "top");

          const isSameLane = source.data.column === column;

          if (isDropIndicatorHidden && isSameLane) {
            setClosestEdge(null);
            return;
          }

          setClosestEdge(closestEdge);
        },
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop() {
          setClosestEdge(null);
        },
      }),
    );
  }, [cardData, order, column]);

  useEffect(() => {
    if (placeholder) {
      setImageSrc(placeholder.url);
    }
  }, [placeholder]);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleEditing();

    requestAnimationFrame(() => {
      invariant(contentEditableRef.current);
      moveCaretToEnd(contentEditableRef.current);
    });
  };

  const handleSave = (e: React.FocusEvent) => {
    e.stopPropagation();

    toggleEditing();
    updateTask({
      id: id,
      title: String((e.target as HTMLDivElement).innerText).trim(),
      column: column,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTask(id);
  };

  const openSidePeek = () => {
    if (editing) return;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("selectedCard", id.toString());
    setSearchParams(newSearchParams);
  };

  return (
    <div
      className="group/card relative rounded-md"
      onClick={openSidePeek}
      onMouseEnter={() => prefetchCard(id)}
      data-type="card"
      ref={cardRef}
    >
      <div className="cursor-pointer rounded-md bg-accent-2 p-2 transition-colors hover:bg-accent-1/35">
        <div
          className={cn(
            "mb-2 w-full break-all rounded-md border-0 p-1 text-start text-sm font-semibold text-secondary outline-none empty:before:text-neutral-400 empty:before:content-['Untitled...'] active:cursor-grabbing dark:empty:before:text-neutral-400",
            editing && "cursor-auto",
            editing && "outline-accent-1",
            // import.meta.env.DEV && "customOrderDebugger",
          )}
          contentEditable={editing}
          data-order={order}
          suppressContentEditableWarning={true}
          ref={contentEditableRef}
          onBlur={handleSave}
        >
          {title}
        </div>

        <p className="w-fit max-w-[230px] overflow-hidden text-ellipsis whitespace-nowrap text-nowrap rounded-md bg-accent-1 px-1 text-[12px] text-primary">
          {placeholder?.title}
        </p>

        <div className="flex items-center gap-2 py-2">
          <p className="rounded-full bg-secondary/65 px-1 text-[12px] leading-[1.3] text-primary">
            {placeholder?.albumId}
          </p>

          <div className="dots flex gap-[2px] ">
            {Array.from({ length: placeholder?.albumId || 0 }, (_, idx) => (
              <div key={idx} className="dot h-2 w-2 rounded-full bg-accent-1" />
            ))}
          </div>

          {placeholder && <RiFlagFill color="red" size={16} />}
        </div>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-1">
            <IoCheckbox color="black" size={16} />
            <h3 className="text-sm text-secondary">ID-{id}</h3>
          </div>

          {/* <PiUserCircleFill color="black" size={28} /> */}

          <img
            loading="lazy"
            src={
              imageSrc ||
              "https://th.bing.com/th/id/R.fa0ca630a6a3de8e33e03a009e406acd?rik=UOMXfynJ2FEiVw&riu=http%3a%2f%2fwww.clker.com%2fcliparts%2ff%2fa%2f0%2fc%2f1434020125875430376profile.png&ehk=73x7A%2fh2HgYZLT1q7b6vWMXl86IjYeDhub59EZ8hF14%3d&risl=&pid=ImgRaw&r=0"
            }
            width={28}
            height={28}
            className="rounded-full"
            alt="Profile"
          />
        </div>

        {!editing && (
          <CardOptions handleEdit={handleEdit} handleDelete={handleDelete} />
        )}
      </div>
      {closestEdge && <DropIndicator edge={closestEdge} gap="4px" />}
    </div>
  );
};

export default Card;
