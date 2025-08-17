// Vercel API route: /api/v1/tours/search
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
  } else {
    console.error("Supabase credentials not found in environment variables.");
  }
} catch (error) {
  console.error("Error initializing Supabase:", error);
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

  let tours = [];

  try {
    if (useSupabase && supabase) {
      let query = supabase.from("tours").select("*");
      const { data, error } = await query;
      if (error) throw error;
      tours = data;
    }
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({ error: "Failed to fetch tours" });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      tours
    },
    message: "Tours get completed successfully",
  });
}
