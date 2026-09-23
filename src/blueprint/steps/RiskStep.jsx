// Thin wrapper around the site's existing risk quiz. RiskQuiz is a pure,
// prop-driven component (options in, an onComplete callback out) — reusing it
// as-is here doesn't couple the Blueprint tool to the rest of Vitta AI.
import RiskQuiz from '../../ai/RiskQuiz';

export default function RiskStep({ onComplete }) {
  return <RiskQuiz onComplete={onComplete} />;
}
