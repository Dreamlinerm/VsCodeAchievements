import * as vscode from "vscode";
import { StatusBar } from "./StatusBar";
import { AchievementPanel } from "./AchievementPanel";
export class Achievement {
  name!: string;
  description!: string;
  done!: boolean;
  checkCondition!: any;
  fresh!: boolean;

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
    achievements: Array<Achievement>,
    statusBar: StatusBar
  ): Promise<void> {
    this.done = true;
    this.fresh = true;
    statusBar.notify();
    let answer = await vscode.window.showInformationMessage(
      `✔ ${this.name}`,
      "Show Achievements"
    );
    if (answer === "Show Achievements") {
      AchievementPanel.createOrShow(
        context.extensionUri,
        achievements,
        statusBar
      );
    }
  }
}

// Check wether an achievement is done
export function checkForCompletion(
  achievements: Array<Achievement>,
  context: vscode.ExtensionContext,
  statusBar: StatusBar,
  change: vscode.TextDocumentContentChangeEvent,
  doc: vscode.TextDocument
) {
  let GlobalChangedLines = parseInt(
    context.globalState.get("changedLines") ?? "0"
  );
  const line = doc.lineAt(change.range.start.line).text;
  achievements.forEach((achievement) => {
    // If the condition is true and the achievement isn't done
    if (achievement.done) return;
    if (achievement.name == "First steps" && change) {
      const newLines = change.text.split("\n").length - 1;
      if (achievement.checkCondition(context, newLines, GlobalChangedLines)) {
        achievement.finished(context, achievements, statusBar);
      }
    } else if (achievement.checkCondition(change, line)) {
      achievement.finished(context, achievements, statusBar);
    }
  });
  // Update the keys
  context.globalState.update("Achievements", achievements);
}
let achievements = [
  new Achievement(
    "Welcome!",
    "Thank you for downloading the Achievements extension!",
    false,
    () => {
      // TODO: set to true
      return false;
    }
  ),
  new Achievement(
    "Hello World Explorer",
    "Write your first “Hello, World!” program in a new language.",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      // regex line includes console.log and Hello World
      return line.match(/console\.log\(.*Hello.* World.*\)/g) !== null;
    }
  ),
  new Achievement(
    "Function Novice",
    "Write your first Function",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      return line.includes("function");
    }
  ),
  // TODO:
  new Achievement(
    "Recursive Ruler",
    "Write a recursive function",
    false,
    () => {
      return true;
    }
  ),
  new Achievement(
    "Class Novice",
    "Write your first Class",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      return line.includes("class");
    }
  ),
  new Achievement(
    "Cartograph",
    "Use the first map data type in your code",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      return line.includes("new Map(");
    }
  ),
  new Achievement(
    "Map reduced",
    "Use the first map function in your code",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      return line.includes(".map(");
    }
  ),
  new Achievement(
    "Filter Fanatic",
    "Use the first filter function in your code",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      return line.includes(".filter(");
    }
  ),
  new Achievement(
    "Don't reduce, reuse!",
    "Use the first reduce function in your code",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      return line.includes(".reduce(");
    }
  ),
  new Achievement(
    "Regex Sorcerer",
    "Write complex regex, which is longer than 9 characters",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      // use complicated regex
      return line.match(/new RegExp\(..{10,}.\)/g) !== null;
    }
  ),
  new Achievement(
    "Spread the Joy",
    "Unpack a variable with ...",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      return line.includes("...");
    }
  ),
  new Achievement(
    "String Splitter",
    "Split a string into an array of substrings",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      return line.includes(".split(");
    }
  ),
  new Achievement(
    "Parallel Universe",
    "Create a asynchronous function",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      return line.includes("async");
    }
  ),
  new Achievement(
    "Promise Keeper",
    "Use a promise",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      return line.includes("new Promise(");
    }
  ),
  new Achievement(
    "What's your comment?",
    "Commenting on your code",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      return line.includes("//");
    }
  ),
  // TODO:
  // new Achievement(
  //   "Documentation Dynamo",
  //   "Write clear, concise documentation for your project.",
  //   false,
  //   () => {
  //     return false;
  //   }
  // ),
  // TODO:
  // new Achievement(
  //   "Code Minimization Guru",
  //   "Minimize code length while maintaining readability.",
  //   false,
  //   () => {
  //     return false;
  //   }
  // ),
  new Achievement(
    "Shorthand Master",
    "Writing a shorthand if",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      return line.match(/.*\?.*:/g) !== null;
    }
  ),
  new Achievement(
    "Switcheroo!",
    "Using a switch instead of else if",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      return line.includes("switch");
    }
  ),
  new Achievement(
    "Bit by Bit",
    "Bit manipulation operator used",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      const expressions = [" & ", " | ", "^", "~", "<<", ">>"];
      return expressions.some((exp) => {
        if (line.includes(exp)) {
          return true;
        }
      });
    }
  ),
  new Achievement(
    "Magic Numbers",
    "Using a random number",
    false,
    (change: vscode.TextDocumentContentChangeEvent, line: string) => {
      return line.includes("Math.random(");
    }
  ),
  new Achievement(
    "Line by Line",
    "10000 lines written",
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
        return GlobalChangedLines > 10000;
      }
      return false;
    }
  ),
  // TODO: Harder achievements
  // new Achievement(
  //   "Error Eliminator",
  //   "Debug and resolve a runtime error.",
  //   false,
  //   () => {
  //     return false;
  //   }
  // ),
  // new Achievement(
  //   "Optimization Expert",
  //   "Optimize your code for speed and efficiency.",
  //   false,
  //   () => {
  //     return false;
  //   }
  // ),
  // new Achievement(
  //   "Syntax Sleuth",
  //   "Successfully debug a cryptic syntax error.",
  //   false,
  //   () => {
  //     return false;
  //   }
  // ),
  // new Achievement(
  //   "Version Control Virtuoso",
  //   "Master Git commands and resolve merge conflicts.",
  //   false,
  //   () => {
  //     return false;
  //   }
  // ),
  // new Achievement(
  //   "Refactoring Wizard",
  //   "Transform spaghetti code into elegant, modular functions.",
  //   false,
  //   () => {
  //     return false;
  //   }
  // ),
];

export function getAchievements(
  obj?: Array<Achievement> | undefined
): Array<Achievement> {
  // If there is no initial object declared
  if (!obj) {
    return achievements;
  }

  // Set the achievements to the state they were in the save
  return achievements.map((achievement) => {
    let item = obj.find((k) => k.name === achievement.name);
    if (item !== undefined) {
      achievement.done = item.done;
    }
    return achievement;
  });
}
export function accomplishedAchievements(achievements: Array<Achievement>) {
  return achievements.filter((achievement) => achievement.done);
}
export function resetAchievements(context: vscode.ExtensionContext) {
  context.globalState.update("Achievements", "");
  vscode.window.showInformationMessage("Reset Achievements");
  return achievements.map((achievement) => {
    achievement.done = false;
    return achievement;
  });
}
