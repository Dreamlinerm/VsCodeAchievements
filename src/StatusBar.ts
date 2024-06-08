import * as vscode from "vscode";

export class StatusBar {
  name: string;
  bar: vscode.StatusBarItem;

  constructor(name: string, command: string) {
    this.name = name;
    this.bar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right
    );
    this.bar.text = this.name;
    this.bar.command = command;
    this.bar.show();
  }

  // Update the status of the bar
  update(val1: number, val2: number) {
    if (val1 === val2) {
      this.bar.text = `✔ ${this.name}`;
    } else {
      this.bar.text = `${this.name} ${val1}/${val2}`;
    }
    this.bar.show;
  }

  // "Notify" the user about the new achievement
  notify() {
    this.bar.text = `❗ ${this.name}`;
  }
}
