import { ReactNode } from "react";
import { useDeleteColumnMutation } from "@/store/api";
import Alert from "@/components/alert";

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
