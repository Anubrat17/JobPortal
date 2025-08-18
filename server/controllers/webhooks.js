// import { Webhook } from "svix";
// import User from "../models/user.js";

// //API Controller function to manage clerk user with database
// export const clerkWebhooks = async (req, res) => {
//     try{
//         //create a svix instance with clerk webhook secret
//         const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
//         //verifying headers
//         await webhook.verify(JSON.stringify(req.body),{
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp": req.headers["svix-timestamp"],
//             "svix-signature": req.headers["svix-signature"]
//         })

//         // getting data from request body
//         const {data} = req.body;
//         //switch case to handle different events
//         switch(data.type){
//             case "user.created":{
//                 const userData = {
//                     _id:data.id,
//                     email:data.email_addresses[0].emailAddress,
//                     name: data.first_name + " " + data.last_name,
//                     image: data.image_url,
//                     resume:''
//                 }
//                 await User.create(userData);
//                 res.json({});
//                 break;
//             }
//             case "user.updated":{
//                  const userData = {
//                     email:data.email_addresses[0].emailAddress,
//                     name: data.first_name + " " + data.last_name,
//                     image: data.image_url,
//                 }
//                 await User.findByIdAndUpdate(data.id, userData);
//                 res.json({});
//                 break;
//             }
//             case "user.deleted":{
//                 await User.findByIdAndDelete(data.id);
//                 res.json({});   
//                 break;
//             }
//             default:
//                 break;
//         }   
//     }
//     catch(error){
//         console.log(error.message);
//         res.json({success: false, message: 'Webhook verification failed'});
//     }
// }


import { Webhook } from "svix";
import User from "../models/user.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // ✅ rawBody use karo yahan
    await webhook.verify(req.rawBody, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // ✅ type alag se lo
    const eventType = req.body.type;
    const data = req.body.data;

    switch (eventType) {
      case "user.created": {
        const userData = {
          _id: data.id, // make sure schema has _id: String
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
          resume: "",
        };
        await User.create(userData);
        res.json({ success: true });
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({ success: true });
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({ success: true });
        break;
      }

      default:
        res.json({ success: true, message: "Event ignored" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: "Webhook verification failed" });
  }
};
