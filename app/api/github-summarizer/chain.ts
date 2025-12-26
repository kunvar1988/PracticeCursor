import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Define schema for the structured output
const repoSummarySchema = z.object({
  summary: z.string().describe("A concise summary of the GitHub repository"),
  cool_facts: z.array(z.string()).describe("List of cool or interesting facts about the repository"),
});

// Create the prompt template
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    [
      "You are a helpful assistant for analyzing GitHub repositories.",
      "You will be provided with the README content of a repository.",
      "Summarize this github repository from this readme file content.",
      "Your response should contain:",
      "- A concise summary of the repository",
      "- A list of cool or interesting facts as a bullet list about the repo, such as unique features, technologies used, notable design decisions, or fun insights.",
    ].join("\n"),
  ],
  ["human", "{readmeContent}"],
]);

// Instantiate the OpenAI chat model
// Note: We don't validate at module load time to avoid build failures
// Validation will happen at runtime when the chain is actually used
const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo", // or "gpt-4" etc.
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY || "", // Will be validated at runtime
});

// Bind StructuredOutput to the model using withStructuredOutput
const structuredLlm = llm.withStructuredOutput(repoSummarySchema);

// Create the chain with structured output bound to the model
export const summarizeRepoChain = prompt.pipe(structuredLlm);