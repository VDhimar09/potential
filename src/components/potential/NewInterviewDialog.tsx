import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { interviewService } from "@/services/interviewService";
import type { Candidate, Interview, Role } from "@/generated/prisma/client";

export function NewInterviewDialog({
  workspaceId,
  roles,
  candidates,
  defaultRoleId,
  defaultCandidateId,
  trigger,
  onCreated,
}: {
  workspaceId: string;
  roles: Role[];
  candidates: Candidate[];
  defaultRoleId?: string;
  defaultCandidateId?: string;
  trigger?: ReactNode;
  onCreated?: (interview: Interview) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [roleId, setRoleId] = useState(defaultRoleId ?? "");
  const [candidateId, setCandidateId] = useState(defaultCandidateId ?? "");
  const [scheduledAt, setScheduledAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = roleId !== "" && candidateId !== "";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const interview = await interviewService.createInterview({
        workspaceId,
        roleId,
        candidateId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      });
      toast.success("Interview created");
      setScheduledAt("");
      if (!defaultRoleId) setRoleId("");
      if (!defaultCandidateId) setCandidateId("");
      setOpen(false);
      await router.invalidate();
      onCreated?.(interview);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Potential couldn't create that interview.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New interview
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New interview</DialogTitle>
            <DialogDescription>
              Pair a candidate with a role to schedule an interview.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label>Role</Label>
              {defaultRoleId ? (
                <p className="rounded-md border border-input bg-muted/40 px-3 py-2 text-sm text-foreground">
                  {roles.find((r) => r.id === defaultRoleId)?.title ?? "Selected role"}
                </p>
              ) : roles.length > 0 ? (
                <Select value={roleId} onValueChange={setRoleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-[13px] text-muted-foreground">
                  No roles yet —{" "}
                  <Link
                    to="/app/roles/new"
                    className="text-secondary underline-offset-2 hover:underline"
                  >
                    create one first
                  </Link>
                  .
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Candidate</Label>
              {defaultCandidateId ? (
                <p className="rounded-md border border-input bg-muted/40 px-3 py-2 text-sm text-foreground">
                  {(() => {
                    const c = candidates.find((c) => c.id === defaultCandidateId);
                    return c ? `${c.firstName} ${c.lastName}` : "Selected candidate";
                  })()}
                </p>
              ) : candidates.length > 0 ? (
                <Select value={candidateId} onValueChange={setCandidateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        {candidate.firstName} {candidate.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-[13px] text-muted-foreground">
                  No candidates yet —{" "}
                  <Link
                    to="/app/candidates"
                    className="text-secondary underline-offset-2 hover:underline"
                  >
                    add one first
                  </Link>
                  .
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="interview-scheduled-at">Scheduled for (optional)</Label>
              <Input
                id="interview-scheduled-at"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Creating…" : "Create interview"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
