import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/workflows/useOptimisticWorkflows";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";


import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Workflow, insertWorkflowParams } from "@/lib/db/schema/workflows";
import {
  createWorkflowAction,
  deleteWorkflowAction,
  updateWorkflowAction,
} from "@/lib/actions/workflows";
import { type User, type UserId } from "@/lib/db/schema/users";

const WorkflowForm = ({
  users,
  userId,
  workflow,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  workflow?: Workflow | null;
  users: User[];
  userId?: UserId
  openModal?: (workflow?: Workflow) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Workflow>(insertWorkflowParams);
  const editing = !!workflow?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("workflows");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Workflow },
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
      toast.success(`Workflow ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const workflowParsed = await insertWorkflowParams.safeParseAsync({ userId, ...payload });
    if (!workflowParsed.success) {
      setErrors(workflowParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = workflowParsed.data;
    const pendingWorkflow: Workflow = {
      
      id: workflow?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingWorkflow,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateWorkflowAction({ ...values, id: workflow.id })
          : await createWorkflowAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingWorkflow 
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
            errors?.nodes ? "text-destructive" : "",
          )}
        >
          Nodes
        </Label>
        <Input
          type="text"
          name="nodes"
          className={cn(errors?.nodes ? "ring ring-destructive" : "")}
          defaultValue={workflow?.nodes ?? ""}
        />
        {errors?.nodes ? (
          <p className="text-xs text-destructive mt-2">{errors.nodes[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.edges ? "text-destructive" : "",
          )}
        >
          Edges
        </Label>
        <Input
          type="text"
          name="edges"
          className={cn(errors?.edges ? "ring ring-destructive" : "")}
          defaultValue={workflow?.edges ?? ""}
        />
        {errors?.edges ? (
          <p className="text-xs text-destructive mt-2">{errors.edges[0]}</p>
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
          defaultValue={workflow?.name ?? ""}
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
            errors?.discordTemplate ? "text-destructive" : "",
          )}
        >
          Discord Template
        </Label>
        <Input
          type="text"
          name="discordTemplate"
          className={cn(errors?.discordTemplate ? "ring ring-destructive" : "")}
          defaultValue={workflow?.discordTemplate ?? ""}
        />
        {errors?.discordTemplate ? (
          <p className="text-xs text-destructive mt-2">{errors.discordTemplate[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.notionTemplate ? "text-destructive" : "",
          )}
        >
          Notion Template
        </Label>
        <Input
          type="text"
          name="notionTemplate"
          className={cn(errors?.notionTemplate ? "ring ring-destructive" : "")}
          defaultValue={workflow?.notionTemplate ?? ""}
        />
        {errors?.notionTemplate ? (
          <p className="text-xs text-destructive mt-2">{errors.notionTemplate[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.slackTemplate ? "text-destructive" : "",
          )}
        >
          Slack Template
        </Label>
        <Input
          type="text"
          name="slackTemplate"
          className={cn(errors?.slackTemplate ? "ring ring-destructive" : "")}
          defaultValue={workflow?.slackTemplate ?? ""}
        />
        {errors?.slackTemplate ? (
          <p className="text-xs text-destructive mt-2">{errors.slackTemplate[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.slackChannels ? "text-destructive" : "",
          )}
        >
          Slack Channels
        </Label>
        <Input
          type="text"
          name="slackChannels"
          className={cn(errors?.slackChannels ? "ring ring-destructive" : "")}
          defaultValue={workflow?.slackChannels ?? ""}
        />
        {errors?.slackChannels ? (
          <p className="text-xs text-destructive mt-2">{errors.slackChannels[0]}</p>
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
          defaultValue={workflow?.slackAccessToken ?? ""}
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
            errors?.notionAccessToken ? "text-destructive" : "",
          )}
        >
          Notion Access Token
        </Label>
        <Input
          type="text"
          name="notionAccessToken"
          className={cn(errors?.notionAccessToken ? "ring ring-destructive" : "")}
          defaultValue={workflow?.notionAccessToken ?? ""}
        />
        {errors?.notionAccessToken ? (
          <p className="text-xs text-destructive mt-2">{errors.notionAccessToken[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.notionDbId ? "text-destructive" : "",
          )}
        >
          Notion Db Id
        </Label>
        <Input
          type="text"
          name="notionDbId"
          className={cn(errors?.notionDbId ? "ring ring-destructive" : "")}
          defaultValue={workflow?.notionDbId ?? ""}
        />
        {errors?.notionDbId ? (
          <p className="text-xs text-destructive mt-2">{errors.notionDbId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.flowPath ? "text-destructive" : "",
          )}
        >
          Flow Path
        </Label>
        <Input
          type="text"
          name="flowPath"
          className={cn(errors?.flowPath ? "ring ring-destructive" : "")}
          defaultValue={workflow?.flowPath ?? ""}
        />
        {errors?.flowPath ? (
          <p className="text-xs text-destructive mt-2">{errors.flowPath[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.cronPath ? "text-destructive" : "",
          )}
        >
          Cron Path
        </Label>
        <Input
          type="text"
          name="cronPath"
          className={cn(errors?.cronPath ? "ring ring-destructive" : "")}
          defaultValue={workflow?.cronPath ?? ""}
        />
        {errors?.cronPath ? (
          <p className="text-xs text-destructive mt-2">{errors.cronPath[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
<div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.publish ? "text-destructive" : "",
          )}
        >
          Publish
        </Label>
        <br />
        <Checkbox defaultChecked={workflow?.publish} name={'publish'} className={cn(errors?.publish ? "ring ring-destructive" : "")} />
        {errors?.publish ? (
          <p className="text-xs text-destructive mt-2">{errors.publish[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.description ? "text-destructive" : "",
          )}
        >
          Description
        </Label>
        <Input
          type="text"
          name="description"
          className={cn(errors?.description ? "ring ring-destructive" : "")}
          defaultValue={workflow?.description ?? ""}
        />
        {errors?.description ? (
          <p className="text-xs text-destructive mt-2">{errors.description[0]}</p>
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
        <Select defaultValue={workflow?.userId} name="userId">
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
              addOptimistic && addOptimistic({ action: "delete", data: workflow });
              const error = await deleteWorkflowAction(workflow.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: workflow,
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

export default WorkflowForm;

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
