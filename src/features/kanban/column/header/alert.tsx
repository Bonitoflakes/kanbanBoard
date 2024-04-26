import { ReactNode } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useDeleteColumnMutation } from "@/store/api";

type AlertProps = {
  children: ReactNode;
  open: boolean;
  onChange: (e: boolean) => void;
  id: number;
};

export const Alert = ({ children, open, onChange,id }: AlertProps) => {
    const [deleteColumn] = useDeleteColumnMutation()
  return (
    <AlertDialog.Root open={open} onOpenChange={onChange}>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-primary/70" />

        <AlertDialog.Content className=" fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-gray-100 p-6 focus:outline-none  dark:bg-gray-950">

          <AlertDialog.Title className="m-0 text-base font-medium text-secondary">
            Are you absolutely sure?
          </AlertDialog.Title>

          <AlertDialog.Description className="mb-5 mt-4 text-sm leading-normal text-secondary">
            This action cannot be undone. This will permanently delete your
            column.
          </AlertDialog.Description>

          <div className="flex flex-col justify-end gap-6 sm:flex-row">
            <AlertDialog.Cancel asChild>
              <button className=" inline-flex h-[35px] items-center justify-center rounded-lg px-4 font-medium leading-none text-secondary hover:bg-secondary hover:text-primary">
                Cancel
              </button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button className=" inline-flex h-[35px] items-center justify-center rounded-lg bg-red-400 px-4 font-medium leading-none text-red-900 hover:bg-red-600 dark:text-secondary" onClick={() => deleteColumn(id)}>
                Yes, delete Column
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
