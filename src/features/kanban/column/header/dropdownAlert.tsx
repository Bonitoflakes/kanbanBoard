import { ReactNode } from "react";
import Alert from "@/components/alert";
import { useDeleteColumnMutation } from "../column.api";

type AlertProps = {
  children: ReactNode;
  open: boolean;
  onChange: (e: boolean) => void;
  id: number;
};

export const DropdownAlert = ({ children, open, onChange, id }: AlertProps) => {
  const [deleteColumn] = useDeleteColumnMutation();
  const handleClick = () => deleteColumn(id);

  return (
    <Alert handleClick={handleClick} open={open} onChange={onChange}>
      {children}
    </Alert>
  );
};
