// ────────────────────────────
// 📄 src/codingModels.ts
// ────────────────────────────
// A curated fallback list for offline QuickPick.  The extension prefers the
// live API but will fall back to this list if the call fails (e.g. invalid key).

export interface CodingModel {
  id: string;
  r1: boolean;
  reasoning: boolean;
  tokenLength: number;
}

export const FALLBACK_MODELS: CodingModel[] = [
  { id: "Qwen/Qwen3-Coder-480B-A35B-Instruct",        r1: false, reasoning: false, tokenLength: 262_144 },
  { id: "Qwen/Qwen3-Coder-480B-A35B-Instruct-Turbo", r1: false, reasoning: false, tokenLength: 262_144 },
  { id: "mistralai/Devstral-Small-2507",              r1: false, reasoning: false, tokenLength: 128_000 },
  { id: "deepseek-ai/DeepSeek-R1-0528",               r1: true,  reasoning: true,  tokenLength: 163_840 },
  { id: "deepseek-ai/DeepSeek-R1-0528-Turbo",         r1: true,  reasoning: true,  tokenLength: 32_768  },
  { id: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",  r1: true,  reasoning: true,  tokenLength: 131_072 },
  { id: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",   r1: true,  reasoning: true,  tokenLength: 131_072 },
  { id: "Qwen/Qwen2.5-Coder-32B-Instruct",            r1: false, reasoning: true,  tokenLength: 131_072 },
  { id: "Qwen/Qwen2.5-Coder-7B",                      r1: false, reasoning: true,  tokenLength: 131_072 },
  { id: "moonshotai/Kimi-K2-Instruct",                r1: false, reasoning: true,  tokenLength: 131_072 },
  { id: "Phind/Phind-CodeLlama-34B-v2",               r1: false, reasoning: false, tokenLength: 4_096   },
  { id: "bigcode/starcoder2-15b-instruct-v0.1",       r1: false, reasoning: false, tokenLength: 16_000  }
];
