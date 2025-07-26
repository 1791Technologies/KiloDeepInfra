import * as vscode from "vscode";
import { FALLBACK_MODELS, CodingModel } from "./codingModels";

const BASE_URL = "https://api.deepinfra.com/v1/openai";

export function activate(ctx: vscode.ExtensionContext) {
  // Run automatically at startup so the user only has to set once
  configure(true).catch(console.error);

  const cmd = vscode.commands.registerCommand("deepinfra.configure", () =>
    configure(false)
  );

  ctx.subscriptions.push(cmd);
}

async function configure(isStartup: boolean): Promise<void> {
  const cfg = vscode.workspace.getConfiguration("kilocode");

  // If we already have DeepInfra configured and we are running at startup, skip.
  if (isStartup && cfg.get<string>("openAICompatible.baseUrl") === BASE_URL) {
    return;
  }

  // Ask for the API key (never store it in extension globalState; respect VS Code’s SecretStorage for persistence)
  const token = await vscode.window.showInputBox({
    prompt: "Enter your DeepInfra API key",
    ignoreFocusOut: true,
    password: true,
    value: cfg.get<string>("openAICompatible.apiKey") ?? ""
  });
  if (!token) {
    vscode.window.showWarningMessage("DeepInfra configuration cancelled.");
    return;
  }

  // Try to fetch the live model list; fall back to static list on failure.
  let models: CodingModel[] = [];
  try {
    const resp = await fetch(`${BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json: { data: { id: string }[] } = await resp.json();
    models = json.data
      .map(({ id }) => FALLBACK_MODELS.find(m => m.id === id) || { id, r1: false, reasoning: false, tokenLength: 0 })
      // simple heuristic: keep only code-oriented models from the fallback table
      .filter(m => FALLBACK_MODELS.some(f => f.id === m.id));
  } catch (err) {
    console.warn("DeepInfra model fetch failed – using fallback list", err);
    models = FALLBACK_MODELS;
  }

  const picked = await vscode.window.showQuickPick(
    models.map(m => ({
      label: m.id,
      description: `${m.tokenLength.toLocaleString()} tok${m.reasoning ? ", reasoning" : ""}${m.r1 ? ", R1" : ""}`
    })),
    {
      title: "Select a DeepInfra coding model"
    }
  );
  if (!picked) return;

  // Persist settings
  await cfg.update("apiProvider", "OpenAI Compatible", vscode.ConfigurationTarget.Global);
  await cfg.update("openAICompatible.baseUrl", BASE_URL, vscode.ConfigurationTarget.Global);
  await cfg.update("openAICompatible.apiKey", token, vscode.ConfigurationTarget.Global);
  await cfg.update("openAICompatible.model", picked.label, vscode.ConfigurationTarget.Global);

  vscode.window.showInformationMessage(
    `Kilo Code is now configured to use DeepInfra (model ${picked.label}).`
  );
}

export function deactivate() {
  /* nothing to do */
}