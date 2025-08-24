// Supabase credentials
const PROJECT_URL = "https://arvuoabjhqdkxhsswybx.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydnVvYWJqaHFka3hoc3N3eWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NTQ5MzksImV4cCI6MjA3MTIzMDkzOX0.Gt1waZAhZJKS4_VGqgNQCcroGehjnxKyDUfiCRLSWB8";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// -------- SIGNUP --------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const first_name = document.getElementById("firstName").value.trim();
    const middle_name = document.getElementById("middleName").value.trim();
    const last_name = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name, middle_name, last_name } }
    });

    const msgDiv = document.getElementById("message");
    if (error) {
      msgDiv.textContent = `Signup Error: ${error.message}`;
    } else {
      msgDiv.textContent = "Signup successful! Check your email to confirm.";
      signupForm.reset();
    }
  });
}

// -------- LOGIN --------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    const msgDiv = document.getElementById("message");
    if (error) {
      msgDiv.textContent = `Login Error: ${error.message}`;
    } else {
      localStorage.setItem("userId", user.id);
      window.location.href = "dashboard.html";
    }
  });
}

// -------- DASHBOARD --------
const userNameSpan = document.getElementById("userName");
if (userNameSpan) {
  const userId = localStorage.getItem("userId");
  supabase.auth.getUser().then(({ data }) => {
    if (data.user) {
      const user = data.user;
      userNameSpan.textContent = `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
  });

  const openBtn = document.getElementById("openAccountBtn");
  openBtn.addEventListener("click", () => {
    window.location.href = "open-account.html";
  });

  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("userId");
    window.location.href = "login.html";
  });
}

// -------- OPEN ACCOUNT --------
const openAccountForm = document.getElementById("openAccountForm");
if (openAccountForm) {
  openAccountForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = (await supabase.auth.getUser()).data.user;
    const ssn_or_id = document.getElementById("ssnOrId").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const street_address = document.getElementById("street").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const zip_code = document.getElementById("zip").value.trim();
    const country = document.getElementById("country").value.trim();

    const accountTypes = Array.from(document.querySelectorAll(".accountType:checked")).map(cb => cb.value);
    const msgDiv = document.getElementById("message");
    if (accountTypes.length === 0) {
      msgDiv.textContent = "Select at least one account type.";
      return;
    }

    function generateAccountNumber() {
      return "ACCT" + Math.floor(100000000 + Math.random() * 900000000);
    }

    for (const account_type of accountTypes) {
      const { data, error } = await supabase.from("accounts").insert([
        {
          user_id: user.id,
          first_name: user.user_metadata.first_name,
          middle_name: user.user_metadata.middle_name,
          last_name: user.user_metadata.last_name,
          ssn_or_id,
          phone,
          street_address,
          city,
          state,
          zip_code,
          country,
          account_type,
          account_number: generateAccountNumber(),
          routing_number: "075915826"
        }
      ]);

      if (error) {
        msgDiv.textContent = `Error creating ${account_type} account: ${error.message}`;
        return;
      }
    }

    msgDiv.textContent = "Account(s) created successfully!";
    openAccountForm.reset();
  });
}
