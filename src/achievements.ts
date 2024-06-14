import * as vscode from "vscode";
import { AchievementPanel } from "./AchievementPanel";
export class Achievement {
  id!: string;
  name!: string;
  description!: string;
  done!: boolean;
  fileTypes!: Array<string>;
  fileTypeCategory!: string;
  checkCondition!: any;

  constructor(
    id: string,
    name: string,
    description: string,
    done: boolean,
    fileTypes: Array<string>,
    checkCondition: any,
    fileTypeCategory?: string
  ) {
    // used to check the achievement if title etc. changes
    // now can change everything including position
    this.id = id;
    this.name = name;
    this.description = description;
    this.done = done;
    this.fileTypes = fileTypes;
    this.checkCondition = checkCondition;
    this.fileTypeCategory = fileTypeCategory ?? fileTypes.join(", ");
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
    if (achievement.name === "Line by Line" && change) {
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

export function getAchievements(
  obj?: Array<Achievement> | undefined
): Array<Achievement> {
  // If there is no initial object declared
  if (!obj) {
    return achievements;
  }

  // Set the achievements to the state they were in the save
  return achievements.map((achievement) => {
    let item = obj.find((k) => k.id === achievement.id);
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

const allJavaScript = [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact",
  "vue",
];
const allHTML = ["html", "vue"];
function includesSome(line: string, str: string[]) {
  // indexOf is faster than includes
  return str.some((s) => line.indexOf(s) !== -1);
}
function includesEvery(line: string, str: string[]) {
  // indexOf is faster than includes
  return str.every((s) => line.indexOf(s) !== -1);
}

let achievements = [
  new Achievement(
    "0054c520-2606-4669-90cf-ad8f6d1dc473",
    "Hello World Explorer",
    "Write your first “Hello, World!” program in a new language.",
    false,
    [...allJavaScript, ...allHTML, "python"],
    (line: string) => {
      return line.match(/.*Hello.* World.*/g) !== null;
    },
    "All supported"
  ),
  new Achievement(
    "d7c15280-8d83-4212-8548-7d5e2cb4debf",
    "Function Novice",
    "Write your first Function",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      if (fileType === "python") return includesSome(line, ["def"]);
      else return includesSome(line, ["function"]);
    },
    "All supported"
  ),
  new Achievement(
    "276989cb-f564-426e-97bf-8876d7232cd9",
    "Class Novice",
    "Write your first Class",
    false,
    [...allJavaScript, "python"],
    (line: string) => {
      return includesSome(line, ["class"]);
    },
    "All supported"
  ),
  new Achievement(
    "552c7305-d31b-4048-989d-dd165786e8e1",
    "Mapper",
    "Use the first map function in your code",
    false,
    [...allJavaScript, "python"],
    (line: string) => {
      return includesSome(line, ["map("]);
    },
    "All supported"
  ),
  new Achievement(
    "66191a48-daa5-4395-b862-37ebe0be8fb0",
    "Filter Fanatic",
    "Use the first filter function in your code",
    false,
    [...allJavaScript, "python"],
    (line: string) => {
      return includesSome(line, ["filter("]);
    },
    "All supported"
  ),
  new Achievement(
    "4a837b09-2d4e-43c3-b9b7-f81a962b404e",
    "Map reduced",
    "Use the first reduce function in your code",
    false,
    [...allJavaScript, "python"],
    (line: string) => {
      return includesSome(line, [".reduce("]);
    },
    "All supported"
  ),
  new Achievement(
    "8a15e34c-4bc5-4ca5-91ec-dde41dd28df3",
    "Regex Sorcerer",
    "Write complex regex, which is longer than 9 characters",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      // use complicated regex
      if (fileType === "python")
        return line.match(/re.*\(..{10,}.\)/g) !== null;
      else return line.match(/new RegExp\(..{10,}.\)/g) !== null;
    },
    "All supported"
  ),
  new Achievement(
    "f019624-c3fc-4fe6-9982-a08ec93bf423",
    "String Splitter",
    "Split a string into an array of substrings",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      return includesSome(line, [".split("]);
    },
    "All supported"
  ),
  new Achievement(
    "e1270905-6334-4404-84dc-a41e553d8a79",
    "What's your comment?",
    "Commenting on your code",
    false,
    [...allJavaScript, ...allHTML, "python"],
    (line: string, fileType: string) => {
      if (allJavaScript.includes(fileType)) return includesSome(line, ["//"]);
      else if (fileType === "python") return includesSome(line, ["#"]);
      else return includesSome(line, ["<!--"]);
    },
    "All supported"
  ),
  new Achievement(
    "e1270905-6334-4404-84dc-a41e553d8a79",
    "Shorthand Master",
    "Writing a shorthand if",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      if (fileType === "python") return includesEvery(line, ["if", "else"]);
      else return line.match(/.*\?.*:/g) !== null;
    },
    "All supported"
  ),
  new Achievement(
    "602d1d62-7080-437c-9f3c-9829a418395d",
    "Switcheroo!",
    "Using a switch instead of else if",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      if (fileType === "python") return includesSome(line, ["case"]);
      else return includesSome(line, ["switch"]);
    },
    "All supported"
  ),
  new Achievement(
    "17318c44-feb4-498a-b92e-6a83f9218c32",
    "Bit by Bit",
    "Bit manipulation operator used",
    false,
    [...allJavaScript, "python"],
    (line: string) => {
      return includesSome(line, ["&", "|", "^", "~", "<<", ">>"]);
    },
    "All supported"
  ),
  new Achievement(
    "8f2a5ec4-198e-432a-9810-0e7aab353698",
    "Magic Numbers",
    "Using a random number",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      if (fileType === "python") return includesSome(line, ["random"]);
      else return includesSome(line, ["Math.random("]);
    },
    "All supported"
  ),
  new Achievement(
    "12b5c2c0-9aab-4fa1-bfef-db20928c8cf8",
    "LambDuh!",
    "Use a lambda function",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      if (fileType === "python") return includesSome(line, ["lambda"]);
      else return line.match(/=.*\(.*\).*=>/g);
    },
    "All supported"
  ),
  new Achievement(
    "7a11106c-5868-4971-bc20-1f6f920d94a8",
    "Except for that...",
    "Write try catch/except block",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      if (fileType === "python") return includesSome(line, ["except"]);
      else return includesSome(line, ["catch"]);
    },
    "All supported"
  ),
  new Achievement(
    "0f669df5-ec73-41f3-a0ea-154baad3e03c",
    "File scripters",
    "Writing/opening a file",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      if (fileType === "python") return includesSome(line, ["open", ".write"]);
      else return includesSome(line, ["require('fs')"]);
    },
    "All supported"
  ),
  new Achievement(
    "79f60984-43c6-456b-af49-82cfc3462699",
    "Duplicate Eliminator",
    "Remove duplicates from a list",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      if (fileType === "python") {
        return (
          includesSome(line, ["list(set("]) ||
          includesEvery(line, ["list(", ".fromkeys("])
        );
      } else return includesSome(line, ["[...new Set("]);
    },
    "All supported"
  ),
  new Achievement(
    "66c1f2e7-008b-4013-b6f8-014e553ce833",
    "Deep Copy Cat",
    "Deep clone an object",
    false,
    [...allJavaScript, "python"],
    (line: string, fileType: string) => {
      if (fileType === "python") return includesSome(line, ["copy.deepcopy("]);
      else
        return includesSome(line, [
          "JSON.parse(JSON.stringify(",
          "structuredClone(",
        ]);
    },
    "All supported"
  ),
  new Achievement(
    "690424a0-dd94-4663-8c38-9198417be645",
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
    },
    "All supported"
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
    "543eac4f-6c53-4b97-ae5f-229919faefc0",
    "JS connoisseur",
    "Write your first JavaScript program",
    false,
    allJavaScript,
    () => {
      return true;
    }
  ),
  new Achievement(
    "c6db06d0-0a47-4f37-8dab-2879ebfbd6e6",
    "Cartograph",
    "Use the first map data type in your code",
    false,
    allJavaScript,
    (line: string) => {
      return includesSome(line, ["new Map("]);
    }
  ),
  new Achievement(
    "bad81e57-1dcc-4fe4-8177-dddfa9444022",
    "Spread the Joy",
    "Unpack a variable with ...",
    false,
    allJavaScript,
    (line: string) => {
      return includesSome(line, ["..."]);
    }
  ),
  new Achievement(
    "3cb38afc-bdea-468f-a9b1-415b37a05ceb",
    "Parallel Universe",
    "Create a asynchronous function",
    false,
    allJavaScript,
    (line: string) => {
      return includesSome(line, ["async"]);
    }
  ),
  new Achievement(
    "1d34e095-c59b-4f39-9b4e-54403af28944",
    "Promise Keeper",
    "Use a promise",
    false,
    allJavaScript,
    (line: string) => {
      return includesSome(line, ["new Promise("]);
    }
  ),
  new Achievement(
    "3bc37b31-7439-4df0-a218-a2e37c5b80a9",
    "Documentation Dynamo",
    "Write a JSDoc comment",
    false,
    allJavaScript,
    (line: string) => {
      return includesSome(line, ["@param", "@returns"]);
    }
  ),
  // HTML Achievements
  new Achievement(
    "2f869a47-fec5-4b56-86ba-afc19d7e4f79",
    "HTML Hero",
    "Write your first HTML program",
    false,
    allHTML,
    () => {
      return true;
    }
  ),
  new Achievement(
    "c2dd5468-1674-4dc7-b207-6eaf95b7c528",
    "Tag Customizer",
    "Create a custom HTML tag",
    false,
    allHTML,
    (line: string) => {
      return line.match(/<.*[^-]-[^-].*>/g) !== null;
    }
  ),
  new Achievement(
    "6bf81a2a-24d0-4881-9b40-f66da8fc9a49",
    "Pixel Picasso",
    "Show an image or svg",
    false,
    allHTML,
    (line: string) => {
      return includesSome(line, ["<img", "<svg"]);
    }
  ),
  new Achievement(
    "14d7578e-d134-467c-bfc5-bb537864a31d",
    "The missing link",
    "Create a hyperlink",
    false,
    allHTML,
    (line: string) => {
      return includesSome(line, ["<a"]);
    }
  ),
  new Achievement(
    "52b55a14-3281-4dc4-8386-afcecf88cb96",
    "List Lover",
    "Create a list",
    false,
    allHTML,
    (line: string) => {
      return includesSome(line, ["<ul", "<ol"]);
    }
  ),
  new Achievement(
    "429e4c3e-f395-4f08-a06e-9fe7abe9e4d7",
    "Table Turner",
    "Create a table",
    false,
    allHTML,
    (line: string) => {
      return includesSome(line, ["<table"]);
    }
  ),
  new Achievement(
    "fbb6e27a-a003-4ea7-8cb0-5e580bd75451",
    "Frame it!",
    "Include an iframe",
    false,
    allHTML,
    (line: string) => {
      return includesSome(line, ["<iframe"]);
    }
  ),
  // python
  new Achievement(
    "52e39100-5731-4aa8-b280-ac42ce5f41e1",
    "Pythonic",
    "Write your first Python program",
    false,
    ["python"],
    (line: string) => {
      return true;
    }
  ),
  new Achievement(
    "7e6f3e4b-5f9a-4c5e-9f3b-9e1d2e3b4b3b",
    "Numbers are not good enough",
    "Use NumPy Module",
    false,
    ["python"],
    (line: string) => {
      return includesSome(line, ["numpy", "np."]);
    }
  ),
  new Achievement(
    "f2c7e2b3-3e1d-4d8d-8a5f-0e2b2b8b7b7b",
    "Pandas Pandemonium",
    "Use Pandas Module",
    false,
    ["python"],
    (line: string) => {
      return includesSome(line, ["pandas", "pd."]);
    }
  ),
];
