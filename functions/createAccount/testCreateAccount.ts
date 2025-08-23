import fetch from "node-fetch"; // only needed if using Node.js <18

async function testCreateAccount() {
  try {
    const response = await fetch(
      "https://arvuoabjhqdkxhsswybx.supabase.co/functions/v1/createAccount",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: "John",
          middle_name: "M",
          last_name: "Doe",
          dob: "1990-01-01",
          phone: "555-123-4567",
          email: "john.doe@example.com",
          address: "123 Main St",
          city: "SomeCity",
          state: "CA",
          postal_code: "90001",
          ssn: "123-45-6789",
          account_types: ["Savings", "Checking"]
        }),
      }
    );

    const data = await response.json();
    console.log("Response from createAccount function:", data);
  } catch (err) {
    console.error("Error calling createAccount function:", err);
  }
}

testCreateAccount();
