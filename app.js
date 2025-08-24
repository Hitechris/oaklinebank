const signupForm = document.getElementById("signupForm");
const messageDiv = document.getElementById("message");

// Supabase Edge Function URL
const EDGE_FUNCTION_URL = "https://arvuoabjhqdkxhsswybx.supabase.co/functions/v1/createAccount";

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const first_name = document.getElementById("firstName").value.trim();
  const middle_name = document.getElementById("middleName").value.trim();
  const last_name = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    console.log("Starting signup for:", email);

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, middle_name, last_name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Signup Error:", data);
      messageDiv.textContent = "Signup Error: " + (data.error || "Unknown error");
      return;
    }

    console.log("Signup successful:", data);
    messageDiv.style.color = "green";
    messageDiv.textContent = "Signup successful! Check your email to confirm your account.";

    signupForm.reset();
  } catch (err) {
    console.error("Unexpected Error:", err);
    messageDiv.textContent = "Unexpected Error: " + err.message;
  }
});
