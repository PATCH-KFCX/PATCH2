"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileUpdateInput, type ProfileUpdateInput } from "@/lib/validators/user";
import { useRouter } from "next/navigation";

export function ProfileForm({
  email,
  initialName,
  initialBio,
  initialTimezone,
  timezones,
}: {
  email: string;
  initialName: string | null;
  initialBio: string | null;
  initialTimezone: string;
  timezones: string[];
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateInput),
    defaultValues: {
      name: initialName ?? "",
      bio: initialBio ?? "",
      timezone: initialTimezone,
    },
  });

  async function onSubmit(values: ProfileUpdateInput) {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name?.trim() ? values.name.trim() : null,
        bio: values.bio?.trim() ? values.bio.trim() : null,
        timezone: values.timezone,
      }),
    });
    if (!res.ok) {
      toast.error("Could not save profile.");
      return;
    }
    const data = (await res.json()) as { user: ProfileUpdateInput };
    reset(data.user);
    toast.success("Profile saved.");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={email} disabled readOnly />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          rows={4}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-xs text-destructive">{errors.bio.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone</Label>
        <select
          id="timezone"
          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
          {...register("timezone")}
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Used for medication reminders and weekly summaries.
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
