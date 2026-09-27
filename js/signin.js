import { supabase } from "./supabase.js";
import { Toast } from "./components/toast.js";

const signed = document.getElementById("signinform");
const successful_email_panel = document.getElementById("successful_email_panel");
 const close = document.getElementById("close");
 


signed?.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const username = document.getElementById("username").value.trim();
      const useremail = document.getElementById("useremail").value.trim();
      const userpassword = document.getElementById("pass").value;
      const confirmpassword = document.getElementById("confpass").value;

   
    
      if (userpassword !== confirmpassword) { 

       Toast("Passwords do not match!", "warning");
        return;

        }

       const { data: existingEmail, error: existingEmailError } = await supabase
        .from("users")
         .select("id")
          .eq("email", useremail)
            .maybeSingle();

  if (existingEmailError) {
    console.error("Error checking email:", emailCheckError);
   Toast("Could not check the email. Please try again.", "error");
    return;
  }

  if (existingEmail) {
    Toast("Email already exists");
    return;
  }

    try {
        localStorage.removeItem("verificationComplete");

           
           const  { data, error } = await supabase.auth.signUp(
             { 
                 email: useremail, 
                 password: userpassword, 
                 options: { 
                      data: { username: username }, 
                      emailRedirectTo: `${window.location.origin}/verified.html` 
            
                     }     
              }

                                                           );

                if (error) { 
              
                   Toast(error.message ,"try again later","error"); 
                   return; 
                    }  

                if (!data.user) { 
            
                   Toast("Signup failed. Please try again.","error"); 
                   return;

                  }

                  localStorage.setItem("pendingVerificationEmail", useremail); 
                  localStorage.setItem("pendingUsername", username);
                  localStorage.setItem("pendingUserId", data.user.id);


                  successful_email_panel.classList.remove("hidden");
                  successful_email_panel.classList.add("successful_email_message");
    
        }
         
         catch (error) {
            
            console.error("Signup error:", error); 
            Toast("An unexpected error occurred.","error"); 
        }

 });



                close?.addEventListener("click", () => { 
                    
                    successful_email_panel.classList.add("hidden");
                     successful_email_panel.classList.remove("successful_email_message");
                    
                    });



      window.addEventListener("storage", (event) => {

             if (event.key === "verificationComplete" && event.newValue === "true") {

               localStorage.removeItem("verificationComplete");

               localStorage.removeItem("pendingVerificationEmail");
               localStorage.removeItem("pendingUsername");
               localStorage.removeItem("pendingUserId");

                 window.location.href = "index.html";
                  
                    }

         });


