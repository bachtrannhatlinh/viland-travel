// Vercel API route: /api/v1/flights/[id]
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

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { id } = req.query;

    console.log("🔍 Flight details request for ID:", id);

    let flight = null;

    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from("flights")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        flight = data;
        console.log("✅ Found flight from database");
      } catch (error) {
        console.log(
          "⚠️ Database query failed, using mock data:",
          error.message
        );
      }
    } else {
      res.status(500).json({ error: "Supabase not initialized" });
      return;
    }

    if (!flight) {
      res.status(404).json({
        success: false,
        message: "Flight not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: flight,
      message: "Flight details retrieved successfully",
    });
  } catch (error) {
    console.error("❌ Flight details error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving flight details",
      error: error.message,
    });
  }
}