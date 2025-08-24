// Initialize Supabase from environment variables
const PROJECT_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const signupForm = document.getElementById("signupForm");
const messageDiv = document.getElementById("message");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const first_name = document.getElementById("firstName").value.trim();
  const middle_name = document.getElementById("middleName").value.trim();
  const last_name = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    // 1️⃣ Sign up the user with Supabase Auth
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://your-domain.com/confirm" // redirect after confirmation
      }
    });

    if (signupError) throw signupError;

    // 2️⃣ Create profile in 'profiles' table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id,
          first_name,
          middle_name,
          last_name,
          email
        }
      ]);

    if (profileError) throw profileError;

    messageDiv.textContent = "Signup successful! Check your email to confirm your account.";
    signupForm.reset();

  } catch (err) {
    messageDiv.textContent = `Error: ${err.message}`;
  }
});
