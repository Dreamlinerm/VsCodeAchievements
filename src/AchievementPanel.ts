import * as vscode from "vscode";
import { Achievement, accomplishedAchievements } from "./achievements";
import { StatusBar } from "./StatusBar";

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
    let achievementsInText = "";
    for (const element of achievements) {
      let a = element;
      achievementsInText += `<p class="achievement">${
        a.done ? "✔️" : "❌"
      }&emsp;<b>${a.name}</b>${
        a.done ? "&emsp;-&emsp;" + a.description : ""
      }</p>`;
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
                };">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
			    </html>`;
  }
}
