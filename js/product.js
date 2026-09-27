import  { supabase } from "./supabase.js"
import { Toast } from "./components/toast.js" ; 

const params = new URLSearchParams(window.location.search);
const id = params.get("id");



const productImage = document.getElementById("productImage");
const productTitle = document.getElementById("productTitle");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");
const productCondition = document.getElementById("productCondition");
const productLocation = document.getElementById("productLocation");
const sellerName = document.getElementById("sellerName");
const sellerPhone = document.getElementById("sellerPhone");
const productCategory = document.getElementById("productCategory");

const { data: product , error : productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
    if (productError) {
        console.error(productError);
     } 

    const { data : products , error : productsError} = await supabase.from("products").select("*");
    if(productsError){
        window.alert(productsError);
    }

     const { data: sellerUsername, error: sellerUsernameError } =
    await supabase.rpc("get_public_profile", {
        seller_id: product.user_id
    });

if (sellerUsernameError) {
    console.log(sellerUsernameError);
}

const sellerProfile = sellerUsername[0];


    productImage.src = product.image;
    productTitle.textContent = product.title;
    productPrice.textContent = `$${product.price}`;
    productDescription.textContent = product.description;
    productCondition.textContent = product.condition;
    productLocation.textContent = product.location;
    sellerName.textContent =sellerProfile.username
    sellerPhone.textContent = product.phone;
    productCategory.textContent = product.category;


   const contactBtn = document.getElementById("contactBtn");
   const saveBtn = document.getElementById("saveBtn");
   


const {
    data: { user }
} = await supabase.auth.getUser();

contactBtn.addEventListener("click", async () => {

      if(!user){
        Toast("You need an account to use this feature. Please sign up first.", "warning");
                 return;
   }   

if (user.id === product.user_id) {
       Toast("You can't contact yourself.", "warning");
         return;
}



const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select("*")
    .eq("buyer_id", user.id)
    .eq("seller_id", product.user_id)
    .eq("product_id", product.id)
    .maybeSingle();

if (conversationError) {
    console.error(conversationError);
    return;
}
if (conversation) {
    window.location.href = `userProfile.html?tab=messages&conversation=${conversation.id}`;
    return;
}

const { data: newConversation, error: newConversationError } = await supabase
    .from("conversations")
    .insert({
        buyer_id: user.id,
        seller_id: product.user_id,
        product_id: product.id
    }).select().single();

 if (newConversationError) {
    console.error(newConversationError);
    return;
   }  
    
    window.location.href = `userProfile.html?tab=messages&conversation=${newConversation.id}`;
});


     
if(user){

async function isproductSaved(){
      const { data, error } = await supabase
          .from("savedproducts")
             .select("*")
               .eq("user_id", user.id)
                  .eq("product_id", id)
                     .maybeSingle();
   
        if (error) {
         console.log(error);
         return;
         }     
     if(data){
         return true;
     }
     else{
         return false;
     }
}
  
const answer = await isproductSaved();
if(answer){
   
    saveBtn.textContent = "❤️ Unsave Product";
}
else{
    saveBtn.textContent = "🤍 Save product";
}
saveBtn.addEventListener("click", async ()=>{

const saved = await isproductSaved(); 

  if(saved){

    const { error : deletesavedproductError} = await supabase.from("savedproducts")
    .delete().eq("user_id",user.id).eq("product_id",id); 
    if(deletesavedproductError){
        console.log(deletesavedproductError);
        return;
    }
       saveBtn.textContent = "🤍 Save product";
  }
  else{

    const { data : products , error : productsError } = await supabase.from("products").select("*").eq("user_id",user.id).eq("id",id).maybeSingle();
    if(productsError){
        console.log(productsError);
    }
    if(products){
              Toast( "You can´t save your own product.","warning");
                 return;
               
    }


   const { error : savedError} = await supabase.from("savedproducts").insert (
        {
            user_id : user.id,
            product_id : id
        }
    );

    if (savedError) {
    console.log(savedError);
    return;
       }
      saveBtn.textContent = "❤️ Unsave Product";

  }

    
});


}
if(!user){
      saveBtn.addEventListener("click", ()=>{
        Toast("You need an account to use this feature. Please sign up first.", "warning");
                  return;  
               });
              
}



sellerName.addEventListener("click", async()=>{
    const sellerId = product.user_id;
   window.location.href = `SellerProfile.html?SellerId=${sellerId}`;
});