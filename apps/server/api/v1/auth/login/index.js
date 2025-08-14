// Vercel API route: /api/v1/auth/login
import { createClient } from "@supabase/supabase-js";

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
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

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
          .select("*")
          .eq("email", email)
          .single();
        if (error) {
          console.log("❌ User login failed:", error);
          res.status(500).json({
            error: error.message || "User login failed",
            details: error.details || error,
          });
          return;
        }
        console.log("✅ User logged in:", data);
        if (data.password !== password) {
          res.status(401).json({ error: "Invalid password" });
          return;
        }
        res.status(200).json({
          success: true,
          message: "Login successful",
          data: data,
        });
        return;
      } catch (error) {
        console.log("❌ User login failed (catch):", error);
        res.status(500).json({
          error: error.message || "User login failed",
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
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
