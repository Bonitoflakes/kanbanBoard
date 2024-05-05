import { VscEyeClosed } from "react-icons/vsc";
import { useEffect, useRef } from "react";
import { useGetTaskQuery, useUpdateTaskMutation } from "@/store/api";
import invariant from "tiny-invariant";
import Settings from "./settings";
import { useNavigate } from "react-router-dom";

function SidePeek({ id }: { id: number }) {
  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetTaskQuery(id);
  const [updateTask] = useUpdateTaskMutation();

  const handleBlur = () => {
    invariant(titleRef.current, "title is missing");
    invariant(descRef.current, "description is missing");

    const title: string = titleRef.current.innerText;
    const description: string = descRef.current.innerText;

    const changes = {
      id,
      title,
      description,
    };

    updateTask(changes);
  };

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        navigate("/");
      }
    };

    document.addEventListener("keydown", handleKeyboard);

    return () => {
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, [navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;
  if (!data) return <></>;

  return (
    <div className="flex flex-col p-3">
      <div className="px-1">
        <button
          className="rounded-md p-1.5 hover:bg-gray-100"
          onClick={() => navigate("/")}
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
        >
          {data.title}
        </h1>
        <p
          className="pt-6 text-base leading-none outline-none before:text-neutral-400  empty:before:content-['Type_some_description']"
          contentEditable
          suppressContentEditableWarning
          ref={descRef}
          onBlur={handleBlur}
        >
          {data.description}
        </p>
      </div>
    </div>
  );
}

export default SidePeek;
