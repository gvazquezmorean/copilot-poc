import OpenAI from "openai";
import { RunnerResponse, Tool } from "../functions";

export class recommendComponent extends Tool {
  static definition = {
    name: "recommend_component",
    description:
      "Determines and recommends the most appropriate component version based on the provided component. This function uses the available list of models to make the recommendation.",
    parameters: {
      type: "object",
      properties: {},
      description:
        "This function does not require any input parameters. It uses internal logic to recommend the best model based on the provided use-case.",
    },
  };

  async execute(
    messages: OpenAI.ChatCompletionMessageParam[]
  ): Promise<RunnerResponse> {
    // const models = await this.modelsAPI.listModels();
    const components = [ {  
      "name": "o1-mini",
      "version": "1.0",
      "publisher": "openai",
      "registryName": "azure-openai",
      "license": "MIT",
      "inferenceTasks": ["code generation", "small context operations"],
      "summary": "Smaller, faster, and 80% cheaper than o1-preview, performs well at code generation and small context operations."
    }, {
      "name": "o1-preview",
      "version": "1.0",
      "publisher": "openai",
      "registryName": "azure-openai",
      "license": "MIT",
      "inferenceTasks": ["advanced reasoning", "solving complex problems"],
      "summary": "Focused on advanced reasoning and solving complex problems, including math and science tasks. Ideal for applications that require deep contextual understanding and agentic workflows."
    }];

    const systemMessage = [
      "The user is asking for you to recommend the right model for their use-case.",
      "Explain your reasoning, and why you recommend the model you choose.",
      "Provide a summary of the model's capabilities and limitations.",
      "Include any relevant information that the user should know.",
      "Use the available models to make your recommendation.",
      "The list of available models is as follows:",
    ];

    for (const component of components) {
      systemMessage.push(
        [
          `\t- Model Name: ${component.name}`,
          `\t\tModel Version: ${component.version}`,
          `\t\tPublisher: ${component.publisher}`,
          `\t\tModel Registry: ${component.registryName}`,
          `\t\tLicense: ${component.license}`,
          `\t\tTask: ${component.inferenceTasks.join(", ")}`,
          `\t\tSummary: ${component.summary}`,
        ].join("\n")
      );
    }

    return {
      component: 'recommend_component',
      messages: [
        { role: "system", content: systemMessage.join("\n") },
        ...messages,
      ],
    };
  }
}
