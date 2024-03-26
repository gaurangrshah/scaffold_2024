import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/notion/useOptimisticNotions";

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

import { type Notion, insertNotionParams } from "@/lib/db/schema/notion";
import {
  createNotionAction,
  deleteNotionAction,
  updateNotionAction,
} from "@/lib/actions/notion";
import { type Connection, type ConnectionId } from "@/lib/db/schema/connections";

const NotionForm = ({
  connections,
  connectionId,
  notion,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  notion?: Notion | null;
  connections: Connection[];
  connectionId?: ConnectionId
  openModal?: (notion?: Notion) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Notion>(insertNotionParams);
  const editing = !!notion?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("notion");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Notion },
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
      toast.success(`Notion ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const notionParsed = await insertNotionParams.safeParseAsync({ connectionId, ...payload });
    if (!notionParsed.success) {
      setErrors(notionParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = notionParsed.data;
    const pendingNotion: Notion = {
      
      id: notion?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingNotion,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateNotionAction({ ...values, id: notion.id })
          : await createNotionAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingNotion 
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
            errors?.accessToken ? "text-destructive" : "",
          )}
        >
          Access Token
        </Label>
        <Input
          type="text"
          name="accessToken"
          className={cn(errors?.accessToken ? "ring ring-destructive" : "")}
          defaultValue={notion?.accessToken ?? ""}
        />
        {errors?.accessToken ? (
          <p className="text-xs text-destructive mt-2">{errors.accessToken[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.workspaceId ? "text-destructive" : "",
          )}
        >
          Workspace Id
        </Label>
        <Input
          type="text"
          name="workspaceId"
          className={cn(errors?.workspaceId ? "ring ring-destructive" : "")}
          defaultValue={notion?.workspaceId ?? ""}
        />
        {errors?.workspaceId ? (
          <p className="text-xs text-destructive mt-2">{errors.workspaceId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.databaseId ? "text-destructive" : "",
          )}
        >
          Database Id
        </Label>
        <Input
          type="text"
          name="databaseId"
          className={cn(errors?.databaseId ? "ring ring-destructive" : "")}
          defaultValue={notion?.databaseId ?? ""}
        />
        {errors?.databaseId ? (
          <p className="text-xs text-destructive mt-2">{errors.databaseId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.workspaceName ? "text-destructive" : "",
          )}
        >
          Workspace Name
        </Label>
        <Input
          type="text"
          name="workspaceName"
          className={cn(errors?.workspaceName ? "ring ring-destructive" : "")}
          defaultValue={notion?.workspaceName ?? ""}
        />
        {errors?.workspaceName ? (
          <p className="text-xs text-destructive mt-2">{errors.workspaceName[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.workspaceIcon ? "text-destructive" : "",
          )}
        >
          Workspace Icon
        </Label>
        <Input
          type="text"
          name="workspaceIcon"
          className={cn(errors?.workspaceIcon ? "ring ring-destructive" : "")}
          defaultValue={notion?.workspaceIcon ?? ""}
        />
        {errors?.workspaceIcon ? (
          <p className="text-xs text-destructive mt-2">{errors.workspaceIcon[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.remove ? "text-destructive" : "",
          )}
        >
          Remove
        </Label>
        <Input
          type="text"
          name="remove"
          className={cn(errors?.remove ? "ring ring-destructive" : "")}
          defaultValue={notion?.remove ?? ""}
        />
        {errors?.remove ? (
          <p className="text-xs text-destructive mt-2">{errors.remove[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {connectionId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.connectionId ? "text-destructive" : "",
          )}
        >
          Connection
        </Label>
        <Select defaultValue={notion?.connectionId} name="connectionId">
          <SelectTrigger
            className={cn(errors?.connectionId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a connection" />
          </SelectTrigger>
          <SelectContent>
          {connections?.map((connection) => (
            <SelectItem key={connection.id} value={connection.id.toString()}>
              {connection.id}{/* TODO: Replace with a field from the connection model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.connectionId ? (
          <p className="text-xs text-destructive mt-2">{errors.connectionId[0]}</p>
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
              addOptimistic && addOptimistic({ action: "delete", data: notion });
              const error = await deleteNotionAction(notion.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: notion,
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

export default NotionForm;

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
