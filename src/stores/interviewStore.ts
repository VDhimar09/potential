import { create } from "zustand";
import type { Evidence, TranscriptLine } from "@/domain";
import { TRANSCRIPT } from "@/lib/mock/interviews";
import { interviewService } from "@/services/interviewService";

export interface SubmitResponseInput {
  /** The interviewer's question this response answers. */
  question: string;
  /** What the candidate said. */
  response: string;
  competencies: string[];
}

interface InterviewState {
  transcript: TranscriptLine[];
  evidence: Evidence[];
  isAnalysing: boolean;
  error: string | null;
  submitResponse: (input: SubmitResponseInput) => Promise<void>;
  clearError: () => void;
}

function currentClockTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  transcript: TRANSCRIPT,
  evidence: [],
  isAnalysing: false,
  error: null,

  submitResponse: async ({ question, response, competencies }) => {
    set((state) => ({
      transcript: [...state.transcript, { speaker: "Alex", text: response, t: currentClockTime() }],
      isAnalysing: true,
      error: null,
    }));

    try {
      const newEvidence = await interviewService.analyseResponse({
        question,
        response,
        competencies,
      });
      set((state) => ({ evidence: [...state.evidence, ...newEvidence], isAnalysing: false }));
    } catch (error) {
      set({
        isAnalysing: false,
        error: error instanceof Error ? error.message : "Potential couldn't analyse that response.",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
