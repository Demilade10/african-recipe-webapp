import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Paystack Integration with Simulation Mode
  app.post("/api/paystack/initialize", async (req, res) => {
    const { email, amount } = req.body;
    
    // If no key is provided, we run in SIMULATION MODE to allow app testing
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.warn("PAYSTACK_SECRET_KEY is missing. Running in Simulation Mode.");
      return res.json({
        status: true,
        message: "Simulation Mode: Payment initialized",
        data: {
          authorization_url: `/?status=success&amount=${amount}&ref=sim`,
          access_code: "sim_mode"
        }
      });
    }

    try {
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, // Paystack amount is in kobo
          callback_url: `${process.env.APP_URL}/payment/verify`,
        }),
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Paystack initialization error:", error);
      res.status(500).json({ error: "Failed to initialize transaction." });
    }
  });

  // Paystack Webhook/Verification
  app.get("/api/paystack/verify/:reference", async (req, res) => {
    const { reference } = req.params;

    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Paystack verification error:", error);
      res.status(500).json({ error: "Failed to verify transaction." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
