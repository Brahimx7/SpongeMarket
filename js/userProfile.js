
import { supabase } from "./supabase.js"
import { Toast } from "./components/toast.js" ; 

const productdiv = document.getElementById("userproducts");
const params = new URLSearchParams(window.location.search);
const { data : { user } } = await supabase.auth.getUser();
const signupLink = document.getElementById("signupLink");
signupLink.classList.add("active");
if (!user) {
    window.location.href = "Login.html";
}

     const profileUsername = document.getElementById("profileUsername");
      const profilemail = document.getElementById("profilemail");
      const profileproducts = document.getElementById("profileproducts");
      const profilejoined = document.getElementById("profilejoined");
      const aboutAvatarImg = document.getElementById("aboutAvatarImg");
      const settingsAvatarImg = document.getElementById("settingsAvatarImg");
    
      const { data: profile, error: profileError } =
             await supabase
                  .from("users")
                  .select("username, Avatar_url,email")
                   .eq("id", user.id)
                    .single();

          if (profileError) {
               console.log(profileError);
              }
      if(!profile.Avatar_url){
        aboutAvatarImg.src = ("/AvatarImg/defaultAvatar.png");
        settingsAvatarImg.src = ("/AvatarImg/defaultAvatar.png");
      } 
      else{
        aboutAvatarImg.src= profile.Avatar_url;
       settingsAvatarImg.src= profile.Avatar_url;
      }
      profileUsername.textContent = profile.username;
      profilemail.textContent = profile.email;
     
     const joinedDate = new Date(user.created_at);
     profilejoined.textContent = joinedDate.toLocaleString();


const { data : products , error : productsError} 
=
await supabase.from("products").select("*").eq("user_id",user.id);

if (productsError) {
    console.error(productsError);
}
const illustrations = document.getElementById("illustrations");

if (products.length === 0) {
    illustrations.classList.remove("hidden");
}

else {
   illustrations.classList.add("hidden");
     
    let html = "";
 profileproducts.textContent = products.length;
    products.forEach(product => {
        
        html += `
            <div class="product-card">

                <img src="${product.image}" alt="${product.title}">

                <h3>${product.title}</h3>

                <p>$${product.price}</p>

                <p>${product.location}</p>

               <div class="buttons">
                   <button class="details-btn" data-id="${product.id}">
                      View Details
                    </button>
                     <button class="edit-btn" data-id="${product.id}">✏️ Edit </button>
               </div>
                  <button
                  class="delete-btn"
                          data-id="${product.id}"
                             data-title="${product.title}" id="delete-btn">
                             🗑 Delete
                      </button>
                      
               
            </div>
        `;

    });
     productdiv.innerHTML = html;

    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(editButton => {
        editButton.addEventListener("click", ()=>{
            const editproductID = editButton.dataset.id;
            window.location.href=(`postproduct.html?editproduct=${editproductID}`);
        });
    });

  
   const deleteButtons = document.querySelectorAll(".delete-btn");
    const deleteModal = document.getElementById("deleteModal");
   
    const cancelDelete = document.getElementById("cancelDelete");
    const confirmDelete = document.getElementById("confirmDelete");

    let productToDelete = null;
  

const deleteTitle = document.getElementById("deleteTitle");

deleteButtons.forEach(button => {
    button.addEventListener("click", async () => {

        const currentProductID = button.dataset.id;

        const { data: product, error: productError } = await supabase
            .from("products")
            .select("title")
            .eq("id", currentProductID)
            .single();

        if (productError) {
            console.error(productError);
            return;
        }

        deleteTitle.textContent = `Delete "${product.title}"?`;

        productToDelete = currentProductID;

        deleteModal.classList.remove("hidden");
    });
});

        cancelDelete.addEventListener("click", ()=>{
              deleteModal.classList.add("hidden");
              return ;
           });



confirmDelete.addEventListener("click", async () => {

            const { data: conversations, error: conversationsError } = await supabase
                .from("conversations")
                .select("id")
                .eq("product_id", productToDelete);

            if (conversationsError) {
                console.error(conversationsError);
                return;
            }

            // Delete all messages in each conversation
            for (const conversation of conversations) {

                const { error: messagesDeleteError } = await supabase
                    .from("messages")
                    .delete()
                   .eq("conversation_id", conversation.id);


                if (messagesDeleteError) {
                    alert(messagesDeleteError.message);
                    return;
                }
            }

            // Delete conversations
            const { error: conversationsDeleteError } = await supabase
                .from("conversations")
                .delete()
                .eq("product_id", productToDelete);

            if (conversationsDeleteError) {
                console.error(conversationsDeleteError);
                return;
            }

            const { error: savedProductsDeleteError } = await supabase
               .rpc("remove_saved_products_for_product", {
                   product_id_to_delete: productToDelete
               });
           
           if (savedProductsDeleteError) {
               console.error(savedProductsDeleteError);
               return;
           }

            const { error: productDeleteError } = await supabase
                .from("products")
                .delete()
               .eq("id", productToDelete);

            if (productDeleteError) {
                console.error(productDeleteError);
                return;
            }

      
            deleteModal.classList.add("hidden");
            productToDelete = null;
            window.location.reload();
});
    

    const detailsButtons = document.querySelectorAll(".details-btn");

    detailsButtons.forEach(button => {

        button.addEventListener("click", () => {

            const id = button.dataset.id;

            window.location.href = `product.html?id=${id}`;

        });

    });

}

