import { create } from "zustand";
import type { Evidence, EvidenceGapAnalysis, TranscriptLine } from "@/domain";
import { TRANSCRIPT } from "@/lib/mock/interviews";
import { interviewService } from "@/services/interviewService";

export interface SubmitResponseInput {
  /** The interviewer's question this response answers. */
  question: string;
  /** What the candidate said. */
  response: string;
  competencies: string[];
  /** The interview's stated objectives, for gap analysis. */
  objectives: string[];
}

interface InterviewState {
  transcript: TranscriptLine[];
  evidence: Evidence[];
  gapAnalysis: EvidenceGapAnalysis | null;
  isAnalysing: boolean;
  error: string | null;
  submitResponse: (input: SubmitResponseInput) => Promise<void>;
  clearError: () => void;
}

function currentClockTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  transcript: TRANSCRIPT,
  evidence: [],
  gapAnalysis: null,
  isAnalysing: false,
  error: null,

  submitResponse: async ({ question, response, competencies, objectives }) => {
    set((state) => ({
      transcript: [...state.transcript, { speaker: "Alex", text: response, t: currentClockTime() }],
      isAnalysing: true,
      error: null,
    }));

    let updatedEvidence: Evidence[];
    try {
      const newEvidence = await interviewService.analyseResponse({
        question,
        response,
        competencies,
      });
      updatedEvidence = [...get().evidence, ...newEvidence];
      set({ evidence: updatedEvidence });
    } catch (error) {
      set({
        isAnalysing: false,
        error: error instanceof Error ? error.message : "Potential couldn't analyse that response.",
      });
      return;
    }

    // Evidence was captured successfully even if gap analysis below fails, so a
    // gap-analysis error never discards the evidence the interviewer just got.
    try {
      const gapAnalysis = await interviewService.analyzeGaps({
        competencies,
        objectives,
        evidence: updatedEvidence,
      });
      set({ gapAnalysis, isAnalysing: false });
    } catch (error) {
      set({
        isAnalysing: false,
        error: error instanceof Error ? error.message : "Potential couldn't analyse evidence gaps.",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
