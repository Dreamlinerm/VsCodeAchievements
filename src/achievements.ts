import * as vscode from "vscode";
export class Achievement {
  name!: string;
  description!: string;
  done!: boolean;
  checkCondition!: any;

  constructor(
    name: string,
    description: string,
    done: boolean,
    checkCondition: any
  ) {
    this.name = name;
    this.description = description;
    this.done = done;
    this.checkCondition = checkCondition;
  }

  async finished(
    context: vscode.ExtensionContext,
    achievements: Array<Achievement>
    // statusBar: StatusBar
  ): Promise<void> {
    this.done = true;
    // statusBar.notify();
    let answer = await vscode.window.showInformationMessage(
      `✔ ${this.name}`,
      "Show Achievements"
    );
    // if (answer === "Show Achievements") {
    //     AchievementPanel.createOrShow(context.extensionUri, achievements, statusBar);
    // }
  }
}

// Check wether an achievement is done
export function checkForCompletion(
  achievements: Array<Achievement>,
  context: vscode.ExtensionContext,
  change?: vscode.TextDocumentContentChangeEvent
) {
  let GlobalChangedLines = parseInt(
    context.globalState.get("changedLines") ?? "0"
  );
  achievements.forEach((achievement) => {
    // If the condition is true and the achievement isn't done
    if (achievement.done) return;
    if (achievement.name == "First steps" && change) {
      const newLines = change.text.split("\n").length - 1;
      if (achievement.checkCondition(context, newLines, GlobalChangedLines)) {
        achievement.finished(context, achievements);
      }
    } else if (achievement.checkCondition(change)) {
      achievement.finished(context, achievements);
    }
  });
  // Update the keys
  context.globalState.update("Achievements", achievements);
}
let localChangedLines = 0;
export function getAchievements(
  obj?: Array<Achievement> | undefined
): Array<Achievement> {
  let achievements = [
    new Achievement(
      "Welcome!",
      "Thank you for downloading the Achievements extension!",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "First steps",
      "1000 lines written",
      false,
      (
        context: vscode.ExtensionContext,
        newLines: number,
        GlobalChangedLines: number
      ) => {
        if (newLines > 0) {
          GlobalChangedLines += newLines;
          // save newLines to extension state
          context.globalState.update("changedLines", GlobalChangedLines);
          vscode.window.showInformationMessage(
            `You have written ${GlobalChangedLines} lines of code🎉`
          );
          return GlobalChangedLines > 100;
        }
        return false;
      }
    ),
    new Achievement(
      "Hello World Explorer",
      "Write your first “Hello, World!” program in a new language.",
      false,
      () => {
        return false;
      }
    ),
    new Achievement(
      "Function Novice",
      "Write your first Function",
      false,
      () => {
        return false;
      }
    ),
    new Achievement(
      "Recursive Ruler",
      "Write a recursive function",
      false,
      () => {
        return false;
      }
    ),
    new Achievement("Class Novice", "Write your first Class", false, () => {
      return false;
    }),
    new Achievement(
      "Kartograph",
      "Use the first map data type in your code",
      false,
      () => {
        return false;
      }
    ),
    new Achievement(
      "Mapper",
      "Use the first map function in your code",
      false,
      () => {
        return false;
      }
    ),
    new Achievement(
      "Filterer",
      "Use the first filter function in your code",
      false,
      () => {
        return false;
      }
    ),
    new Achievement(
      "Reducer",
      "Use the first reduce function in your code",
      false,
      () => {
        return false;
      }
    ),
    new Achievement("Regex Sorcerer", "Write complex regex", false, () => {
      return false;
    }),
    new Achievement(
      "Why pack when you can unpack?",
      "Unpack a variable",
      false,
      () => {
        return false;
      }
    ),
    new Achievement(
      "String Splitter",
      "Split a string into an array of substrings",
      false,
      () => {
        return false;
      }
    ),
    new Achievement(
      "Parallel Universe",
      "Create a asynchronous function",
      false,
      () => {
        return false;
      }
    ),
    new Achievement("Promise Keeper", "Use a promise", false, () => {
      return false;
    }),
    new Achievement("Commentator", "Commenting your code", false, () => {
      return false;
    }),
    new Achievement(
      "Documentation Dynamo",
      "Write clear, concise documentation for your project.",
      false,
      () => {
        return false;
      }
    ),
    new Achievement(
      "Code Minimization Guru",
      "Minimize code length while maintaining readability.",
      false,
      () => {
        return false;
      }
    ),
    new Achievement(
      "Code Minimization Guru",
      "Minimize code length while maintaining readability.",
      false,
      () => {
        return false;
      }
    ),
    new Achievement("Shorthand Master", "Writing a shorthand if", false, () => {
      return false;
    }),
    new Achievement(
      "Switcheroo!",
      "Using a switch instead of else if",
      false,
      () => {
        return false;
      }
    ),
    new Achievement(
      "But Why???",
      "Bit manipulation operator used",
      false,
      () => {
        return false;
      }
    ),
    new Achievement("Magic Numbers", "Using a magic number", false, () => {
      return false;
    }),

    // TODO Harder achievements
    new Achievement(
      "Error Eliminator",
      "Debug and resolve a runtime error.",
      false,
      () => {
        return false;
      }
    ),
    new Achievement(
      "Optimization Expert",
      "Optimize your code for speed and efficiency.",
      false,
      () => {
        return false;
      }
    ),
    new Achievement(
      "Syntax Sleuth",
      "Successfully debug a cryptic syntax error.",
      false,
      () => {
        return false;
      }
    ),
    new Achievement(
      "Version Control Virtuoso",
      "Master Git commands and resolve merge conflicts.",
      false,
      () => {
        return false;
      }
    ),
    new Achievement(
      "Refactoring Wizard",
      "Transform spaghetti code into elegant, modular functions.",
      false,
      () => {
        return false;
      }
    ),
  ];
  // If there is no initial object declared
  if (obj === undefined) {
    return achievements;
  }

  // Set the achievements to the state they were in the save
  achievements.forEach((achievement) => {
    let item = obj.find((k) => k.name === achievement.name);
    if (item !== undefined) {
      achievement.done = item.done;
    }
  });
  return achievements;
}
