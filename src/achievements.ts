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
    new Achievement("First steps", "1000 lines written", false, () => {
      return true;
    }),
    new Achievement(
      "Hello World Explorer",
      "Write your first “Hello, World!” program in a new language.",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "Function Novice",
      "Write your first Function",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "Recursive Ruler",
      "Write a recursive function",
      false,
      () => {
        return true;
      }
    ),
    new Achievement("Class Novice", "Write your first Class", false, () => {
      return true;
    }),
    new Achievement(
      "Kartograph",
      "Use the first map data type in your code",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "Mapper",
      "Use the first map function in your code",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "Filterer",
      "Use the first filter function in your code",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "Reducer",
      "Use the first reduce function in your code",
      false,
      () => {
        return true;
      }
    ),
    new Achievement("Regex Sorcerer", "Write complex regex", false, () => {
      return true;
    }),
    new Achievement(
      "Why pack when you can unpack?",
      "Unpack a variable",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "String Splitter",
      "Split a string into an array of substrings",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "Parallel Universe",
      "Create a asynchronous function",
      false,
      () => {
        return true;
      }
    ),
    new Achievement("Promise Keeper", "Use a promise", false, () => {
      return true;
    }),
    new Achievement("Commentator", "Commenting your code", false, () => {
      return true;
    }),
    new Achievement(
      "Documentation Dynamo",
      "Write clear, concise documentation for your project.",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "Code Minimization Guru",
      "Minimize code length while maintaining readability.",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "Code Minimization Guru",
      "Minimize code length while maintaining readability.",
      false,
      () => {
        return true;
      }
    ),
    new Achievement("Shorthand Master", "Writing a shorthand if", false, () => {
      return true;
    }),
    new Achievement(
      "Switcheroo!",
      "Using a switch instead of else if",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "But Why???",
      "Bit manipulation operator used",
      false,
      () => {
        return true;
      }
    ),
    new Achievement("Magic Numbers", "Using a magic number", false, () => {
      return true;
    }),

    // TODO Harder achievements
    new Achievement(
      "Error Eliminator",
      "Debug and resolve a runtime error.",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "Optimization Expert",
      "Optimize your code for speed and efficiency.",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "Syntax Sleuth",
      "Successfully debug a cryptic syntax error.",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "Version Control Virtuoso",
      "Master Git commands and resolve merge conflicts.",
      false,
      () => {
        return true;
      }
    ),
    new Achievement(
      "Refactoring Wizard",
      "Transform spaghetti code into elegant, modular functions.",
      false,
      () => {
        return true;
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
