


import OpenAI from "openai";
import { RunnerResponse, Tool } from "../functions";

export class explainIntegration extends Tool {
  static definition = {
    name: "explain_integration",
    description:
      "This function explains how integrations work.",
    parameters: {
      type: "object",
      properties: {
        "integration_name" : {
          type: "string",
          description: "The name of the integration to be explained is needed."
        },},
      description:
        "This function requires the integration to be explained as parameter.",
    },
  };

  async execute(
    messages: OpenAI.ChatCompletionMessageParam[],
    args: {
      integration_name: string;
    }
  ): Promise<RunnerResponse> {
    
    const integrations = [
      { 
        'name': 'github-actions',
        'helpPage': 'https://help.sonatype.com/en/sonatype-github-actions.html',
      },
      {
        'name': 'gitlab-ci',
        'helpPage': 'https://help.sonatype.com/en/sonatype-for-gitlab-ci.html',
      },
      {
        'name': 'jenkins',
        'helpPage': 'https://help.sonatype.com/en/sonatype-platform-plugin-for-jenkins.html',
      },
    ];

    const systemMessage = [
      "The user is asking for details from one of our integrations.",
      "Do not explain anything outside of list of integrations provided next.",
      "Do not talk about community integrations.",
      "That list of integrations and their help pages is as follows:",
      JSON.stringify(
        integrations.map((component) => ({
          name: component.name,
          helpPage: component.helpPage,
        }))
      ),
      "Use the help page to get more details about the integration.",
    ];

    return {
      component: "integration",
      messages: [
        { role: "system", content: systemMessage.join("\n") },
        ...messages,
      ],
    };
  }
}
