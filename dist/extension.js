/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(__webpack_require__(1));
const achievements_1 = __webpack_require__(2);
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log("Gamify Plugin is activated");
    let achievements = (0, achievements_1.getAchievements)(context.globalState.get("Achievements"));
    vscode.workspace.onDidChangeTextDocument((event) => {
        event.contentChanges.forEach((change) => {
            (0, achievements_1.checkForCompletion)(achievements, context, change, event.document);
        });
    });
    // The command has been defined in the package.json file
    let resetAchievementsCommand = vscode.commands.registerCommand("gamify.resetAchievements", () => {
        achievements = (0, achievements_1.resetAchievements)(context);
    });
    context.subscriptions.push(resetAchievementsCommand);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resetAchievements = exports.getAchievements = exports.checkForCompletion = exports.Achievement = void 0;
const vscode = __importStar(__webpack_require__(1));
class Achievement {
    name;
    description;
    done;
    checkCondition;
    constructor(name, description, done, checkCondition) {
        this.name = name;
        this.description = description;
        this.done = done;
        this.checkCondition = checkCondition;
    }
    async finished(context, achievements
    // statusBar: StatusBar
    ) {
        this.done = true;
        // statusBar.notify();
        let answer = await vscode.window.showInformationMessage(`✔ ${this.name}`, "Show Achievements");
        // if (answer === "Show Achievements") {
        //     AchievementPanel.createOrShow(context.extensionUri, achievements, statusBar);
        // }
    }
}
exports.Achievement = Achievement;
// Check wether an achievement is done
function checkForCompletion(achievements, context, change, doc) {
    let GlobalChangedLines = parseInt(context.globalState.get("changedLines") ?? "0");
    achievements.forEach((achievement) => {
        // If the condition is true and the achievement isn't done
        if (achievement.done)
            return;
        if (achievement.name == "First steps" && change) {
            const newLines = change.text.split("\n").length - 1;
            if (achievement.checkCondition(context, newLines, GlobalChangedLines)) {
                achievement.finished(context, achievements);
            }
        }
        else if (achievement.checkCondition(change, doc)) {
            achievement.finished(context, achievements);
        }
    });
    // Update the keys
    context.globalState.update("Achievements", achievements);
}
exports.checkForCompletion = checkForCompletion;
let achievements = [
    new Achievement("Welcome!", "Thank you for downloading the Achievements extension!", false, () => {
        // TODO: set to true
        return false;
    }),
    new Achievement("First steps", "1000 lines written", false, (context, newLines, GlobalChangedLines) => {
        if (newLines > 0) {
            GlobalChangedLines += newLines;
            // save newLines to extension state
            context.globalState.update("changedLines", GlobalChangedLines);
            return GlobalChangedLines > 1000;
        }
        return false;
    }),
    new Achievement("Hello World Explorer", "Write your first “Hello, World!” program in a new language.", false, (change, doc) => {
        // regex line includes console.log and Hello World
        const line = doc.lineAt(change.range.start.line).text;
        return line.match(/console\.log\(.*Hello.* World.*\)/) !== null;
    }),
    new Achievement("Function Novice", "Write your first Function", false, () => {
        return false;
    }),
    new Achievement("Recursive Ruler", "Write a recursive function", false, () => {
        return false;
    }),
    new Achievement("Class Novice", "Write your first Class", false, () => {
        return false;
    }),
    new Achievement("Kartograph", "Use the first map data type in your code", false, () => {
        return false;
    }),
    new Achievement("Mapper", "Use the first map function in your code", false, () => {
        return false;
    }),
    new Achievement("Filterer", "Use the first filter function in your code", false, () => {
        return false;
    }),
    new Achievement("Reducer", "Use the first reduce function in your code", false, () => {
        return false;
    }),
    new Achievement("Regex Sorcerer", "Write complex regex", false, () => {
        return false;
    }),
    new Achievement("Why pack when you can unpack?", "Unpack a variable", false, () => {
        return false;
    }),
    new Achievement("String Splitter", "Split a string into an array of substrings", false, () => {
        return false;
    }),
    new Achievement("Parallel Universe", "Create a asynchronous function", false, () => {
        return false;
    }),
    new Achievement("Promise Keeper", "Use a promise", false, () => {
        return false;
    }),
    new Achievement("Commentator", "Commenting your code", false, () => {
        return false;
    }),
    new Achievement("Documentation Dynamo", "Write clear, concise documentation for your project.", false, () => {
        return false;
    }),
    new Achievement("Code Minimization Guru", "Minimize code length while maintaining readability.", false, () => {
        return false;
    }),
    new Achievement("Code Minimization Guru", "Minimize code length while maintaining readability.", false, () => {
        return false;
    }),
    new Achievement("Shorthand Master", "Writing a shorthand if", false, () => {
        return false;
    }),
    new Achievement("Switcheroo!", "Using a switch instead of else if", false, () => {
        return false;
    }),
    new Achievement("But Why???", "Bit manipulation operator used", false, () => {
        return false;
    }),
    new Achievement("Magic Numbers", "Using a magic number", false, () => {
        return false;
    }),
    // TODO Harder achievements
    new Achievement("Error Eliminator", "Debug and resolve a runtime error.", false, () => {
        return false;
    }),
    new Achievement("Optimization Expert", "Optimize your code for speed and efficiency.", false, () => {
        return false;
    }),
    new Achievement("Syntax Sleuth", "Successfully debug a cryptic syntax error.", false, () => {
        return false;
    }),
    new Achievement("Version Control Virtuoso", "Master Git commands and resolve merge conflicts.", false, () => {
        return false;
    }),
    new Achievement("Refactoring Wizard", "Transform spaghetti code into elegant, modular functions.", false, () => {
        return false;
    }),
];
function getAchievements(obj) {
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
exports.getAchievements = getAchievements;
function resetAchievements(context) {
    context.globalState.update("Achievements", "");
    vscode.window.showInformationMessage("Reset Achievements");
    return achievements.map((achievement) => {
        achievement.done = false;
        return achievement;
    });
}
exports.resetAchievements = resetAchievements;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map