const conversationId = params.get("conversation");

const aboutBtn = document.getElementById("aboutBtn");
const favoritesBtn = document.getElementById("favoritesBtn");
const messagesBtn = document.getElementById("messagesBtn");
const settingsBtn = document.getElementById("settingsBtn");
const aboutSection = document.getElementById("aboutSection");
const favoritesSection = document.getElementById("favoritesSection");
const messagesSection = document.getElementById("messagesSection");
const settingsSection = document.getElementById("settingsSection");

function hideSections(){
   [aboutSection, favoritesSection, messagesSection, settingsSection ].forEach(s => {
    s.classList.add("hidden");
    s.classList.remove("shown");
    s.classList.remove("section");
  });
}

function removeActiveClasses(){
   [aboutBtn, favoritesBtn, messagesBtn, settingsBtn ].forEach(b => {
    b.classList.remove("active");
  });
}
hideSections();
removeActiveClasses();
 aboutSection.classList.add("shown");
  aboutBtn.classList.add("active");

aboutBtn.addEventListener("click", () => {
  
    
    const wasHiddenabout = aboutSection.classList.contains("hidden");
    removeActiveClasses();
    aboutBtn.classList.add("active");
    hideSections();
     if(wasHiddenabout){
        aboutSection.classList.remove("hidden");
        aboutSection.classList.add("shown");
       
     }
    
});

/*conversationList.classList.add("hidden");
       chatArea.classList.remove("chatphone");
       chatArea.classList.add("hidden");*/


const savedProductsContainer = document.getElementById("savedproducts");

