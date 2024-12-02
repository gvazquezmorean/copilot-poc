
import OpenAI from "openai";
import { RunnerResponse, Tool } from "../functions";
import axios from "axios";

export class listViolations extends Tool {
  static definition = {
    name: "list_violations",
    description:
      "This function lists violations based of a scan-id.",
    parameters: {
      type: "object",
      properties: {},
      description:
        "This function does not require any input parameters. It simply returns a list of violations.",
    },
  };

  async execute(
    messages: OpenAI.ChatCompletionMessageParam[]
  ): Promise<RunnerResponse> {
    
    // const models = await this.modelsAPI.listModels();
    const applicationsResponse = await axios.get("http://localhost:8070/api/v2/applications?publicId=testapp", {
      auth: { username: 'admin', password: "admin123." }
    });

    const appId = applicationsResponse.data.applications[0].id;

    const report = await axios.get(`http://localhost:8070/api/v2/reports/applications/${appId}`,{
      auth: { username: 'admin', password: "admin123." }
    });

    const reportDataUrl = report.data[0].reportDataUrl;

    const reportData = await axios.get(`http://localhost:8070/${reportDataUrl}`, {
      auth: { username: 'admin', password: "admin123." }
    });

    const components = reportData.data.components;

    console.log(components);

    const systemMessage = [
      "The user is asking for a list of components with securityIssues.",
      "If the component does not have any security issues, it will not be included in the list.",
      "Respond with a concise and readable list of the components, with a short description for each one.",
      "Start by showing how many components where there and how many of them have security issues.",
      "Use markdown formatting to make each description more readable.",
      "Begin each component's description with a header consisting of the component's name",
      "emphasis the publisher of the component",
      "That list of components is as follows:",
      JSON.stringify(
        components.map((component) => ({
          name: component.displayName,
          publisher: component.publisher,
          description: component.summary,
        }))
      ),
    ];

    return {
      component: "list_violations",
      messages: [
        { role: "system", content: systemMessage.join("\n") },
        ...messages,
      ],
    };
  }
}
