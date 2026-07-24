import type { EvidenceNode, EvidenceEdge } from "@/domain";

export const EVIDENCE_NODES: EvidenceNode[] = [
  { id: "problem", label: "Problem solving", strength: 0.9, x: 22, y: 28 },
  { id: "ownership", label: "Ownership", strength: 0.85, x: 58, y: 18 },
  { id: "systems", label: "Systems thinking", strength: 0.7, x: 82, y: 42 },
  { id: "communication", label: "Communication", strength: 0.6, x: 30, y: 62 },
  { id: "leadership", label: "Leadership", strength: 0.35, x: 62, y: 70 },
  { id: "conflict", label: "Conflict mgmt", strength: 0.1, x: 86, y: 82 },
];

export const EVIDENCE_EDGES: EvidenceEdge[] = [
  ["problem", "ownership"],
  ["ownership", "systems"],
  ["problem", "communication"],
  ["ownership", "leadership"],
  ["leadership", "conflict"],
  ["communication", "leadership"],
];
