
import OpenAI from "openai";
import { RunnerResponse, Tool } from "../functions";
import axios from "axios";

export class listComponents extends Tool {
  static definition = {
    name: "list_components",
    description:
      "This function lists components based of a scan-id.",
    parameters: {
      type: "object",
      properties: {},
      description:
        "This function does not require any input parameters. It simply returns a list of components.",
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

    console.log(report.data);
    const reportDataUrl = report.data[0].reportDataUrl;

    console.log("Report Data URL: ", reportDataUrl);

    const reportData = await axios.get(`http://localhost:8070/${reportDataUrl}`, {
      auth: { username: 'admin', password: "admin123." }
    });

    // console.log("Report Data: ", reportData.data);


    // const components = [ {  
    //   "displayName": "o1-mini",
    //   "version": "1.0",
    //   "publisher": "openai",
    //   "registryName": "azure-openai",
    //   "license": "MIT",
    //   "inferenceTasks": ["code generation", "small context operations"],
    //   "summary": "Smaller, faster, and 80% cheaper than o1-preview, performs well at code generation and small context operations."
    // }, {
    //   "displayName": "o1-preview",
    //   "version": "1.0",
    //   "publisher": "openai",
    //   "registryName": "azure-openai",
    //   "license": "MIT",
    //   "inferenceTasks": ["advanced reasoning", "solving complex problems"],
    //   "summary": "Focused on advanced reasoning and solving complex problems, including math and science tasks. Ideal for applications that require deep contextual understanding and agentic workflows."
    // }];

    const components = reportData.data.components//.map((component) => ({
    //   displayName: component.displayName,
    //   version: component.version,
    //   publisher: component.publisher,
    //   registryName: component.registryName,
    //   license: component.license,
    // }));

    const systemMessage = [
      "The user is asking for a list of components with securityIssues.",
      "Respond with a concise and readable list of the components, with a short description for each one.",
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
      component: "recommended_component",
      messages: [
        { role: "system", content: systemMessage.join("\n") },
        ...messages,
      ],
    };
  }
}