favoritesBtn.addEventListener("click", async () => {
        removeActiveClasses();
       favoritesBtn.classList.add("active");

       const wasHiddenfavorite = favoritesSection.classList.contains("hidden");
    
       hideSections();
        if(wasHiddenfavorite){
           favoritesSection.classList.remove("hidden");
           favoritesSection.classList.add("shown");
       
           }

       const { data : savedproducts , error : savedError} = await supabase.from("savedproducts").select("*").eq("user_id",user.id);
       if(savedError){
          console.log(savedError);
          return;
         }
       const productIds = savedproducts.map(item => item.product_id);
       if (productIds.length === 0) {
          favoritesSection.innerHTML = `
                     <div id="illustrations2"> 
                      <img src="AvatarImg/sadSquidward.png" alt="NoProducts" id="sadSquidward">
                       <img src="AvatarImg/message.png" alt="messageIcon" id="messageIcon2">
                       <p id="noProductsSaved">You haven't saved <br>any products yet.</p>
                      </div>` 
                     ;
           return;
          }
          else{
            const illustrations2 = document.getElementById("illustrations2");
            if(illustrations2){
              illustrations2.classList.add("hidden");
            }
          }


       const { data : productssaved , error : productssavedError} = await supabase.from("products").select("*").in("id",productIds);
       if(productssavedError){
          console.log(productssavedError);
          return ;
       }
        let html = "";
         productssaved.forEach(productsaved => {
        
           html += `
               <div class="product-card">

                   <img src="${productsaved.image}" alt="${productsaved.title}">

                   <h3>${productsaved.title}</h3>

                   <p>$${productsaved.price}</p>

                   <p>${productsaved.location}</p>
              
                  <div class="buttons">
                     <button class="details-btn" data-id="${productsaved.id}">
                          View Details
                     </button>

                       <button
                      class="delete-btn"
                              data-id="${productsaved.id}"
                                 data-title="${productsaved.title}">
                                 ❤️ Unsave Product
                          </button>
                
                    </div>
               </div>
           `;

            });

    
            savedProductsContainer.innerHTML = html;

            const unsaveproducts = document.querySelectorAll(".delete-btn");

            unsaveproducts.forEach(product => {
                product.addEventListener("click", async () =>{
                    const unsaveproductID = product.dataset.id;
                   const { error : unsaveproductError } = await supabase.from("savedproducts").delete().eq("user_id",user.id).eq("product_id",unsaveproductID);
                   if(unsaveproductError){
                    console.log(unsaveproductError);
                    return
                   }
                    window.location.reload();
                });
   
                        });


      const detailsButtons = document.querySelectorAll(".details-btn");

       detailsButtons.forEach(button => {

           button.addEventListener("click", () => {

              const id = button.dataset.id;

               window.location.href = `product.html?id=${id}`;

           });

       });

});




      const conversationList = document.getElementById("conversationList");
      const messagesContainer = document.getElementById("messagesContainer");
      const messageInput = document.getElementById("messageInput");
      const sendBtn = document.getElementById("sendBtn");
      let currentConversation = null;

     




  supabase
    .channel("messages")
    .on(
        "postgres_changes",
        {
            event: "INSERT",
            schema: "public",
            table: "messages"
        },
        payload => {

            const conversationId = payload.new.conversation_id;

          if (
              currentConversation &&
              conversationId === currentConversation.id
          ) 
          {
              addMessage(payload.new);

              const div = document.querySelector(
                  `[data-conversation-id="${conversationId}"]`
              );

              if (div) {
                  conversationList.prepend(div);
              }

              return;
          }
            const div = document.querySelector(
                `[data-conversation-id="${conversationId}"]`
            );

            if (div) {
                updateUnreadBadge(conversationId, div);
                conversationList.prepend(div);
            }

            updateTotalUnread();
        }
    ).on(
    "postgres_changes",
    {
        event: "UPDATE",
        schema: "public",
        table: "messages"
    }, payload => {

            const message = payload.new;

            if (
                currentConversation &&
                message.conversation_id === currentConversation.id
            ) {

                const p = document.querySelector(
                    `[data-message-id="${message.id}"]`
                );

                if (p) {
                    p.textContent = message.message;
                }
            }
        }
    ).on(
    "postgres_changes",
    {
        event: "DELETE",
        schema: "public",
        table: "messages"
    },
    payload => {

        const messageId = payload.old.id;

        const p = document.querySelector(
            `[data-message-id="${messageId}"]`
        );

        if (p) {
            p.remove();
          }
       }
      )
    .subscribe();


let currentMenu = null;
let editingMessage = null;
let editingElement = null;

