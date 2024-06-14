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
const AchievementPanel_1 = __webpack_require__(3);
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log("Gamify Plugin is activated");
    let achievements = (0, achievements_1.getAchievements)(context.globalState.get("Achievements"));
    let timeout;
    vscode.workspace.onDidChangeTextDocument((event) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            event.contentChanges.forEach((change) => {
                (0, achievements_1.checkForCompletion)(achievements, context, event.document.languageId, change, event.document);
            });
        }, 300); // 100ms debounce time
    });
    // The command has been defined in the package.json file
    let resetAchievementsCommand = vscode.commands.registerCommand("gamify.resetAchievements", () => {
        achievements = (0, achievements_1.resetAchievements)(context);
    });
    let showAchievementsCommand = vscode.commands.registerCommand("gamify.showAchievements", () => {
        AchievementPanel_1.AchievementPanel.createOrShow(context.extensionUri, achievements);
    });
    context.subscriptions.push(resetAchievementsCommand, showAchievementsCommand);
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
exports.resetAchievements = exports.accomplishedAchievements = exports.getAchievements = exports.checkForCompletion = exports.Achievement = void 0;
const vscode = __importStar(__webpack_require__(1));
const AchievementPanel_1 = __webpack_require__(3);
class Achievement {
    id;
    name;
    description;
    done;
    fileTypes;
    fileTypeCategory;
    checkCondition;
    constructor(id, name, description, done, fileTypes, checkCondition, fileTypeCategory) {
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
    async finished(context, achievements) {
        this.done = true;
        let answer = await vscode.window.showInformationMessage(`✅🏆 ${this.name}`, "Show Achievements");
        if (answer === "Show Achievements") {
            AchievementPanel_1.AchievementPanel.createOrShow(context.extensionUri, achievements);
        }
    }
}
exports.Achievement = Achievement;
// Check wether an achievement is done
function checkForCompletion(achievements, context, fileType, change, doc) {
    let GlobalChangedLines = parseInt(context.globalState.get("changedLines") ?? "0");
    const line = doc.lineAt(change.range.start.line).text;
    achievements.forEach((achievement) => {
        // If the condition is true and the achievement isn't done
        if (achievement.done)
            return;
        if (!achievement.fileTypes.includes(fileType))
            return;
        if (achievement.name === "Line by Line" && change) {
            const newLines = change.text.split("\n").length - 1;
            if (achievement.checkCondition(context, newLines, GlobalChangedLines)) {
                achievement.finished(context, achievements);
            }
        }
        else if (achievement.checkCondition(line, fileType)) {
            achievement.finished(context, achievements);
        }
    });
    // Update the keys
    context.globalState.update("Achievements", achievements);
}
exports.checkForCompletion = checkForCompletion;
function getAchievements(obj) {
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
exports.getAchievements = getAchievements;
function accomplishedAchievements(achievements) {
    return achievements.filter((achievement) => achievement.done);
}
exports.accomplishedAchievements = accomplishedAchievements;
function resetAchievements(context) {
    context.globalState.update("Achievements", "");
    vscode.window.showInformationMessage("Reset Achievements");
    return achievements.map((achievement) => {
        achievement.done = false;
        return achievement;
    });
}
exports.resetAchievements = resetAchievements;
const allJavaScript = [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
];
const allHTML = ["html", "vue"];
function includes(line, str) {
    // indexOf is faster than includes
    return str.some((s) => line.indexOf(s) !== -1);
}
let achievements = [
    new Achievement("0054c520-2606-4669-90cf-ad8f6d1dc473", "Hello World Explorer", "Write your first “Hello, World!” program in a new language.", false, [...allJavaScript, ...allHTML, "python"], (line) => {
        return line.match(/.*Hello.* World.*/g) !== null;
    }, "All supported"),
    new Achievement("d7c15280-8d83-4212-8548-7d5e2cb4debf", "Function Novice", "Write your first Function", false, [...allJavaScript, "python"], (line, fileType) => {
        if (fileType === "python")
            return includes(line, ["def"]);
        else
            return includes(line, ["function"]);
    }, "All supported"),
    new Achievement("276989cb-f564-426e-97bf-8876d7232cd9", "Class Novice", "Write your first Class", false, [...allJavaScript, "python"], (line) => {
        return includes(line, ["class"]);
    }, "All supported"),
    new Achievement("552c7305-d31b-4048-989d-dd165786e8e1", "Mapper", "Use the first map function in your code", false, [...allJavaScript, "python"], (line) => {
        return includes(line, ["map("]);
    }, "All supported"),
    new Achievement("66191a48-daa5-4395-b862-37ebe0be8fb0", "Filter Fanatic", "Use the first filter function in your code", false, [...allJavaScript, "python"], (line) => {
        return includes(line, ["filter("]);
    }, "All supported"),
    new Achievement("4a837b09-2d4e-43c3-b9b7-f81a962b404e", "Map reduced", "Use the first reduce function in your code", false, [...allJavaScript, "python"], (line) => {
        return includes(line, [".reduce("]);
    }, "All supported"),
    new Achievement("8a15e34c-4bc5-4ca5-91ec-dde41dd28df3", "Regex Sorcerer", "Write complex regex, which is longer than 9 characters", false, [...allJavaScript, "python"], (line, fileType) => {
        // use complicated regex
        if (fileType === "python")
            return line.match(/re.*\(..{10,}.\)/g) !== null;
        else
            return line.match(/new RegExp\(..{10,}.\)/g) !== null;
    }, "All supported"),
    new Achievement("f019624-c3fc-4fe6-9982-a08ec93bf423", "String Splitter", "Split a string into an array of substrings", false, [...allJavaScript, "python"], (line, fileType) => {
        return includes(line, [".split("]);
    }, "All supported"),
    new Achievement("e1270905-6334-4404-84dc-a41e553d8a79", "What's your comment?", "Commenting on your code", false, [...allJavaScript, ...allHTML, "python"], (line, fileType) => {
        if (allJavaScript.includes(fileType))
            return includes(line, ["//"]);
        else if (fileType === "python")
            return includes(line, ["#"]);
        else
            return includes(line, ["<!--"]);
    }, "All supported"),
    new Achievement("e1270905-6334-4404-84dc-a41e553d8a79", "Shorthand Master", "Writing a shorthand if", false, [...allJavaScript, "python"], (line, fileType) => {
        if (fileType === "python")
            return includes(line, ["if"]) && includes(line, ["else"]);
        else
            return line.match(/.*\?.*:/g) !== null;
    }, "All supported"),
    new Achievement("602d1d62-7080-437c-9f3c-9829a418395d", "Switcheroo!", "Using a switch instead of else if", false, [...allJavaScript, "python"], (line, fileType) => {
        if (fileType === "python")
            return includes(line, ["case"]);
        else
            return includes(line, ["switch"]);
    }, "All supported"),
    new Achievement("17318c44-feb4-498a-b92e-6a83f9218c32", "Bit by Bit", "Bit manipulation operator used", false, [...allJavaScript, "python"], (line) => {
        return [" & ", " | ", "^", "~", "<<", ">>"].some((exp) => {
            if (line.includes(exp))
                return true;
        });
    }, "All supported"),
    new Achievement("8f2a5ec4-198e-432a-9810-0e7aab353698", "Magic Numbers", "Using a random number", false, [...allJavaScript, "python"], (line, fileType) => {
        if (fileType === "python")
            return includes(line, ["random"]);
        else
            return includes(line, ["Math.random("]);
    }, "All supported"),
    new Achievement("12b5c2c0-9aab-4fa1-bfef-db20928c8cf8", "LambDuh!", "Use a lambda function", false, [...allJavaScript, "python"], (line, fileType) => {
        if (fileType === "python")
            return includes(line, ["lambda"]);
        else
            return line.match(/=.*\(.*\).*=>/g);
    }, "All supported"),
    new Achievement("690424a0-dd94-4663-8c38-9198417be645", "Line by Line", "10000 lines written", false, [...allJavaScript, ...allHTML, "python"], (context, newLines, GlobalChangedLines) => {
        if (newLines > 0) {
            GlobalChangedLines += newLines;
            // save newLines to extension state
            context.globalState.update("changedLines", GlobalChangedLines);
            return GlobalChangedLines > 10000;
        }
        return false;
    }, "All supported"),
    new Achievement("7a11106c-5868-4971-bc20-1f6f920d94a8", "Except for that...", "Write try catch/except block", false, [...allJavaScript, "python"], (line, fileType) => {
        if (fileType === "python") {
            return includes(line, ["except"]);
        }
        else {
            return includes(line, ["catch"]);
        }
    }, "All supported"),
    new Achievement("0f669df5-ec73-41f3-a0ea-154baad3e03c", "File scripters", "Writing/opening a file", false, [...allJavaScript, "python"], (line, fileType) => {
        if (fileType === "python") {
            return includes(line, ["open", ".write"]);
        }
        else {
            return includes(line, ["require('fs')"]);
        }
    }),
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
    new Achievement("543eac4f-6c53-4b97-ae5f-229919faefc0", "JS connoisseur", "Write your first JavaScript program", false, allJavaScript, () => {
        return true;
    }),
    new Achievement("c6db06d0-0a47-4f37-8dab-2879ebfbd6e6", "Cartograph", "Use the first map data type in your code", false, allJavaScript, (line) => {
        return includes(line, ["new Map("]);
    }),
    new Achievement("bad81e57-1dcc-4fe4-8177-dddfa9444022", "Spread the Joy", "Unpack a variable with ...", false, allJavaScript, (line) => {
        return includes(line, ["..."]);
    }),
    new Achievement("3cb38afc-bdea-468f-a9b1-415b37a05ceb", "Parallel Universe", "Create a asynchronous function", false, allJavaScript, (line) => {
        return includes(line, ["async"]);
    }),
    new Achievement("1d34e095-c59b-4f39-9b4e-54403af28944", "Promise Keeper", "Use a promise", false, allJavaScript, (line) => {
        return includes(line, ["new Promise("]);
    }),
    new Achievement("3bc37b31-7439-4df0-a218-a2e37c5b80a9", "Documentation Dynamo", "Write a JSDoc comment", false, allJavaScript, (line) => {
        return includes(line, ["@param", "@returns"]);
    }),
    // HTML Achievements
    new Achievement("2f869a47-fec5-4b56-86ba-afc19d7e4f79", "HTML Hero", "Write your first HTML program", false, allHTML, () => {
        return true;
    }),
    new Achievement("c2dd5468-1674-4dc7-b207-6eaf95b7c528", "Tag Customizer", "Create a custom HTML tag", false, allHTML, (line) => {
        return line.match(/<.*[^-]-[^-].*>/g) !== null;
    }),
    new Achievement("6bf81a2a-24d0-4881-9b40-f66da8fc9a49", "Pixel Picasso", "Show an image or svg", false, allHTML, (line) => {
        return includes(line, ["<img", "<svg"]);
    }),
    new Achievement("14d7578e-d134-467c-bfc5-bb537864a31d", "The missing link", "Create a hyperlink", false, allHTML, (line) => {
        return includes(line, ["<a"]);
    }),
    new Achievement("52b55a14-3281-4dc4-8386-afcecf88cb96", "List Lover", "Create a list", false, allHTML, (line) => {
        return includes(line, ["<ul", "<ol"]);
    }),
    new Achievement("429e4c3e-f395-4f08-a06e-9fe7abe9e4d7", "Table Turner", "Create a table", false, allHTML, (line) => {
        return includes(line, ["<table"]);
    }),
    new Achievement("fbb6e27a-a003-4ea7-8cb0-5e580bd75451", "Frame it!", "Include an iframe", false, allHTML, (line) => {
        return includes(line, ["<iframe"]);
    }),
    // python
    new Achievement("52e39100-5731-4aa8-b280-ac42ce5f41e1", "Pythonic", "Write your first Python program", false, ["python"], (line) => {
        return true;
    }),
];


/***/ }),
/* 3 */
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
exports.AchievementPanel = void 0;
const vscode = __importStar(__webpack_require__(1));
const achievements_1 = __webpack_require__(2);
class AchievementPanel {
    /**
     * Track the currently panel. Only allow a single panel to exist at a time.
     */
    static currentPanel;
    static viewType = "achievements";
    _panel;
    _extensionUri;
    _disposables = [];
    static createOrShow(extensionUri, achievements) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // If we already have a panel, show it.
        if (AchievementPanel.currentPanel) {
            AchievementPanel.currentPanel._panel.reveal(column);
            AchievementPanel.currentPanel._update(achievements);
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(AchievementPanel.viewType, "Achievements", column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, "media"),
                vscode.Uri.joinPath(extensionUri, "out/compiled"),
            ],
        });
        AchievementPanel.currentPanel = new AchievementPanel(panel, extensionUri, achievements);
    }
    static kill() {
        AchievementPanel.currentPanel?.dispose();
        AchievementPanel.currentPanel = undefined;
    }
    static revive(panel, extensionUri, achievements) {
        AchievementPanel.currentPanel = new AchievementPanel(panel, extensionUri, achievements);
    }
    constructor(panel, extensionUri, achievements) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        // Set the webview's initial html content
        this._update(achievements);
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }
    dispose() {
        AchievementPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    async _update(achievements) {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview, achievements);
        webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });
    }
    _getHtmlForWebview(webview, achievements) {
        let achievementsInText = "";
        let lastFileTypes = "";
        for (const a of achievements) {
            if (a.fileTypeCategory != lastFileTypes) {
                lastFileTypes = a.fileTypeCategory;
                achievementsInText += `<h4>Language Types: ${a.fileTypeCategory}</h4>`;
            }
            achievementsInText += `<p class="achievement">
      ${a.done ? "✔️" : "❌"}&emsp;<b>${a.name}</b>
      ${a.done ? "&emsp;-&emsp;" + a.description : ""}</p>`;
        }
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <h1 align="center">Achievements</h1>
  <hr>
  <br><br>
  <div>${achievementsInText}</div>
  <p>
    <a>${(0, achievements_1.accomplishedAchievements)(achievements).length}</a>/
    <a class="countAll">${achievements.length}</a>
  </p>
</body>

</html>`;
    }
}
exports.AchievementPanel = AchievementPanel;


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