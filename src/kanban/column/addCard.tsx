import { useState } from "react";
import { ColumnType, TextAreaColors } from "../colors";
import CardTextArea from "@/components/cardTextArea";
import { useAppDispatch } from "@/store/store";
import { addCard } from "@/store/taskSlice";

type AddCardProps = {
  column: string;
  adding: boolean;
  toggleAdding: () => void;
};

export function AddCard({ adding, toggleAdding, column }: AddCardProps) {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState("");
  const columnColors = TextAreaColors[column as ColumnType];

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    dispatch(
      addCard({
        title: value.trim() || "",
        column,
        id: Math.random().toString(),
      })
    );
    setValue("");
    toggleAdding();
  };

  return (
    <>
      {adding && (
        <CardTextArea
          value={value}
          setValue={setValue}
          handleSubmit={handleSubmit}
          columnColors={columnColors}
        />
      )}
    </>
  );
}
