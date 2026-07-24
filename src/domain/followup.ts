export interface FollowUpSuggestion {
  /** The single next question the interviewer could ask. */
  question: string;
  /** Why this question was chosen — grounded in the evidence and gap analysis. */
  reason: string;
  /** Which competency this follow-up is intended to surface evidence for. */
  addressesCompetency: string;
}
