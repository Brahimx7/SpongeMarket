import { supabase } from "../supabase.js";
import { notificationToast } from "./notifToast.js";

const { data: { user } } = await supabase.auth.getUser();
  supabase
    .channel("messages")
    .on(
        "postgres_changes",
        {
            event: "INSERT",
            schema: "public",
            table: "messages"
        },
       async  payload => {
            console.log(payload.new);
            if(!user || payload.new.sender_id === user.id){
                return;
            }
           
               console.log("someone sent a message");
             
            const { data: sender, error } = await supabase.rpc(
               "get_public_profile",
               {
                   seller_id: payload.new.sender_id
               }
             );

             const { data: conversation, error: conversationError } =
                  await supabase
                    .from("conversations")
                       .select("product_id")
                        .eq("id", payload.new.conversation_id)
                           .single();

                 if(conversationError){
                  console.log(conversationError);
                 }

                 const { data: product, error: productError } =
                     await supabase
                         .from("products")
                          .select("title")
                           .eq("id", conversation.product_id)
                            .single();
                 if(productError){
                  console.log(productError);
                 } 

                 const messagePreview = payload.new.message.length > 50
                  ? payload.new.message.slice(0, 50) + "..."
                     : payload.new.message;
                   
               console.log(messagePreview); 

               notificationToast(messagePreview,"info",`${sender[0].username} · ${product.title}`, payload.new.conversation_id);
                
              
         }).subscribe();

         