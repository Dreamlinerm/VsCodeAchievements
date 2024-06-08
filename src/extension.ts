// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("Gamify Plugin is activated");
  let GlobalChangedLines = parseInt(
    context.globalState.get("changedLines") ?? "0"
  );
  let achievements: { "1000LinesChanged": boolean } = context.globalState.get(
    "achievements"
  ) ?? {
    "1000LinesChanged": false,
  };
  let localChangedLines = 0;
  vscode.workspace.onDidChangeTextDocument((event) => {
    event.contentChanges.forEach((change) => {
      const newLines = change.text.split("\n").length - 1;
      if (newLines > 0) {
        GlobalChangedLines += newLines;
        // save newLines to extension state
        context.globalState.update("changedLines", localChangedLines);
        // vscode.window.showInformationMessage(`Added ${newLines} new line(s)`);
        //--------------     Feedback     ----------------
        // 100 lines written
        // if changedLines+Newlines go over a multiple of 100, show a message
        if (
          Math.floor((localChangedLines + newLines) / 100) !==
          Math.floor(localChangedLines / 100)
        ) {
          vscode.window.showInformationMessage(`100 lines written🎉`);
        }
        //--------------     Achievements     ----------------
        if (localChangedLines + newLines > 1000) {
          vscode.window.showInformationMessage(
            `Achievement unlocked: 1000 lines written🏆`
          );
          achievements["1000LinesChanged"] = true;
          context.globalState.update("achievements", achievements);
        }

        vscode.window.showInformationMessage(
          `Changed ${localChangedLines} lines`
        );
      }
    });
  });

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const command = vscode.commands.registerCommand("gamify.helloWorld", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage("Hello World from Gamify!");
  });
  let copyTextCommand = vscode.commands.registerCommand(
    "gamify.copyText",
    () => {
      vscode.window.showInformationMessage("Copy Text");
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No active text editor");
        return;
      }
      // console log all the text in the editor
      const text = editor.document.getText();
      console.log(text);
    }
  );
  context.subscriptions.push(command, copyTextCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
