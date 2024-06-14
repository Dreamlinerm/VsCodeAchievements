// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  Achievement,
  getAchievements,
  checkForCompletion,
  resetAchievements,
} from "./achievements";
import { AchievementPanel } from "./AchievementPanel";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("Achievements Plugin is activated");
  let achievements = getAchievements(
    context.globalState.get<Array<Achievement>>("Achievements")
  );
  let timeout: NodeJS.Timeout | undefined;
  vscode.workspace.onDidChangeTextDocument((event) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      event.contentChanges.forEach((change) => {
        checkForCompletion(
          achievements,
          context,
          event.document.languageId,
          change,
          event.document
        );
      });
    }, 300); // 100ms debounce time
  });

  // The command has been defined in the package.json file
  let resetAchievementsCommand = vscode.commands.registerCommand(
    "achievements.resetAchievements",
    () => {
      achievements = resetAchievements(context);
    }
  );
  let showAchievementsCommand = vscode.commands.registerCommand(
    "achievements.showAchievements",
    () => {
      AchievementPanel.createOrShow(context.extensionUri, achievements);
    }
  );
  context.subscriptions.push(resetAchievementsCommand, showAchievementsCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
