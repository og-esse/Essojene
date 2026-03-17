import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ reply: "Missing OPENAI_API_KEY" });
    }

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an internal IT support assistant helping employees troubleshoot issues like VPN, password resets, and access problems. Be clear, structured, and step-by-step.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(response.status).json({
        reply: data.error?.message || "OpenAI request failed",
      });
    }

    res.json({
      reply: data.choices?.[0]?.message?.content || "No response",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`AI server running on http://localhost:${port}`);
});
