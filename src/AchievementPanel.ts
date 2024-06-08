import * as vscode from "vscode";
import { Achievement, accomplishedAchievements } from "./achievements";
import { StatusBar } from "./StatusBar";

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export class AchievementPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: AchievementPanel | undefined;

  public static readonly viewType = "achievements";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(
    extensionUri: vscode.Uri,
    achievements: Array<Achievement>,
    statusBar: StatusBar
  ) {
    statusBar.update(
      accomplishedAchievements(achievements).length,
      achievements.length
    );

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
    const panel = vscode.window.createWebviewPanel(
      AchievementPanel.viewType,
      "Achievements",
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "out/compiled"),
        ],
      }
    );

    AchievementPanel.currentPanel = new AchievementPanel(
      panel,
      extensionUri,
      achievements
    );
  }

  public static kill() {
    AchievementPanel.currentPanel?.dispose();
    AchievementPanel.currentPanel = undefined;
  }

  public static revive(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    achievements: Array<Achievement>
  ) {
    AchievementPanel.currentPanel = new AchievementPanel(
      panel,
      extensionUri,
      achievements
    );
  }

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    achievements: Array<Achievement>
  ) {
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

  public dispose() {
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

  private async _update(achievements: Array<Achievement>) {
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

  private _getHtmlForWebview(
    webview: vscode.Webview,
    achievements: Array<Achievement>
  ) {
    // // // And the uri we use to load this script in the webview
    // const scriptUri = webview.asWebviewUri(
    //     vscode.Uri.joinPath(this._extensionUri, "out", "compiled/swiper.js")
    // );

    // Local path to css styles
    const styleResetPath = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "reset.css"
    );
    const stylesPathMainPath = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "vscode.css"
    );

    const style = vscode.Uri.joinPath(this._extensionUri, "media", "style.css");

    const script = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "script.js"
    );

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
      achievementsInText += `<p class="achievement">${
        a.fresh ? explosion : ""
      }${a.done ? "✔️" : "❌"}&emsp;<b>${a.name}</b>${
        a.done ? "&emsp;-&emsp;" + a.description : ""
      }</p><br>`;
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
                <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
                  webview.cspSource
                }; script-src 'nonce-${nonce}';">
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
                    
                    <a class="count✔️">${
                      accomplishedAchievements(achievements).length
                    }</a>/<a class="countAll">${achievements.length}</a>
                    </p>
                </body>
                <footer id="footer" align="center">If you want to support me, you can <a href="https://www.buymeacoffee.com/Tchibo">buy me a coffee</a> ☕ <br></footer>
                <script src="${scriptUri}" nonce="${nonce}">
                </script>
			    </html>`;
  }
}
