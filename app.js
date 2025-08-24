// Your Supabase project credentials
const SUPABASE_URL = "https://arvuoabjhqdkxhsswybx.supabase.co
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydnVvYWJqaHFka3hoc3N3eWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NTQ5MzksImV4cCI6MjA3MTIzMDkzOX0.Gt1waZAhZJKS4_VGqgNQCcroGehjnxKyDUfiCRLSWB8"; // keep safe, use anon key only on frontend

// Initialize client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const signupForm = document.getElementById("signupForm");
const messageDiv = document.getElementById("message");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const first_name = document.getElementById("firstName").value.trim();
  const middle_name = document.getElementById("middleName").value.trim();
  const last_name = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Step 1: Sign up user in Auth
  const { data, error: signupError } = await supabase.auth.signUp({
    email,
    password
  });

  if (signupError) {
    console.error("Signup Error:", signupError);
    messageDiv.textContent = `Signup failed: ${signupError.message}`;
    return;
  }

  const user = data.user;

  // Step 2: Insert into profiles table
  if (user) {
    const { error: insertError } = await supabase
      .from("profiles")
      .insert([
        {
          id: user.id, // link to auth.users
          first_name,
          middle_name,
          last_name,
          email
        }
      ]);

    if (insertError) {
      console.error("Insert Error:", insertError);
      messageDiv.textContent = `Error saving profile: ${insertError.message}`;
      return;
    }
  }

  // Step 3: Success message
  messageDiv.textContent =
    "Signup successful! Please check your email to confirm your account.";
  signupForm.reset();
});
