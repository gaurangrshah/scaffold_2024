import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/users/useOptimisticUsers";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";



import { type User, insertUserParams } from "@/lib/db/schema/users";
import {
  createUserAction,
  deleteUserAction,
  updateUserAction,
} from "@/lib/actions/users";


const UserForm = ({
  
  user,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  user?: User | null;
  
  openModal?: (user?: User) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<User>(insertUserParams);
  const editing = !!user?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("users");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: User },
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
      toast.success(`User ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const userParsed = await insertUserParams.safeParseAsync({  ...payload });
    if (!userParsed.success) {
      setErrors(userParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = userParsed.data;
    const pendingUser: User = {
      updatedAt: user?.updatedAt ?? new Date(),
      createdAt: user?.createdAt ?? new Date(),
      id: user?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingUser,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateUserAction({ ...values, id: user.id })
          : await createUserAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingUser 
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
            errors?.clerkId ? "text-destructive" : "",
          )}
        >
          Clerk Id
        </Label>
        <Input
          type="text"
          name="clerkId"
          className={cn(errors?.clerkId ? "ring ring-destructive" : "")}
          defaultValue={user?.clerkId ?? ""}
        />
        {errors?.clerkId ? (
          <p className="text-xs text-destructive mt-2">{errors.clerkId[0]}</p>
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
          defaultValue={user?.name ?? ""}
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
            errors?.email ? "text-destructive" : "",
          )}
        >
          Email
        </Label>
        <Input
          type="text"
          name="email"
          className={cn(errors?.email ? "ring ring-destructive" : "")}
          defaultValue={user?.email ?? ""}
        />
        {errors?.email ? (
          <p className="text-xs text-destructive mt-2">{errors.email[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.profileImage ? "text-destructive" : "",
          )}
        >
          Profile Image
        </Label>
        <Input
          type="text"
          name="profileImage"
          className={cn(errors?.profileImage ? "ring ring-destructive" : "")}
          defaultValue={user?.profileImage ?? ""}
        />
        {errors?.profileImage ? (
          <p className="text-xs text-destructive mt-2">{errors.profileImage[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.tier ? "text-destructive" : "",
          )}
        >
          Tier
        </Label>
        <Input
          type="text"
          name="tier"
          className={cn(errors?.tier ? "ring ring-destructive" : "")}
          defaultValue={user?.tier ?? ""}
        />
        {errors?.tier ? (
          <p className="text-xs text-destructive mt-2">{errors.tier[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.credits ? "text-destructive" : "",
          )}
        >
          Credits
        </Label>
        <Input
          type="text"
          name="credits"
          className={cn(errors?.credits ? "ring ring-destructive" : "")}
          defaultValue={user?.credits ?? ""}
        />
        {errors?.credits ? (
          <p className="text-xs text-destructive mt-2">{errors.credits[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.localGoogleId ? "text-destructive" : "",
          )}
        >
          Local Google Id
        </Label>
        <Input
          type="text"
          name="localGoogleId"
          className={cn(errors?.localGoogleId ? "ring ring-destructive" : "")}
          defaultValue={user?.localGoogleId ?? ""}
        />
        {errors?.localGoogleId ? (
          <p className="text-xs text-destructive mt-2">{errors.localGoogleId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.googleResourceId ? "text-destructive" : "",
          )}
        >
          Google Resource Id
        </Label>
        <Input
          type="text"
          name="googleResourceId"
          className={cn(errors?.googleResourceId ? "ring ring-destructive" : "")}
          defaultValue={user?.googleResourceId ?? ""}
        />
        {errors?.googleResourceId ? (
          <p className="text-xs text-destructive mt-2">{errors.googleResourceId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
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
              addOptimistic && addOptimistic({ action: "delete", data: user });
              const error = await deleteUserAction(user.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: user,
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

export default UserForm;

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