function showMessageMenu(message, p, x, y) {

    if (currentMenu) {
        currentMenu.remove();
    }

    const menu = document.createElement("div");
    menu.classList.add("menu");
    currentMenu = menu;

    const deleteOption = document.createElement("button");
    const editOption = document.createElement("button");

    deleteOption.classList.add("deleteOption");
    editOption.classList.add("editOption");

    deleteOption.textContent = "🗑️ Delete";
    editOption.textContent = "✏️ Edit";

    menu.appendChild(deleteOption);
    menu.appendChild(editOption);

    document.body.appendChild(menu);

    menu.style.left = x + "px";
    menu.style.top = y + "px";


    deleteOption.addEventListener("click", async () => {

        messageInput.value = "";

        const { data , error: deleteError } = await supabase
            .from("messages")
            .delete()
            .eq("id", message.id).select();
            console.log("deleted message :: " ,data);

        if (deleteError) {
            console.log(deleteError);
            return;
        }

        p.remove();

        currentMenu.remove();
        currentMenu = null;

        sendBtn.textContent = "Send";
    });


    editOption.addEventListener("click", () => {

        editingMessage = message;
        editingElement = p;

        messageInput.value = editingMessage.message;
        messageInput.focus();

        currentMenu.remove();
        currentMenu = null;

        sendBtn.textContent = "Save";
    });
}
      

function addMessage(message) {

    const p = document.createElement("p");
     p.dataset.messageId = message.id;
     
    p.textContent = message.message;

     if (message.sender_id === user.id) {
             p.classList.add("my-message");

            p.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            showMessageMenu(message,p,event.clientX,event.clientY);
            });

                let pressTimer;
                   p.addEventListener("touchstart", (event) => {
                   pressTimer = setTimeout(() => {
                    event.preventDefault();
                    const touch = event.touches[0];
                     showMessageMenu(message,p,touch.clientX,touch.clientY);
                    }, 500);
                 });

               p.addEventListener("touchend", () => {
                 clearTimeout(pressTimer);
                });

                  p.addEventListener("touchmove", () => {
                   clearTimeout(pressTimer);
                  });
       }
           
           else {
            p.classList.add("other-message");
             }


    messagesContainer.appendChild(p);
    
}



document.addEventListener("click", (event) => {

    if (currentMenu && !currentMenu.contains(event.target)) {

        currentMenu.remove();
        currentMenu = null;
    }
});




async function updateUnreadBadge(conversationId, div) {
    const { data: unreadMessages, error } = await supabase
        .from("messages")
        .select("id")
        .eq("conversation_id", conversationId)
        .eq("is_read", false)
        .neq("sender_id", user.id);

    if (error) {
        console.error(error);
        return;
    }

    // Remove existing badge
    const oldBadge = div.querySelector(".unread-badge");

    if (oldBadge) {
        oldBadge.remove();
    }

    // Add new badge if there are unread messages
    if (unreadMessages.length > 0) {
        const badge = document.createElement("span");

        badge.textContent = `+${unreadMessages.length}`;
        badge.classList.add("unread-badge");

        div.appendChild(badge);
    }
}


async function updateTotalUnread() {

   
    const { data: conversations, error: conversationsError } = await supabase
        .from("conversations")
        .select("id")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

    if (conversationsError) {
        console.error(conversationsError);
        return;
    }

    if (conversations.length === 0) {
        return;
    }

    const conversationIds = conversations.map(conversation => conversation.id);

   
    const { data: unreadMessages, error: unreadError } = await supabase
        .from("messages")
        .select("id")
        .in("conversation_id", conversationIds)
        .eq("is_read", false)
        .neq("sender_id", user.id);

    if (unreadError) {
        console.error(unreadError);
        return;
    }

   
    const oldBadge = messagesBtn.querySelector(".total-unread-badge");

    if (oldBadge) {
        oldBadge.remove();
    }

  
    if (unreadMessages.length > 0) {

        const badge = document.createElement("span");

        badge.textContent = `+${unreadMessages.length}`;
        badge.classList.add("total-unread-badge");

        messagesBtn.appendChild(badge);
    }
}

