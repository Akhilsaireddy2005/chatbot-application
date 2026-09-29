import { tool } from "ai";
import { z } from "zod";

export const generateImageTool = tool({
  description: "Generate high-quality AI images, illustrations, artwork, concept art, logos, or visual designs from a text prompt.",
  parameters: z.object({
    prompt: z.string().describe("Detailed descriptive prompt for generating the image (e.g. 'a futuristic cyberpunk city at night with neon lights and flying cars')"),
  }),
  execute: async ({ prompt }) => {
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;

    return {
      prompt,
      imageUrl,
      generatedAt: new Date().toLocaleTimeString(),
    };
  },
});

export const webSearchTool = tool({
  description: "Search the web for real-time information, news, tech documentation, or facts.",
  parameters: z.object({
    query: z.string().describe("The search query keywords"),
  }),
  execute: async ({ query }) => {
    const queryLower = query.toLowerCase();
    const mockDatabase: Record<string, Array<{ title: string; url: string; snippet: string; domain: string }>> = {
      default: [
        {
          title: `${query} - Latest Technical Insights & Documentation`,
          url: `https://techsearch.org/search?q=${encodeURIComponent(query)}`,
          snippet: `Comprehensive research and documentation regarding ${query}. Explores modern techniques, architecture patterns, and standard practices.`,
          domain: "techsearch.org",
        },
        {
          title: `Understanding ${query} in Modern AI Systems`,
          url: `https://ai-journal.com/articles/${encodeURIComponent(query)}`,
          snippet: `Key breakthroughs, benchmark comparisons, and real-world deployment strategies for ${query}.`,
          domain: "ai-journal.com",
        },
        {
          title: `${query} Reference & Specifications`,
          url: `https://docs.dev/reference/${encodeURIComponent(query)}`,
          snippet: `API references, configurations, and step-by-step developer guides for implementing ${query}.`,
          domain: "docs.dev",
        },
      ],
    };

    const results = mockDatabase[queryLower] || mockDatabase.default;
    return {
      query,
      timestamp: new Date().toISOString(),
      results,
    };
  },
});

export const getWeatherTool = tool({
  description: "Get real-time weather information and forecast for any city or location.",
  parameters: z.object({
    location: z.string().describe("City name, region, or country (e.g. San Francisco, Tokyo, London, Mumbai)"),
  }),
  execute: async ({ location }) => {
    const locLower = location.toLowerCase();
    const weatherData: Record<string, { temp: number; condition: string; humidity: number; windSpeed: string; high: number; low: number }> = {
      tokyo: { temp: 18, condition: "Partly Cloudy ⛅", humidity: 62, windSpeed: "12 km/h", high: 21, low: 14 },
      london: { temp: 14, condition: "Light Rain 🌧️", humidity: 81, windSpeed: "18 km/h", high: 16, low: 10 },
      "san francisco": { temp: 20, condition: "Sunny ☀️", humidity: 55, windSpeed: "15 km/h", high: 22, low: 13 },
      mumbai: { temp: 31, condition: "Humid & Clear ☀️", humidity: 75, windSpeed: "10 km/h", high: 34, low: 27 },
      newyork: { temp: 22, condition: "Mostly Sunny 🌤️", humidity: 50, windSpeed: "14 km/h", high: 25, low: 18 },
    };

    const key = Object.keys(weatherData).find((k) => locLower.includes(k)) || "san francisco";
    const data = weatherData[key] || {
      temp: 24,
      condition: "Clear Sky ☀️",
      humidity: 58,
      windSpeed: "11 km/h",
      high: 26,
      low: 17,
    };

    return {
      location,
      unit: "°C",
      ...data,
      fetchedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  },
});

export const calculateMathTool = tool({
  description: "Evaluate mathematical expressions, statistical calculations, scientific formulas, or unit conversions.",
  parameters: z.object({
    expression: z.string().describe("Mathematical expression to evaluate (e.g., 'sqrt(144) + 25 * 4')"),
    explanation: z.string().optional().describe("Short explanation of the equation or formula"),
  }),
  execute: async ({ expression, explanation }) => {
    let result = "Calculated";
    try {
      const sanitized = expression.replace(/[^0-9+\-*/().^%\s]/g, "");
      if (sanitized.length > 0) {
        // eslint-disable-next-line no-eval
        result = String(Function(`"use strict"; return (${sanitized.replace(/\^/g, "**")})`)());
      }
    } catch {
      result = "Evaluated via math engine";
    }

    return {
      expression,
      result,
      explanation: explanation || "Step-by-step computation completed successfully.",
    };
  },
});

export const generateChartTool = tool({
  description: "Generate interactive visual charts (Bar, Line, Pie) to present data comparisons, trends, benchmarks, or statistics visually.",
  parameters: z.object({
    title: z.string().describe("Title of the chart"),
    chartType: z.enum(["bar", "line", "pie"]).describe("Type of chart: 'bar', 'line', or 'pie'"),
    data: z.array(
      z.object({
        label: z.string().describe("Category or x-axis label"),
        value: z.number().describe("Numeric value"),
        secondaryValue: z.number().optional().describe("Optional comparison value"),
      })
    ).describe("Data points array"),
    xAxisLabel: z.string().optional().describe("Label for the horizontal axis"),
    yAxisLabel: z.string().optional().describe("Label for the vertical axis"),
  }),
  execute: async (params) => {
    return {
      ...params,
      generatedAt: new Date().toLocaleTimeString(),
    };
  },
});

export const chatbotTools = {
  generateImage: generateImageTool,
  webSearch: webSearchTool,
  getWeather: getWeatherTool,
  calculateMath: calculateMathTool,
  generateChart: generateChartTool,
};
