// Helpers for spotting chat turns whose model response is missing or failed,
// shared by the chat pages (to block sending / allow retry) and the task pages
// (to explain why Submit is disabled).

const ERROR_PREFIXES = [
  "[error]",
  "the model is temporarily unavailable",
  "encountered an error",
  "streaming timed out",
  "failed to generate a response",
];

export const isErrorOutput = (value) => {
  if (typeof value !== "string") return false;
  const lower = value.toLowerCase().trim();
  return ERROR_PREFIXES.some((prefix) => lower.startsWith(prefix));
};

// Plain text of a single-model turn output (string or formatted segments).
export const getOutputText = (output) => {
  if (typeof output === "string") return output;
  if (Array.isArray(output)) return output.map((seg) => seg?.value || "").join("");
  return "";
};

// "error" | "empty" | null for one InstructionDrivenChat turn.
export const getSingleTurnProblem = (turn) => {
  if (!turn?.output) return "empty";
  const text = getOutputText(turn.output);
  if (isErrorOutput(text)) return "error";
  if (text.trim() === "") return "empty";
  return null;
};

// { problem, modelName } for one MultipleLLMInstructionDrivenChat turn, or null.
export const getMultiTurnProblem = (turn) => {
  if (!turn?.output || !Array.isArray(turn.output)) return { problem: "empty", modelName: null };
  for (const modelResp of turn.output) {
    const value = modelResp?.output?.[0]?.value;
    const modelName = modelResp?.model_name || modelResp?.model_id || null;
    if (modelResp?.status === "error" || isErrorOutput(value)) {
      return { problem: "error", modelName };
    }
    if (!Array.isArray(modelResp?.output) || typeof value !== "string" || value.trim() === "") {
      return { problem: "empty", modelName };
    }
  }
  return null;
};

// First turn with an empty or error response:
// { index, problem: "error" | "empty", modelName } or null.
export const findBlockingTurn = (chatHistory, projectType) => {
  if (!Array.isArray(chatHistory)) return null;
  for (let index = 0; index < chatHistory.length; index++) {
    const turn = chatHistory[index];
    if (projectType === "InstructionDrivenChat") {
      const problem = getSingleTurnProblem(turn);
      if (problem) return { index, problem, modelName: null };
    } else if (projectType === "MultipleLLMInstructionDrivenChat") {
      const result = getMultiTurnProblem(turn);
      if (result) return { index, ...result };
    }
  }
  return null;
};

const describeTurn = ({ index, problem, modelName }) =>
  `Turn ${index + 1} has ${problem === "error" ? "an error" : "an empty"} response` +
  (modelName ? ` from ${modelName}` : "");

// How to fix a blocking turn. Only the last turn has Retry; new prompts are
// blocked after a failed turn, so a failed middle turn only exists in older chats.
const howToFix = (blockingTurn, turnCount) => {
  const isLast = blockingTurn.index === turnCount - 1;
  if (!isLast) {
    return "Delete the turns after it, then use Retry on it";
  }
  return "Use Retry on that turn to regenerate it";
};

export const getSubmitBlockedReason = ({ isModelStreaming, blockingTurn, turnCount, action = "submitting" }) => {
  if (isModelStreaming) return `Wait for the model to finish responding before ${action}.`;
  if (!blockingTurn) return "";
  return `${describeTurn(blockingTurn)}. ${howToFix(blockingTurn, turnCount)} before ${action}.`;
};

export const getSendBlockedReason = ({ blockingTurn, turnCount }) => {
  if (!blockingTurn) return "";
  return `${describeTurn(blockingTurn)}. ${howToFix(blockingTurn, turnCount)} before sending a new prompt.`;
};