await updateTotalUnread();



async function openMessages() {
  
           
                     removeActiveClasses();
                    const wasHiddenmessages = messagesSection.classList.contains("hidden");       
                    hideSections();

                    if (wasHiddenmessages) {
                          messagesSection.classList.remove("hidden");
                        messagesSection.classList.add("section");
                                            }
                      if (!wasHiddenmessages) {
                            return;
                            }                    
                                            

                   
                            conversationList.innerHTML = "";

                            const { data: conversations, error: conversationsError } = await supabase
                                        .from("conversations")
                                                 .select("*")
                                                        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

                    if (conversationsError) {
                                console.error(conversationsError);
                                return;
                                            }
           
            let conversationsWithLatestMessage = [];
            let conversationsWithLatestMessageInOrder ;

           for(const conversation of conversations){
                 
                 
                 console.log("CLICKED CONVERSATION:", conversation.id);

                const { data : conversationMessages , error : conversationMessagesErorr} = 
                await supabase.from("messages").select("*").
                eq("conversation_id",conversation.id).order("created_at",{ ascending : true});

                if(conversationMessagesErorr){
                    console.log(conversationMessagesErorr);
                    return;
                }
                conversationsWithLatestMessage.push({
                    conversation : conversation ,
                    latestMessage : conversationMessages[conversationMessages.length - 1]
                });
               

             }
           
      conversationsWithLatestMessageInOrder = [...conversationsWithLatestMessage].sort(
                    (a, b) => {
                              const timeA = a.latestMessage
                               ? new Date(a.latestMessage.created_at).getTime()
                               : 0;

                               const timeB = b.latestMessage
                               ? new Date(b.latestMessage.created_at).getTime()
                               : 0;

                    return timeB - timeA;
                                 }
                        );
                console.log("conversation with latest message in order : " ,conversationsWithLatestMessageInOrder);

           for(const orderedConversation of conversationsWithLatestMessageInOrder){
                       const conversation = orderedConversation.conversation ; 
                       const div = document.createElement("div");
                      div.classList.add("conversation");
                      div.dataset.conversationId = conversation.id;
                       let otherUserId = null;
                
                      if(conversation.seller_id===user.id){
                        otherUserId = conversation.buyer_id;
                      }
                      else{
                        otherUserId = conversation.seller_id;
                      }
                   const { data: otheruserName, error: otheruserNameError } =
                                  await supabase.rpc("get_public_profile", {
                                      seller_id: otherUserId
                                  });

                              if (otheruserNameError) {
                                  console.log(otheruserNameError);
                                  return;
                              }

                              div.textContent = otheruserName[0].username;

                           const { data: unreadMessages, error: unreadMessagesError } =
                             await supabase
                                 .from("messages")
                                .select("*")
                               .eq("conversation_id", conversation.id)
                               .eq("is_read", false)
                               .neq("sender_id", user.id);
                    
                         if (unreadMessagesError) {
                           console.log(unreadMessagesError);
                            return;
                        }

                       if (unreadMessages.length > 0) {
                            const badge = document.createElement("span");

                           badge.textContent = `+${unreadMessages.length}`;
                            badge.classList.add("unread-badge");

                           div.appendChild(badge);
                                        }

                      conversationList.appendChild(div);

                  div.addEventListener("click", async () => {
                      console.log("CLICKED CONVERSATION:", conversation.id);
                         sendBtn.classList.add("shown");
                         messageInput.classList.add("shown");
                         chatArea.classList.remove("hidden");
                         chatArea.classList.add("chatphone");
                        currentConversation = conversation;

                        const productName = document.getElementById("productName");
                        const { data : productTitle , error : productTitleError } = 
                        await supabase.from("products").select("*").eq("id",currentConversation.product_id).single();
                          if(productTitleError){
                            console.log(productTitleError);
                            return;
                          }
                          productName.textContent = productTitle.title;

                          document.querySelectorAll(".conversation").forEach(conversation => {
                            conversation.classList.remove("active");
                          });
                          div.classList.add("active");

                          const { data : unreadMessages , error: unreadMessagesError } = 
                          await supabase.from("messages").select("*").eq("conversation_id",currentConversation.id)
                          .eq("is_read",false).neq("sender_id",user.id);
                          if(unreadMessagesError){
                            console.log(unreadMessagesError);
                            return;
                          }
                          // removing the unsean messages number after opening the message
                          const badge = div.querySelector(".unread-badge");
                          if(badge){
                            badge.remove();
                          }

                         

                           const { error: readError } = await supabase.from("messages").update({ is_read: true })
                          .eq("conversation_id", currentConversation.id).eq("is_read", false).neq("sender_id", user.id);
                          if (readError){
                            console.error(readError);
                           return;
                          }
                          updateTotalUnread();
                      console.log("CURRENT CONVERSATION:", currentConversation);
                      console.log("CONVERSATION ID:", currentConversation.id); 
                    const{ data: messages, error: messagesError } = await supabase.from("messages").
                    select("*").eq("conversation_id",currentConversation.id).order("created_at", { ascending: true });
                     console.log("MESSAGES LOADED:", messages);
                     if(messagesError){
                        console.log(messagesError);
                         return;
                     }
                     messagesContainer.innerHTML = "";
                     messages.forEach(message =>{
                        addMessage(message);
                     });


                     messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    
                       
                });

                 if (conversation.id == conversationId) {
                        div.click();
                     }
          }      




      
                                                         
           messagesContainer.scrollTop = messagesContainer.scrollHeight;
           console.log("Send button clicked");
          
        
}

  sendBtn.addEventListener("click", async () =>      {

              if (!currentConversation) {
              alert("Select a conversation first.");
              return;
              }
              if(messageInput.value.trim() === ""){
                  return;
              }

               if (editingMessage) { 
                   const { error : editError } = await supabase.from("messages")
                   .update({ message : messageInput.value}).eq("id",editingMessage.id);
                   if(editError){
                      console.log(editError);
                      return;
                   }
                   editingElement.textContent = messageInput.value;
                   messageInput.value = "";
                   sendBtn.textContent = "Send";
                   editingMessage = null;
                   editingElement = null;
                   return;
               }
           
              const { data: newMessage ,  error : sendError} = await supabase.from("messages").insert(
               {
               conversation_id : currentConversation.id  ,
                message : messageInput.value ,
              sender_id : user.id
                 }
                  ).select().single();

             if (sendError) {
              console.error(sendError);
              return;
          }
          
          messageInput.value = "";
           messagesContainer.scrollTop = messagesContainer.scrollHeight;
       });                                                  

