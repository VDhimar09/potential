import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
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
import { candidateService } from "@/services/candidateService";
import type { Candidate } from "@/generated/prisma/client";

export function NewCandidateDialog({
  workspaceId,
  trigger,
  onCreated,
}: {
  workspaceId: string;
  trigger?: ReactNode;
  onCreated?: (candidate: Candidate) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const candidate = await candidateService.createCandidate({
        workspaceId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      });
      toast.success(`${candidate.firstName} ${candidate.lastName} added`);
      setFirstName("");
      setLastName("");
      setEmail("");
      setOpen(false);
      await router.invalidate();
      onCreated?.(candidate);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Potential couldn't add that candidate.",
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
            <Plus className="h-3.5 w-3.5" /> New candidate
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New candidate</DialogTitle>
            <DialogDescription>Add a candidate to this workspace.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="candidate-first-name">First name</Label>
                <Input
                  id="candidate-first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="candidate-last-name">Last name</Label>
                <Input
                  id="candidate-last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="candidate-email">Email</Label>
              <Input
                id="candidate-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Adding…" : "Add candidate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
