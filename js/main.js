"use strict";

import { Navbar }  from './components/nav.js';
import { Footer } from "./components/footer.js";
import { supabase } from "./supabase.js";
import { Toast } from "./components/toast.js" ; 
//import { products } from './data/products.js'

const nav = document.getElementById("nav");
const foot = document.getElementById("foot");


if (nav) nav.innerHTML = Navbar();

const links = document.querySelectorAll(".connect a");

const currentPage = window.location.pathname.split("/").pop();

links.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }
});


if (foot) foot.innerHTML = Footer();


const explore = document.getElementById("startexploring");
if(explore) {
    explore.addEventListener("click" , ()=>{
        window.location.href="Market.html"
    }

)
}

const postBtn = document.getElementById("postBtn");

const {
  data: { user },
} = await supabase.auth.getUser();

 

    postBtn?.addEventListener("click", () => {
        console.log("Button clicked!");
        if (!user) {
        Toast("You need an account to use this feature. Please sign up first.", "warning");
         return ;
       }
        window.location.href = "postproduct.html";
    });

const signupLink = document.getElementById("signupLink");
const loginLink = document.getElementById("loginLink");


console.log(user);

if (user) {

    const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
  
       
    if (error) {
        console.error(error);
    } 
       
        signupLink.href = "userProfile.html";
        loginLink.textContent = "Logout";

          const avatar = profile.Avatar_url?  profile.Avatar_url : "./AvatarImg/defaultAvatar.png" ; 
            signupLink.innerHTML = `
              <div class="user">
                 <img id="navUserImg" src="${avatar}" alt="Avatar">
                  <p id="navUsername">${profile.username}</p>
              </div>
             `;


               loginLink.addEventListener("click", async (e) => {
                    e.preventDefault();

                    await supabase.auth.signOut();
                     window.location.href = "index.html";
         });


       
    }

   



const { data: usersCount, error: usersError } =
    await supabase.rpc("get_users_count");

if (usersError) {
    console.error(usersError);
}

const usersNumber = document.getElementById("usersCount");

if (usersNumber) {
    usersNumber.textContent = usersCount;
}


const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*");

if (productsError) {
    console.error(productsError);
}

const productsNumber = document.getElementById("productsCount");

if (productsNumber) {
    productsNumber.textContent = products.length;
}




const homeSearch = document.getElementById("homeSearch");

    homeSearch?.addEventListener("keydown", (e) => {
        console.log(e.key);
        
        if (e.key === "Enter") {
                
             if(homeSearch.value.trim() === ""){
                Toast("We couldn't find any products matching your search.", "info");
                       return ;
               }

            const value = homeSearch.value.trim();

            window.location.href =
                `Market.html?search=${encodeURIComponent(value)}`;

        }

    });



const categories = document.querySelectorAll(".usercat");

categories.forEach(categorie => {
    categorie.addEventListener("click", () => {
        
        const catvalue = categorie.textContent.trim();

        window.location.href = `Market.html?category=${encodeURIComponent(catvalue)}`;
    });
});


const brandBtn = document.getElementById("brandBtn");
brandBtn?.addEventListener("click",() => {
window.location.href="index.html";
});

const footerMarketBtn = document.getElementById("footerMarketBtn");
footerMarketBtn?.addEventListener("click",() => {
window.location.href="Market.html?Footercategory=All";
});


const footerSavedBtn = document.getElementById("footerSavedBtn");
footerSavedBtn?.addEventListener("click",()=>{
if(!user){
    Toast("You need an account to use this feature. Please sign up first.", "warning");
        return ;

}
window.location.href=`userProfile.html?userIdSavedProducts=${user.id}`;
});

const FooterMessagesBtn = document.getElementById("FooterMessagesBtn");
FooterMessagesBtn?.addEventListener("click",()=>{
  if(!user){
        Toast("You need an account to use this feature. Please sign up first.", "warning");
        return ;
}
window.location.href=`userProfile.html?userIdMessages=${user.id}`;
});

const FooterPostBtn = document.getElementById("FooterPostBtn");
FooterPostBtn?.addEventListener("click",()=>{
  if(!user){
 Toast("You need an account to use this feature. Please sign up first.", "warning");
 return ;
}
window.location.href=`postproduct.html`;
});

const FooterProfileBtn = document.getElementById("FooterProfileBtn");
FooterProfileBtn?.addEventListener("click",()=>{
  if(!user){
 Toast("You need an account to use this feature. Please sign up first.", "warning");
 return ;
}
window.location.href=`userProfil.html`;
});