messagesBtn.addEventListener("click", openMessages);

 if (conversationId) {  await openMessages(); }
                                                         




// ===== SETTINGS =====
const settingsUsername = document.getElementById("settingsUsername");
const settingsEmail = document.getElementById("settingsEmail");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const avatarInput = document.getElementById("avatarInput");
const uploadAvatarBtn = document.getElementById("uploadAvatarBtn");
const removeAvatarBtn = document.getElementById("removeAvatarBtn");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const savePasswordBtn = document.getElementById("savePasswordBtn");
const logoutBtn = document.getElementById("logoutBtn");
const settingsMsg = document.getElementById("settingsMsg");
const settingsAvatarEmoji = document.getElementById("settingsAvatarEmoji");
const navUserImg = document.getElementById("navUserImg");
const navUsername = document.getElementById("navUsername");
const settingsBio = document.getElementById("settingsBio");
settingsBtn.addEventListener("click", () => {
  
    
    const wasHiddenSettings = settingsSection.classList.contains("hidden");
    removeActiveClasses();
    settingsBtn.classList.add("active");
    hideSections();
     if(wasHiddenSettings){
        settingsSection.classList.remove("hidden");
        settingsSection.classList.add("shown");
       
     }
    
});

uploadAvatarBtn.addEventListener("click", async () => {
    avatarInput.click();
});

