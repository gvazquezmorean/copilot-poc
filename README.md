# copilot-poc

## Project Description
This project is a proof of concept for integrating GitHub Copilot with various development tools and workflows. It demonstrates how Copilot can extend its capabilities with a set of functions that could interact with IQ Server to fetch data and extend copilots knowledge.

## Usage Instructions
1. Install dependencies
  `npm install`
2. Start application in dev mode
  `npm run dev`
3. Forward port 3000 in VSCode:
   - Open the Command Palette (F1 or Ctrl+Shift+P).
   - Type `Remote-SSH: Forward Port` and select it.
   - Enter `3000` when prompted for the port number.
   - Choose `localhost:3000` as the destination.

## Create a GH App
Copilot will interact with a GH app, which will then redirect the user prompts to this agent.
In order to create your GH app, follow the instructions in https://docs.github.com/en/copilot/building-copilot-extensions/creating-a-copilot-extension/creating-a-github-app-for-your-copilot-extension

## Configure your GH App to communicate with your agent
In order to have your app to be able to communicate with your agent, you need to setup your app capabilities to be `Agent`, and to point the app `callback url` to point to your exposed app port in the last part of usage instructions.
https://docs.github.com/en/copilot/building-copilot-extensions/creating-a-copilot-extension/configuring-your-github-app-for-your-copilot-extension
