import fetch from "node-fetch"; // only needed if running in Node.js <18

async function testCreateAccount() {
  const response = await fetch(
    "https://arvuoabjhqdkxhsswybx.supabase.co/functions/v1/createAccount",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "StrongPassword123",
      }),
    }
  );

  const data = await response.json();
  console.log("Response from createAccount function:", data);
}

testCreateAccount();
