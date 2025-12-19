import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

// Define schema for the structured output
const repoSummarySchema = z.object({
  summary: z.string().describe("A concise summary of the GitHub repository"),
  cool_facts: z.array(z.string()).describe("List of cool or interesting facts about the repository"),
});

// Create the output parser from Langchain-JS
const outputParser = StructuredOutputParser.fromZodSchema(repoSummarySchema);

// Get format instructions from the parser
const formatInstructions = outputParser.getFormatInstructions();

// Create the prompt template with format instructions included directly
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
      "Format the output as JSON matching the following schema:",
      formatInstructions,
    ].join("\n"),
  ],
  ["human", "{readmeContent}"],
]);

// Instantiate the OpenAI chat model (can substitute model name as needed)
const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo", // or "gpt-4" etc.
  temperature: 0,
});

// Create the chain without function calling, using output parser instead
export const summarizeRepoChain = prompt.pipe(llm).pipe(outputParser);

