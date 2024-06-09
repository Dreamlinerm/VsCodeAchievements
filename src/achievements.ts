import * as vscode from "vscode";
import { AchievementPanel } from "./AchievementPanel";
export class Achievement {
  name!: string;
  description!: string;
  done!: boolean;
  fileTypes!: Array<string>;
  checkCondition!: any;

  constructor(
    name: string,
    description: string,
    done: boolean,
    fileTypes: Array<string>,
    checkCondition: any
  ) {
    this.name = name;
    this.description = description;
    this.done = done;
    this.fileTypes = fileTypes;
    this.checkCondition = checkCondition;
  }

  async finished(
    context: vscode.ExtensionContext,
    achievements: Array<Achievement>
  ): Promise<void> {
    this.done = true;
    let answer = await vscode.window.showInformationMessage(
      `✅🏆 ${this.name}`,
      "Show Achievements"
    );
    if (answer === "Show Achievements") {
      AchievementPanel.createOrShow(context.extensionUri, achievements);
    }
  }
}

// Check wether an achievement is done
export function checkForCompletion(
  achievements: Array<Achievement>,
  context: vscode.ExtensionContext,
  fileType: string,
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
    if (!achievement.fileTypes.includes(fileType)) return;
    if (achievement.name === "First steps" && change) {
      const newLines = change.text.split("\n").length - 1;
      if (achievement.checkCondition(context, newLines, GlobalChangedLines)) {
        achievement.finished(context, achievements);
      }
    } else if (achievement.checkCondition(line, fileType)) {
      achievement.finished(context, achievements);
    }
  });
  // Update the keys
  context.globalState.update("Achievements", achievements);
}
const allJavaScript = [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact",
  "vue",
];
const allHTML = ["html", "vue"];
let achievements = [
  new Achievement(
    "Welcome!",
    "Thank you for downloading the Achievements extension!",
    false,
    [...allJavaScript, ...allHTML],
    () => {
      return true;
    }
  ),
  new Achievement(
    "Hello World Explorer",
    "Write your first “Hello, World!” program in a new language.",
    false,
    [...allJavaScript, ...allHTML, "python"],
    (line: string) => {
      return line.match(/.*Hello.* World.*\)/g) !== null;
    }
  ),
  new Achievement(
    "Function Novice",
    "Write your first Function",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      if (fileType === "python") return line.includes("def");
      else return line.includes("function");
    }
  ),
  new Achievement(
    "Class Novice",
    "Write your first Class",
    false,
    [...allJavaScript, "python"],
    (line: string) => {
      return line.includes("class");
    }
  ),
  new Achievement(
    "Filter Fanatic",
    "Use the first map function in your code",
    false,
    [...allJavaScript, "python"],
    (line: string) => {
      return line.includes("map(");
    }
  ),
  new Achievement(
    "Filter Fanatic",
    "Use the first filter function in your code",
    false,
    [...allJavaScript, "python"],
    (line: string) => {
      return line.includes("filter(");
    }
  ),
  new Achievement(
    "Map reduced",
    "Use the first reduce function in your code",
    false,
    [...allJavaScript, "python"],
    (line: string) => {
      return line.includes(".reduce(");
    }
  ),
  new Achievement(
    "Regex Sorcerer",
    "Write complex regex, which is longer than 9 characters",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      // use complicated regex
      if (fileType === "python")
        return line.match(/re.*\(..{10,}.\)/g) !== null;
      else return line.match(/new RegExp\(..{10,}.\)/g) !== null;
    }
  ),
  new Achievement(
    "String Splitter",
    "Split a string into an array of substrings",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      return line.includes(".split(");
    }
  ),
  new Achievement(
    "What's your comment?",
    "Commenting on your code",
    false,
    [...allJavaScript, ...allHTML, "python"],
    (line: string, fileType: string) => {
      if (allJavaScript.includes(fileType)) return line.includes("//");
      else if (fileType === "python") return line.includes("#");
      else return line.includes("<!--");
    }
  ),
  new Achievement(
    "Shorthand Master",
    "Writing a shorthand if",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      if (fileType === "python")
        return line.includes("if") && line.includes("else");
      else return line.match(/.*\?.*:/g) !== null;
    }
  ),
  new Achievement(
    "Switcheroo!",
    "Using a switch instead of else if",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      if (fileType === "python") return line.includes("case");
      else return line.includes("switch");
    }
  ),
  new Achievement(
    "Bit by Bit",
    "Bit manipulation operator used",
    false,
    [...allJavaScript, "python"],
    (line: string) => {
      return [" & ", " | ", "^", "~", "<<", ">>"].some((exp) => {
        if (line.includes(exp)) return true;
      });
    }
  ),
  new Achievement(
    "Magic Numbers",
    "Using a random number",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      if (fileType === "python") return line.includes("random");
      else return line.includes("Math.random(");
    }
  ),
  new Achievement(
    "LambDuh!",
    "Use a lambda function",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      if (fileType === "python") return line.includes("lambda");
      else return line.match(/=.*\(.*\).*=>/g);
    }
  ),
  new Achievement(
    "Line by Line",
    "10000 lines written",
    false,
    [...allJavaScript, ...allHTML, "python"],
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
  // TODO: Harder achievements to implement
  // new Achievement(
  //   "Code Minimization Guru",
  //   "Minimize code length while maintaining readability.",
  //   false,
  //   allJavaScript,
  //   () => {
  //     return false;
  //   }
  // ),
  // TODO:
  // new Achievement(
  //   "Recursive Ruler",
  //   "Write a recursive function",
  //   false,
  //   allJavaScript,
  //   () => {
  //     return true;
  //   }
  // ),
  // new Achievement(
  //   "Error Eliminator",
  //   "Debug and resolve a runtime error.",
  //   false,
  // allJavaScript,
  //   () => {
  //     return false;
  //   }
  // ),
  // new Achievement(
  //   "Optimization Expert",
  //   "Optimize your code for speed and efficiency.",
  //   false,
  //   allJavaScript,
  //   () => {
  //     return false;
  //   }
  // ),
  // new Achievement(
  //   "Syntax Sleuth",
  //   "Successfully debug a cryptic syntax error.",
  //   false,
  //   allJavaScript,
  //   () => {
  //     return false;
  //   }
  // ),
  // new Achievement(
  //   "Version Control Virtuoso",
  //   "Master Git commands and resolve merge conflicts.",
  //   false,
  //   allJavaScript,
  //   () => {
  //     return false;
  //   }
  // ),
  // new Achievement(
  //   "Refactoring Wizard",
  //   "Transform spaghetti code into elegant, modular functions.",
  //   false,
  //   allJavaScript,
  //   () => {
  //     return false;
  //   }
  // ),
  // JavaScript Achievements
  new Achievement(
    "Cartograph",
    "Use the first map data type in your code",
    false,
    allJavaScript,
    (line: string) => {
      return line.includes("new Map(");
    }
  ),
  new Achievement(
    "Spread the Joy",
    "Unpack a variable with ...",
    false,
    allJavaScript,
    (line: string) => {
      return line.includes("...");
    }
  ),
  new Achievement(
    "Parallel Universe",
    "Create a asynchronous function",
    false,
    allJavaScript,
    (line: string) => {
      return line.includes("async");
    }
  ),
  new Achievement(
    "Promise Keeper",
    "Use a promise",
    false,
    allJavaScript,
    (line: string) => {
      return line.includes("new Promise(");
    }
  ),
  new Achievement(
    "Documentation Dynamo",
    "Write a JSDoc comment",
    false,
    allJavaScript,
    (line: string) => {
      return line.includes("@param") || line.includes("@returns");
    }
  ),
  // HTML Achievements
  new Achievement(
    "HTML Hero",
    "Write your first HTML program",
    false,
    allHTML,
    () => {
      return true;
    }
  ),
  new Achievement(
    "Tag Customizer",
    "Create a custom HTML tag",
    false,
    allHTML,
    (line: string) => {
      return line.match(/<.*[^-]-[^-].*>/g) !== null;
    }
  ),
  new Achievement(
    "Pixel Picasso",
    "Show an image or svg",
    false,
    allHTML,
    (line: string) => {
      return line.includes("<img") || line.includes("<svg");
    }
  ),
  new Achievement(
    "The missing link",
    "Create a hyperlink",
    false,
    allHTML,
    (line: string) => {
      return line.includes("<a");
    }
  ),
  new Achievement(
    "List Lover",
    "Create a list",
    false,
    allHTML,
    (line: string) => {
      return line.includes("<ul") || line.includes("<ol");
    }
  ),
  new Achievement(
    "Table Turner",
    "Create a table",
    false,
    allHTML,
    (line: string) => {
      return line.includes("<table");
    }
  ),
  new Achievement(
    "Frame it!",
    "Include an iframe",
    false,
    allHTML,
    (line: string) => {
      return line.includes("<iframe");
    }
  ),
  // python
  new Achievement(
    "Pythonic",
    "Write your first Python program",
    false,
    ["python"],
    (line: string) => {
      return true;
    }
  ),
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
