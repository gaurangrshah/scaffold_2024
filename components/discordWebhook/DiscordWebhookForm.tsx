import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/discord-webhook/useOptimisticDiscordWebhooks";

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

import { type DiscordWebhook, insertDiscordWebhookParams } from "@/lib/db/schema/discordWebhook";
import {
  createDiscordWebhookAction,
  deleteDiscordWebhookAction,
  updateDiscordWebhookAction,
} from "@/lib/actions/discordWebhook";
import { type Connection, type ConnectionId } from "@/lib/db/schema/connections";

const DiscordWebhookForm = ({
  connections,
  connectionId,
  discordWebhook,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  discordWebhook?: DiscordWebhook | null;
  connections: Connection[];
  connectionId?: ConnectionId
  openModal?: (discordWebhook?: DiscordWebhook) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<DiscordWebhook>(insertDiscordWebhookParams);
  const editing = !!discordWebhook?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("discord-webhook");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: DiscordWebhook },
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
      toast.success(`DiscordWebhook ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const discordWebhookParsed = await insertDiscordWebhookParams.safeParseAsync({ connectionId, ...payload });
    if (!discordWebhookParsed.success) {
      setErrors(discordWebhookParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = discordWebhookParsed.data;
    const pendingDiscordWebhook: DiscordWebhook = {
      
      id: discordWebhook?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingDiscordWebhook,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateDiscordWebhookAction({ ...values, id: discordWebhook.id })
          : await createDiscordWebhookAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingDiscordWebhook 
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
            errors?.webhookId ? "text-destructive" : "",
          )}
        >
          Webhook Id
        </Label>
        <Input
          type="text"
          name="webhookId"
          className={cn(errors?.webhookId ? "ring ring-destructive" : "")}
          defaultValue={discordWebhook?.webhookId ?? ""}
        />
        {errors?.webhookId ? (
          <p className="text-xs text-destructive mt-2">{errors.webhookId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.url ? "text-destructive" : "",
          )}
        >
          Url
        </Label>
        <Input
          type="text"
          name="url"
          className={cn(errors?.url ? "ring ring-destructive" : "")}
          defaultValue={discordWebhook?.url ?? ""}
        />
        {errors?.url ? (
          <p className="text-xs text-destructive mt-2">{errors.url[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.name ? "text-destructive" : "",
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={discordWebhook?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.guildName ? "text-destructive" : "",
          )}
        >
          Guild Name
        </Label>
        <Input
          type="text"
          name="guildName"
          className={cn(errors?.guildName ? "ring ring-destructive" : "")}
          defaultValue={discordWebhook?.guildName ?? ""}
        />
        {errors?.guildName ? (
          <p className="text-xs text-destructive mt-2">{errors.guildName[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.guildId ? "text-destructive" : "",
          )}
        >
          Guild Id
        </Label>
        <Input
          type="text"
          name="guildId"
          className={cn(errors?.guildId ? "ring ring-destructive" : "")}
          defaultValue={discordWebhook?.guildId ?? ""}
        />
        {errors?.guildId ? (
          <p className="text-xs text-destructive mt-2">{errors.guildId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.channelId ? "text-destructive" : "",
          )}
        >
          Channel Id
        </Label>
        <Input
          type="text"
          name="channelId"
          className={cn(errors?.channelId ? "ring ring-destructive" : "")}
          defaultValue={discordWebhook?.channelId ?? ""}
        />
        {errors?.channelId ? (
          <p className="text-xs text-destructive mt-2">{errors.channelId[0]}</p>
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
        <Select defaultValue={discordWebhook?.connectionId} name="connectionId">
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
              addOptimistic && addOptimistic({ action: "delete", data: discordWebhook });
              const error = await deleteDiscordWebhookAction(discordWebhook.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: discordWebhook,
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

export default DiscordWebhookForm;

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
