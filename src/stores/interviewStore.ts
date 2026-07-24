import { create } from "zustand";
import type {
  Evidence,
  EvidenceGapAnalysis,
  FollowUpSuggestion,
  InterviewReflection,
  TranscriptLine,
} from "@/domain";
import { TRANSCRIPT } from "@/lib/mock/interviews";
import { evaluateInterviewReflection } from "@/lib/reflectionCheck";
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
  followUpSuggestion: FollowUpSuggestion | null;
  /** Set only when the interviewer chooses to finish the interview; cleared once acted on. */
  reflection: InterviewReflection | null;
  isAnalysing: boolean;
  error: string | null;
  submitResponse: (input: SubmitResponseInput) => Promise<void>;
  finishInterview: () => void;
  dismissReflection: () => void;
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
  followUpSuggestion: null,
  reflection: null,
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
    let gapAnalysis: EvidenceGapAnalysis;
    try {
      gapAnalysis = await interviewService.analyzeGaps({
        competencies,
        objectives,
        evidence: updatedEvidence,
      });
      set({ gapAnalysis });
    } catch (error) {
      set({
        isAnalysing: false,
        error: error instanceof Error ? error.message : "Potential couldn't analyse evidence gaps.",
      });
      return;
    }

    // Likewise, evidence and gap analysis stay put even if the follow-up
    // suggestion below fails — only the last stage is allowed to fail silently.
    try {
      const followUpSuggestion = await interviewService.generateFollowUp({
        latestResponse: response,
        evidence: updatedEvidence,
        gapAnalysis,
      });
      set({ followUpSuggestion, isAnalysing: false });
    } catch (error) {
      set({
        isAnalysing: false,
        error:
          error instanceof Error
            ? error.message
            : "Potential couldn't suggest a follow-up question.",
      });
    }
  },

  // Reflection Check: orchestrates the evidence, gap analysis, and follow-up
  // suggestion already sitting in state — it never calls a model itself, and it
  // never generates a new follow-up. It only decides whether what's already
  // been collected fairly covers the interview.
  finishInterview: () => {
    const { evidence, gapAnalysis, followUpSuggestion } = get();
    set({ reflection: evaluateInterviewReflection(evidence, gapAnalysis, followUpSuggestion) });
  },

  dismissReflection: () => set({ reflection: null }),

  clearError: () => set({ error: null }),
}));
