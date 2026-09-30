import { supabase } from "./supabase.js";

const loadingCard = document.getElementById("loading-card");
const successCard = document.getElementById("success-card");
const errorCard = document.getElementById("error-card");

const welcomeMsg = document.getElementById("welcome-msg");
const errorMsg = document.getElementById("error-msg");

const newEmail = localStorage.getItem("pendingEmailUpdate");


async function init() {

    try {


        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");


         if (code) {

            const { error: exchangeError } =
                await supabase.auth.exchangeCodeForSession(code);

            if (exchangeError) {
                console.error("Code exchange error:", exchangeError);
                showError("Could not verify your email.");
                return;
            }
        }

     
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.error("Get user error:", error);
            showError("Could not verify your account.");
            return;
        }

     
        if (!user) {
            showError("No user found. Please try clicking the confirmation link again.");
            return;
        }

       
        if (!user.email_confirmed_at) {
            showError("Your email has not been confirmed yet.");
            return;
        }

       
        const username = user.user_metadata?.username || "User";

       

        if (newEmail) {

               const { error: dbError } = await supabase
              .from("users")
              .update({
                  email: user.email
                   })
                    .eq("id", user.id);

         if (dbError) {
              console.error("Database error:", dbError);
              showError(
                  "Your email was verified, but we could not update your profile."
              );
              return;
               }

            localStorage.setItem("NewEmailverificationComplete", "true");
            localStorage.removeItem("pendingEmailUpdate");
           loadingCard.classList.add("hidden");
           successCard.classList.remove("hidden");
          
           welcomeMsg.textContent = `email updated Successfuly`; 
      
      } else {

            const { error: dbError } = await supabase
                 .from("users")
                  .insert({
                        id: user.id,
                        email: user.email,
                        username: username
                  });

              if (dbError) {
                  console.error("Database error:", dbError);
                 showError(
                      "Your email was verified, but we could not create your profile. Try again later."
                  );
                  return;
              }


              localStorage.setItem("verificationComplete", "true");


           loadingCard.classList.add("hidden");
           successCard.classList.remove("hidden");

           welcomeMsg.textContent = `Welcome to SpongeMarket, ${username}!`; 
          }

          } catch (error) {

              console.error("Verification error:", error);
              showError("An unexpected error occurred.");

          }
}


function showError(message) {

    loadingCard.classList.add("hidden");

    errorMsg.textContent = message;

    errorCard.classList.remove("hidden");
}




init();