import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/slack/useOptimisticSlacks";

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

import { type Slack, insertSlackParams } from "@/lib/db/schema/slack";
import {
  createSlackAction,
  deleteSlackAction,
  updateSlackAction,
} from "@/lib/actions/slack";
import { type Connection, type ConnectionId } from "@/lib/db/schema/connections";

const SlackForm = ({
  connections,
  connectionId,
  slack,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  slack?: Slack | null;
  connections: Connection[];
  connectionId?: ConnectionId
  openModal?: (slack?: Slack) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Slack>(insertSlackParams);
  const editing = !!slack?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("slack");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Slack },
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
      toast.success(`Slack ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const slackParsed = await insertSlackParams.safeParseAsync({ connectionId, ...payload });
    if (!slackParsed.success) {
      setErrors(slackParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = slackParsed.data;
    const pendingSlack: Slack = {
      
      id: slack?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingSlack,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateSlackAction({ ...values, id: slack.id })
          : await createSlackAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingSlack 
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
            errors?.appId ? "text-destructive" : "",
          )}
        >
          App Id
        </Label>
        <Input
          type="text"
          name="appId"
          className={cn(errors?.appId ? "ring ring-destructive" : "")}
          defaultValue={slack?.appId ?? ""}
        />
        {errors?.appId ? (
          <p className="text-xs text-destructive mt-2">{errors.appId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.authedUserId ? "text-destructive" : "",
          )}
        >
          Authed User Id
        </Label>
        <Input
          type="text"
          name="authedUserId"
          className={cn(errors?.authedUserId ? "ring ring-destructive" : "")}
          defaultValue={slack?.authedUserId ?? ""}
        />
        {errors?.authedUserId ? (
          <p className="text-xs text-destructive mt-2">{errors.authedUserId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.authedUserToken ? "text-destructive" : "",
          )}
        >
          Authed User Token
        </Label>
        <Input
          type="text"
          name="authedUserToken"
          className={cn(errors?.authedUserToken ? "ring ring-destructive" : "")}
          defaultValue={slack?.authedUserToken ?? ""}
        />
        {errors?.authedUserToken ? (
          <p className="text-xs text-destructive mt-2">{errors.authedUserToken[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.slackAccessToken ? "text-destructive" : "",
          )}
        >
          Slack Access Token
        </Label>
        <Input
          type="text"
          name="slackAccessToken"
          className={cn(errors?.slackAccessToken ? "ring ring-destructive" : "")}
          defaultValue={slack?.slackAccessToken ?? ""}
        />
        {errors?.slackAccessToken ? (
          <p className="text-xs text-destructive mt-2">{errors.slackAccessToken[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.botUserId ? "text-destructive" : "",
          )}
        >
          Bot User Id
        </Label>
        <Input
          type="text"
          name="botUserId"
          className={cn(errors?.botUserId ? "ring ring-destructive" : "")}
          defaultValue={slack?.botUserId ?? ""}
        />
        {errors?.botUserId ? (
          <p className="text-xs text-destructive mt-2">{errors.botUserId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.teamId ? "text-destructive" : "",
          )}
        >
          Team Id
        </Label>
        <Input
          type="text"
          name="teamId"
          className={cn(errors?.teamId ? "ring ring-destructive" : "")}
          defaultValue={slack?.teamId ?? ""}
        />
        {errors?.teamId ? (
          <p className="text-xs text-destructive mt-2">{errors.teamId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.teamName ? "text-destructive" : "",
          )}
        >
          Team Name
        </Label>
        <Input
          type="text"
          name="teamName"
          className={cn(errors?.teamName ? "ring ring-destructive" : "")}
          defaultValue={slack?.teamName ?? ""}
        />
        {errors?.teamName ? (
          <p className="text-xs text-destructive mt-2">{errors.teamName[0]}</p>
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
        <Select defaultValue={slack?.connectionId} name="connectionId">
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
              addOptimistic && addOptimistic({ action: "delete", data: slack });
              const error = await deleteSlackAction(slack.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: slack,
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

export default SlackForm;

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
