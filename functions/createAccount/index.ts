// File: functions/createAccount/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Supabase project credentials
const SUPABASE_URL = "https://arvuoabjhqdkxhsswybx.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydnVvYWJqaHFka3hoc3N3eWJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTY1NDkzOSwiZXhwIjoyMDcxMjMwOTM5fQ.I9_3iTRgMYjhXyIFRjo9mFEjXqYrLO0mUV76y6ALgYk";

// Initialize Supabase client with service_role key
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();

    // Required fields from your table
    const {
      first_name,
      middle_name,
      last_name,
      dob,
      phone,
      email,
      address,
      city,
      state,
      postal_code,
      ssn,
      account_type
    } = body;

    // Basic validation
    if (!first_name || !last_name || !dob || !phone || !email || !address || !city || !state || !postal_code || !ssn || !account_type) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Optionally generate a random account number (you can adjust logic)
    const account_number = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    // Insert into the accounts table
    const { data, error } = await supabase
      .from("accounts")
      .insert([{
        first_name,
        middle_name,
        last_name,
        dob,
        phone,
        email,
        address,
        city,
        state,
        postal_code,
        ssn,
        account_type,
        account_number,
      }])
      .select(); // returns inserted row

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ account: data[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
