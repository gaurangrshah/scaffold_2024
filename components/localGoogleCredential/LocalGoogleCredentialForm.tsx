import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/local-google-credential/useOptimisticLocalGoogleCredentials";

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

import { type LocalGoogleCredential, insertLocalGoogleCredentialParams } from "@/lib/db/schema/localGoogleCredential";
import {
  createLocalGoogleCredentialAction,
  deleteLocalGoogleCredentialAction,
  updateLocalGoogleCredentialAction,
} from "@/lib/actions/localGoogleCredential";
import { type User, type UserId } from "@/lib/db/schema/users";

const LocalGoogleCredentialForm = ({
  users,
  userId,
  localGoogleCredential,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  localGoogleCredential?: LocalGoogleCredential | null;
  users: User[];
  userId?: UserId
  openModal?: (localGoogleCredential?: LocalGoogleCredential) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<LocalGoogleCredential>(insertLocalGoogleCredentialParams);
  const editing = !!localGoogleCredential?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("local-google-credential");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: LocalGoogleCredential },
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
      toast.success(`LocalGoogleCredential ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const localGoogleCredentialParsed = await insertLocalGoogleCredentialParams.safeParseAsync({ userId, ...payload });
    if (!localGoogleCredentialParsed.success) {
      setErrors(localGoogleCredentialParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = localGoogleCredentialParsed.data;
    const pendingLocalGoogleCredential: LocalGoogleCredential = {
      updatedAt: localGoogleCredential?.updatedAt ?? new Date(),
      createdAt: localGoogleCredential?.createdAt ?? new Date(),
      id: localGoogleCredential?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingLocalGoogleCredential,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateLocalGoogleCredentialAction({ ...values, id: localGoogleCredential.id })
          : await createLocalGoogleCredentialAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingLocalGoogleCredential 
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
          defaultValue={localGoogleCredential?.accessToken ?? ""}
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
            errors?.folderId ? "text-destructive" : "",
          )}
        >
          Folder Id
        </Label>
        <Input
          type="text"
          name="folderId"
          className={cn(errors?.folderId ? "ring ring-destructive" : "")}
          defaultValue={localGoogleCredential?.folderId ?? ""}
        />
        {errors?.folderId ? (
          <p className="text-xs text-destructive mt-2">{errors.folderId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.pageToken ? "text-destructive" : "",
          )}
        >
          Page Token
        </Label>
        <Input
          type="text"
          name="pageToken"
          className={cn(errors?.pageToken ? "ring ring-destructive" : "")}
          defaultValue={localGoogleCredential?.pageToken ?? ""}
        />
        {errors?.pageToken ? (
          <p className="text-xs text-destructive mt-2">{errors.pageToken[0]}</p>
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
          defaultValue={localGoogleCredential?.channelId ?? ""}
        />
        {errors?.channelId ? (
          <p className="text-xs text-destructive mt-2">{errors.channelId[0]}</p>
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
          defaultValue={localGoogleCredential?.remove ?? ""}
        />
        {errors?.remove ? (
          <p className="text-xs text-destructive mt-2">{errors.remove[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
<div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.subscribed ? "text-destructive" : "",
          )}
        >
          Subscribed
        </Label>
        <br />
        <Checkbox defaultChecked={localGoogleCredential?.subscribed} name={'subscribed'} className={cn(errors?.subscribed ? "ring ring-destructive" : "")} />
        {errors?.subscribed ? (
          <p className="text-xs text-destructive mt-2">{errors.subscribed[0]}</p>
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
        <Select defaultValue={localGoogleCredential?.userId} name="userId">
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
              addOptimistic && addOptimistic({ action: "delete", data: localGoogleCredential });
              const error = await deleteLocalGoogleCredentialAction(localGoogleCredential.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: localGoogleCredential,
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

export default LocalGoogleCredentialForm;

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
