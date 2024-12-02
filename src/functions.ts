import OpenAI from "openai";

// RunnerResponse is the response from a function call.
export interface RunnerResponse {
  component: string;
  messages: OpenAI.ChatCompletionMessageParam[];
}

export abstract class Tool {
  static definition: OpenAI.FunctionDefinition;

  static get tool(): OpenAI.Chat.Completions.ChatCompletionTool {
    return {
      type: "function",
      function: this.definition,
    };
  }

  abstract execute(
    messages: OpenAI.ChatCompletionMessageParam[],
    args: object
  ): Promise<RunnerResponse>;
}
