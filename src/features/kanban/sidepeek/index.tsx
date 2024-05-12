import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { VscEyeClosed } from "react-icons/vsc";
import invariant from "tiny-invariant";
import Settings from "./settings";
import { useGetTaskQuery, useUpdateTaskMutation } from "../card/card.api";

function SidePeek({
  toggleSidepeek,
}: Readonly<{ toggleSidepeek: () => void }>) {
  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCard = Number(searchParams.get("selectedCard")); //TODO: Hanlde edge cases --> string or NAN

  const { data, isLoading, isError, error } = useGetTaskQuery(selectedCard);

  const [updateTask] = useUpdateTaskMutation();

  const handleBlur = () => {
    invariant(titleRef.current, "title is missing");
    invariant(descRef.current, "description is missing");

    const title: string = titleRef.current.innerText;
    const description: string = descRef.current.innerText;

    updateTask({
      id: selectedCard,
      title,
      description,
    });
  };

  const handleClose = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("selectedCard");
    setSearchParams(newSearchParams);

    toggleSidepeek();
  }, [toggleSidepeek, searchParams, setSearchParams]);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleKeyboard);

    return () => document.removeEventListener("keydown", handleKeyboard);
  }, [handleClose]);

  // TODO: Better strategy for these states.
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;
  if (!data || isNaN(selectedCard))
    return (
      <div className="p-3">
        <button
          className="rounded-md p-1.5 hover:bg-gray-100"
          onClick={handleClose}
        >
          <VscEyeClosed size={18} className="text-gray-500" />
        </button>

        <p>This is not a valid card. Please go back to the board.</p>
      </div>
    );

  return (
    <div className="flex flex-col p-3">
      <div className="px-1">
        <button
          className="rounded-md p-1.5 hover:bg-gray-100"
          onClick={handleClose}
        >
          <VscEyeClosed size={18} className="text-gray-500" />
        </button>

        <Settings {...data} />
      </div>

      <div className="p-8">
        <h1
          className="text-4xl font-bold leading-tight outline-none before:text-neutral-400  empty:before:content-['Untitled']"
          contentEditable
          suppressContentEditableWarning
          ref={titleRef}
          onBlur={handleBlur}
          role="textbox"
        >
          {data.title}
        </h1>

        <p
          className="pt-6 text-base leading-none outline-none before:text-neutral-400  empty:before:content-['Type_some_description']"
          contentEditable
          suppressContentEditableWarning
          ref={descRef}
          onBlur={handleBlur}
          role="textbox"
        >
          {data.description}
        </p>
      </div>
    </div>
  );
}

export default SidePeek;
