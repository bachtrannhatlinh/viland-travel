// Vercel API route: /api/v1/auth/register
import { createClient } from "@supabase/supabase-js";
import { handleCors } from "../../../../src/middleware/cors";

// Initialize Supabase
let supabase = null;
let useSupabase = false;

try {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    useSupabase = true;
    console.log("✅ Supabase initialized");
  } else {
    console.log("⚠️ Supabase env vars not found");
  }
} catch (error) {
  console.log("❌ Supabase init error:", error.message);
}

export default async function handler(req, res) {
  // Set CORS headers using shared helper
  if (handleCors(req, res)) return;

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { email, password } = req.body;

    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from("users")
          .insert([{ email, password }])
          .select();
        if (error) {
          console.log("❌ User registration failed:", error);
          res
            .status(500)
            .json({
              error: error.message || "User registration failed",
              details: error.details || error,
            });
          return;
        }
        console.log("✅ User registered:", data);
      } catch (error) {
        console.log("❌ User registration failed (catch):", error);
        res
          .status(500)
          .json({
            error: error.message || "User registration failed",
            details: error,
          });
        return;
      }
    } else {
      res.status(500).json({ error: "Supabase not initialized" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
