import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

// --------------------
// Supabase credentials
// --------------------
const SUPABASE_URL = "https://arvuoabjhqdkxhsswybx.supabase.co";

// ⚠️ Replace this with your Service Role Key. Keep it secret!
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydnVvYWJqaHFka3hoc3N3eWJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTY1NDkzOSwiZXhwIjoyMDcxMjMwOTM5fQ.I9_3iTRgMYjhXyIFRjo9mFEjXqYrLO0mUV76y6ALgYk";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();

      // Generate a random 10-digit account number
      const account_number = Math.floor(1000000000 + Math.random() * 9000000000).toString();

      // Insert into Supabase accounts table
      const { data, error } = await supabase
        .from("accounts")
        .insert([{
          first_name: body.first_name,
          middle_name: body.middle_name || null,
          last_name: body.last_name,
          dob: body.dob,
          phone: body.phone,
          email: body.email,
          address: body.address,
          city: body.city,
          state: body.state,
          postal_code: body.postal_code,
          ssn: body.ssn,
          account_type: body.account_type,
          account_number: account_number,
          routing_number: "075915826"
        }]);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }

      return new Response(JSON.stringify({ message: "Account created successfully!", data }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
  }

  return new Response("Method Not Allowed", {
    status: 405,
    headers: { "Access-Control-Allow-Origin": "*", "Allow": "POST, OPTIONS" },
  });
});