avatarInput.addEventListener("change", async () => {
     const AvatarFile = avatarInput.files[0];
     const AvatarFileName = `${user.id}/${Date.now()}-${AvatarFile.name}`;
    const { error : AvatarUploadError } = await supabase.storage.from("avatars").upload(AvatarFileName, AvatarFile);
    if(AvatarUploadError) {
        console.log(AvatarUploadError);
        return;
    }

    const { data: { publicUrl: AvatarUrl } } = supabase.storage.from("avatars").getPublicUrl(AvatarFileName);
    const { error : UpdateError } = await supabase.from("users").update({
      Avatar_url : AvatarUrl
    }).eq("id",user.id);

    if(UpdateError){
        console.log(UpdateError);
        return;
    }
   settingsAvatarImg.src = AvatarUrl;
   aboutAvatarImg.src=AvatarUrl;
   navUserImg.src=AvatarUrl;

});


saveProfileBtn.addEventListener("click" , async()=> {
        if(settingsUsername.value){
            const { error } = await supabase.from("users").update(
                {
                    username : settingsUsername.value
                }
              ).eq("id",user.id);
              if(error){
                console.log(error);
              }
            
              const { data: profile, error: profileError } =
                       await supabase
                          .from("users")
                            .select("username")
                               .eq("id", user.id)
                                  .single();

               if (profileError) {
                    console.log(profileError);
                    return;
               }
              profileUsername.textContent = profile.username;
            navUsername.textContent = settingsUsername.value;
     
              Toast("Username updated successfully.","success" );
                
           

           settingsUsername.value= "";
         }


           if (settingsEmail.value) {

          const { error } = await supabase.auth.updateUser(
                {
                    email: settingsEmail.value
                },
                {
                 emailRedirectTo: `${window.location.origin}/verified.html`
                }
            );

            if (error) {
                console.log(error);
                return;
            }

          localStorage.setItem(
                "pendingEmailUpdate",
                  settingsEmail.value
                );

             Toast("A verification email has been sent to your new email address. Please verify it to complete the change.", "info");
              return;
        }

      if(settingsBio.value){
        const { error : BioError} = await supabase.from("users").update({
            userBio : settingsBio.value
        }).eq("id",user.id);
        if(BioError){
            console.log(BioError);
        }
         Toast("Bio updated successfully.","success");
            settingsBio.value="";    
           
      }


      
      
});


       const emailVerified =
       localStorage.getItem("NewEmailverificationComplete");

         if (emailVerified === "true") {
             const { data: { user } } = await supabase.auth.getUser();

               profilemail.textContent = user.email;
               localStorage.removeItem("NewEmailverificationComplete");
          }




 savePasswordBtn.addEventListener("click", async () => {

    if (!newPassword.value || !confirmPassword.value) {
        console.log("Please fill both password fields.");
        return;
    }

    if (newPassword.value !== confirmPassword.value) {
            
            Toast( "Passwords do not match.","warning"); 
              return;
    }

    if (newPassword.value.length < 6) {
     
                  Toast("Password must be at least 6 characters.","warning");
               return;
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword.value
    });

    if (error) {
        console.log("Password update error:", error);
        return;
    }

 
   

    newPassword.value = "";
    confirmPassword.value = "";

         
                 Toast("Password updated successfully.","success");   
});         



logoutBtn.addEventListener("click", async () => {

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.log("Logout error:", error);
        return;
    }

    window.location.href = "./index.html";
});




const FooterSaved = params.get("userIdSavedProducts");
if(FooterSaved){
     favoritesBtn.click();
}

const userMessagesFooter = params.get("userIdMessages");
if(userMessagesFooter){
     messagesBtn.click();
}