import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/connections/useOptimisticConnections";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Connection, insertConnectionParams } from "@/lib/db/schema/connections";
import {
  createConnectionAction,
  deleteConnectionAction,
  updateConnectionAction,
} from "@/lib/actions/connections";
import { type User, type UserId } from "@/lib/db/schema/users";

const ConnectionForm = ({
  users,
  userId,
  connection,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  connection?: Connection | null;
  users: User[];
  userId?: UserId
  openModal?: (connection?: Connection) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Connection>(insertConnectionParams);
  const editing = !!connection?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("connections");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Connection },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Connection ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const connectionParsed = await insertConnectionParams.safeParseAsync({ userId, ...payload });
    if (!connectionParsed.success) {
      setErrors(connectionParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = connectionParsed.data;
    const pendingConnection: Connection = {
      
      id: connection?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingConnection,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateConnectionAction({ ...values, id: connection.id })
          : await createConnectionAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingConnection 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.type ? "text-destructive" : "",
          )}
        >
          Type
        </Label>
        <Input
          type="text"
          name="type"
          className={cn(errors?.type ? "ring ring-destructive" : "")}
          defaultValue={connection?.type ?? ""}
        />
        {errors?.type ? (
          <p className="text-xs text-destructive mt-2">{errors.type[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {userId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.userId ? "text-destructive" : "",
          )}
        >
          User
        </Label>
        <Select defaultValue={connection?.userId} name="userId">
          <SelectTrigger
            className={cn(errors?.userId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
          {users?.map((user) => (
            <SelectItem key={user.id} value={user.id.toString()}>
              {user.id}{/* TODO: Replace with a field from the user model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.userId ? (
          <p className="text-xs text-destructive mt-2">{errors.userId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: connection });
              const error = await deleteConnectionAction(connection.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: connection,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default ConnectionForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
