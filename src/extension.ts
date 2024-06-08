// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { StatusBar } from "./StatusBar";
import {
  Achievement,
  getAchievements,
  checkForCompletion,
  resetAchievements,
} from "./achievements";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("Gamify Plugin is activated");
  let achievements = getAchievements(
    context.globalState.get<Array<Achievement>>("Achievements")
  );
  // Initiate StatusBar
  const statusBar = new StatusBar("Achievements", "achievements.achievements");

  vscode.workspace.onDidChangeTextDocument((event) => {
    event.contentChanges.forEach((change) => {
      checkForCompletion(
        achievements,
        context,
        statusBar,
        change,
        event.document
      );
    });
  });

  // The command has been defined in the package.json file
  let resetAchievementsCommand = vscode.commands.registerCommand(
    "gamify.resetAchievements",
    () => {
      achievements = resetAchievements(context);
    }
  );
  context.subscriptions.push(resetAchievementsCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
