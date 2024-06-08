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
const StatusBar_1 = __webpack_require__(3);
const achievements_1 = __webpack_require__(2);
const AchievementPanel_1 = __webpack_require__(4);
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log("Gamify Plugin is activated");
    let achievements = (0, achievements_1.getAchievements)(context.globalState.get("Achievements"));
    // Initiate StatusBar
    const statusBar = new StatusBar_1.StatusBar("Achievements", "achievements.achievements");
    vscode.workspace.onDidChangeTextDocument((event) => {
        event.contentChanges.forEach((change) => {
            (0, achievements_1.checkForCompletion)(achievements, context, statusBar, change, event.document);
        });
    });
    // The command has been defined in the package.json file
    let resetAchievementsCommand = vscode.commands.registerCommand("gamify.resetAchievements", () => {
        achievements = (0, achievements_1.resetAchievements)(context);
    });
    let showAchievementsCommand = vscode.commands.registerCommand("gamify.showAchievements", () => {
        AchievementPanel_1.AchievementPanel.createOrShow(context.extensionUri, achievements, statusBar);
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
const AchievementPanel_1 = __webpack_require__(4);
class Achievement {
    name;
    description;
    done;
    checkCondition;
    fresh;
    constructor(name, description, done, checkCondition) {
        this.name = name;
        this.description = description;
        this.done = done;
        this.checkCondition = checkCondition;
    }
    async finished(context, achievements, statusBar) {
        this.done = true;
        this.fresh = true;
        statusBar.notify();
        let answer = await vscode.window.showInformationMessage(`✔ ${this.name}`, "Show Achievements");
        if (answer === "Show Achievements") {
            AchievementPanel_1.AchievementPanel.createOrShow(context.extensionUri, achievements, statusBar);
        }
    }
}
exports.Achievement = Achievement;
// Check wether an achievement is done
function checkForCompletion(achievements, context, statusBar, change, doc) {
    let GlobalChangedLines = parseInt(context.globalState.get("changedLines") ?? "0");
    const line = doc.lineAt(change.range.start.line).text;
    achievements.forEach((achievement) => {
        // If the condition is true and the achievement isn't done
        if (achievement.done)
            return;
        if (achievement.name == "First steps" && change) {
            const newLines = change.text.split("\n").length - 1;
            if (achievement.checkCondition(context, newLines, GlobalChangedLines)) {
                achievement.finished(context, achievements, statusBar);
            }
        }
        else if (achievement.checkCondition(change, line)) {
            achievement.finished(context, achievements, statusBar);
        }
    });
    // Update the keys
    context.globalState.update("Achievements", achievements);
}
exports.checkForCompletion = checkForCompletion;
let achievements = [
    new Achievement("Welcome!", "Thank you for downloading the Achievements extension!", false, () => {
        return true;
    }),
    new Achievement("Hello World Explorer", "Write your first “Hello, World!” program in a new language.", false, (change, line) => {
        // regex line includes console.log and Hello World
        return line.match(/console\.log\(.*Hello.* World.*\)/g) !== null;
    }),
    new Achievement("Function Novice", "Write your first Function", false, (change, line) => {
        return line.includes("function");
    }),
    // TODO:
    // new Achievement(
    //   "Recursive Ruler",
    //   "Write a recursive function",
    //   false,
    //   () => {
    //     return true;
    //   }
    // ),
    new Achievement("Class Novice", "Write your first Class", false, (change, line) => {
        return line.includes("class");
    }),
    new Achievement("Cartograph", "Use the first map data type in your code", false, (change, line) => {
        return line.includes("new Map(");
    }),
    new Achievement("Map reduced", "Use the first map function in your code", false, (change, line) => {
        return line.includes(".map(");
    }),
    new Achievement("Filter Fanatic", "Use the first filter function in your code", false, (change, line) => {
        return line.includes(".filter(");
    }),
    new Achievement("Don't reduce, reuse!", "Use the first reduce function in your code", false, (change, line) => {
        return line.includes(".reduce(");
    }),
    new Achievement("Regex Sorcerer", "Write complex regex, which is longer than 9 characters", false, (change, line) => {
        // use complicated regex
        return line.match(/new RegExp\(..{10,}.\)/g) !== null;
    }),
    new Achievement("Spread the Joy", "Unpack a variable with ...", false, (change, line) => {
        return line.includes("...");
    }),
    new Achievement("String Splitter", "Split a string into an array of substrings", false, (change, line) => {
        return line.includes(".split(");
    }),
    new Achievement("Parallel Universe", "Create a asynchronous function", false, (change, line) => {
        return line.includes("async");
    }),
    new Achievement("Promise Keeper", "Use a promise", false, (change, line) => {
        return line.includes("new Promise(");
    }),
    new Achievement("What's your comment?", "Commenting on your code", false, (change, line) => {
        return line.includes("//");
    }),
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
    new Achievement("Shorthand Master", "Writing a shorthand if", false, (change, line) => {
        return line.match(/.*\?.*:/g) !== null;
    }),
    new Achievement("Switcheroo!", "Using a switch instead of else if", false, (change, line) => {
        return line.includes("switch");
    }),
    new Achievement("Bit by Bit", "Bit manipulation operator used", false, (change, line) => {
        const expressions = [" & ", " | ", "^", "~", "<<", ">>"];
        return expressions.some((exp) => {
            if (line.includes(exp)) {
                return true;
            }
        });
    }),
    new Achievement("Magic Numbers", "Using a random number", false, (change, line) => {
        return line.includes("Math.random(");
    }),
    new Achievement("Line by Line", "10000 lines written", false, (context, newLines, GlobalChangedLines) => {
        if (newLines > 0) {
            GlobalChangedLines += newLines;
            // save newLines to extension state
            context.globalState.update("changedLines", GlobalChangedLines);
            return GlobalChangedLines > 10000;
        }
        return false;
    }),
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
exports.StatusBar = void 0;
const vscode = __importStar(__webpack_require__(1));
class StatusBar {
    name;
    bar;
    constructor(name, command) {
        this.name = name;
        this.bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
        this.bar.text = this.name;
        this.bar.command = command;
        this.bar.show();
    }
    // Update the status of the bar
    update(val1, val2) {
        if (val1 === val2) {
            this.bar.text = `✔ ${this.name}`;
        }
        else {
            this.bar.text = `${this.name} ${val1}/${val2}`;
        }
        this.bar.show;
    }
    // "Notify" the user about the new achievement
    notify() {
        this.bar.text = `❗ ${this.name}`;
    }
}
exports.StatusBar = StatusBar;


/***/ }),
/* 4 */
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
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
class AchievementPanel {
    /**
     * Track the currently panel. Only allow a single panel to exist at a time.
     */
    static currentPanel;
    static viewType = "achievements";
    _panel;
    _extensionUri;
    _disposables = [];
    static createOrShow(extensionUri, achievements, statusBar) {
        statusBar.update((0, achievements_1.accomplishedAchievements)(achievements).length, achievements.length);
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
        // // Handle messages from the webview
        // this._panel.webview.onDidReceiveMessage(
        //   (message) => {
        //     switch (message.command) {
        //       case "alert":
        //         vscode.window.showErrorMessage(message.text);
        //         return;
        //     }
        //   },
        //   null,
        //   this._disposables
        // );
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
        // // // And the uri we use to load this script in the webview
        // const scriptUri = webview.asWebviewUri(
        //     vscode.Uri.joinPath(this._extensionUri, "out", "compiled/swiper.js")
        // );
        // Local path to css styles
        const styleResetPath = vscode.Uri.joinPath(this._extensionUri, "media", "reset.css");
        const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css");
        const style = vscode.Uri.joinPath(this._extensionUri, "media", "style.css");
        const script = vscode.Uri.joinPath(this._extensionUri, "media", "script.js");
        const styleUri = webview.asWebviewUri(style);
        const stylesResetUri = webview.asWebviewUri(styleResetPath);
        const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
        const scriptUri = webview.asWebviewUri(script);
        const nonce = getNonce();
        let achievementsInText = "";
        let explosion = `<div class="firework">
                        <div class="explode"></div>
                        <div class="explode"></div>
                        <div class="explode"></div>
                        <div class="explode"></div>
                        <div class="explode"></div>
                        <div class="explode"></div>
                        <div class="explode"></div>
                        <div class="explode"></div>
                        <div class="explode"></div>
                        <div class="explode"></div>
                        <div class="explode"></div>
                        <div class="explode"></div>
                        </div>`;
        for (let i = 0; i < achievements.length; i++) {
            let a = achievements[i];
            achievementsInText += `<p class="achievement">${a.fresh ? explosion : ""}${a.done ? "✔️" : "❌"}&emsp;<b>${a.name}</b>${a.done ? "&emsp;-&emsp;" + a.description : ""}</p><br>`;
            achievements[i].fresh = false;
        }
        return `<!DOCTYPE html>
			    <html lang="en">
			    <head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
                -->
                <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <link rel="stylesheet" href="${styleUri}">
                <link rel="stylesheet" href="${stylesResetUri}">
                <link rel="stylesheet" href="${stylesMainUri}">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script nonce="${nonce}">
                </script>
			    </head>
                <body>
                    <h1 align="center" id="heading">Achievements</h1>
                    <hr>
                    <br><br>
                    <div class="achievements">${achievementsInText}</div>
                    <p class="accomplishedAchievements">
                    
                    <a class="count✔️">${(0, achievements_1.accomplishedAchievements)(achievements).length}</a>/<a class="countAll">${achievements.length}</a>
                    </p>
                </body>
                <footer id="footer" align="center">If you want to support me, you can <a href="https://www.buymeacoffee.com/Tchibo">buy me a coffee</a> ☕ <br></footer>
                <script src="${scriptUri}" nonce="${nonce}">
                </script>
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