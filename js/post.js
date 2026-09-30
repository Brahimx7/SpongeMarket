import { supabase } from "./supabase.js";
import { Toast } from "./components/toast.js" ; 
const postBtn = document.getElementById("postBtn");

const params = new URLSearchParams(window.location.search);
const editProductId = params.get("editproduct");


 let currentImage = null;

   if(editProductId){
  const edit = document.getElementById("post");
  edit.textContent="Edit Your Product" ;

  const { data : productInfo , error : productInfoError} = await supabase.from("products")
  .select("*").eq("id",editProductId).single();
  if(productInfoError){
    console.log(productInfoError);
  }


 const title = document.getElementById('title');
 const price = document.getElementById('price');
 const category = document.getElementById('category');
 const condition = document.getElementById('condition');
 const location = document.getElementById('location');
 const description = document.getElementById('description');
 const phone = document.getElementById('phone');
 const imagelabel =  document.getElementById('imagelabel'); 
 const button = document.getElementById('submit'); 


   title.value=productInfo.title;
   price.value=productInfo.price;
   category.value=productInfo.category;
   condition.value=productInfo.condition;
   location.value=productInfo.location;
   phone.value=productInfo.phone;
   currentImage = productInfo.image;
   description.value=productInfo.description;
   imagelabel.textContent="Select a new image (optional)";
  button.textContent = "Save changes";

}


const form = document.getElementById('productForm');


  form.addEventListener('submit', async (e) => {


                       e.preventDefault(); 
                             const {
                               data: { user },
                             } = await supabase.auth.getUser();
                             
                             if (!user) {
                               alert("Please log in first.");
                               return;
                                        }
                        console.log('Form submitted');
                           let imageUrl;

                          const title = document.getElementById('title').value;
                        const price = document.getElementById('price').value;
                        const category = document.getElementById('category').value;
                        const condition = document.getElementById('condition').value;
                        const location = document.getElementById('location').value;
                        const description = document.getElementById('description').value;
                        const phone = document.getElementById('phone').value;
                        const imageFile = document.getElementById('image').files[0];
 

       if(editProductId){
           if(!imageFile){
             imageUrl = currentImage ;
            }
           else{
              const fileName = `${Date.now()}-${imageFile.name}`;
              const { error: uploadError } = await supabase.storage
                      .from("product-images")
                      .upload(fileName, imageFile);

                 if (uploadError) {
                  console.error(uploadError);
                  return;
                      }
                                 
                const { data: imageData } = await supabase.storage
               .from("product-images")
               .getPublicUrl(fileName);

               imageUrl = imageData.publicUrl;
              }
       

         const { data, error: updateError } = await supabase
         .from("products")
         .update({
           title,
           price: Number(price),
           category,
           condition,
           location,
           description,
           phone,
           image: imageUrl,
         })
         .eq("id", editProductId);

           if(updateError){
             console.log(updateError);
             return;
           }
           console.log("Product updated successfully!");
     }

else{
    
                        
                      
                          if (!imageFile) {
                             Toast("Please select an image.", "warning");
                            return;
                          }

                        const fileName = `${Date.now()}-${imageFile.name}`;

                     const { error: uploadError } = await supabase.storage
                         .from("product-images")
                          .upload(fileName, imageFile);

                         if (uploadError) {
                             console.error(uploadError);
                          alert(uploadError.message);
                              return;
                                         }
                                 
                         const { data: imageData } = supabase.storage
                          .from("product-images")
                          .getPublicUrl(fileName);

                             imageUrl = imageData.publicUrl;
                     
                                const { error: productError } = await supabase
                                 .from("products")
                                 .insert({
                                   title,
                                   price: Number(price),
                                   category,
                                   condition,
                                   location,
                                   description,
                                   phone,
                                   image: imageUrl,
                                   user_id: user.id
                                   });

                               if (productError) {
                                   console.error(productError);
                                   alert(productError.message);
                                   return;
                               }


}
                  
                           window.location.href = "index.html";
});




