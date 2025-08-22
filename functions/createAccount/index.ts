// File: functions/createAccount/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Load credentials from environment variables
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Initialize Supabase client
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

    if (!first_name || !last_name || !dob || !phone || !email || !address || !city || !state || !postal_code || !ssn || !account_type) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const account_number = Math.floor(1000000000 + Math.random() * 9000000000).toString();

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
      .select();

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
