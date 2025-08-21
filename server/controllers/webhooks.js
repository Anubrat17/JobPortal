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
//         const {data,type} = req.body;
//         //switch case to handle different events
//         switch(type){
//             case "user.created":{
//                 const userData = {
//                     _id:data.id,
//                     email:data.email_addresses[0].email_address,
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
//                     email:data.email_addresses[0].email_address,
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

// Named export — this is important for `import { clerkWebhooks }`
export const clerkWebhooks = async (req, res) => {
  try {
    console.log("➡️ Webhook received!");

    // Svix verification
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await webhook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    });
    console.log("✅ Webhook verified successfully");

    // Parse raw body
    const { data, type } = JSON.parse(req.body.toString());
    console.log("📌 Event type:", type);
    console.log("📌 User data:", data);

    switch(type){
      case "user.created": {
        console.log("🟢 Creating user in DB:", data.id);
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || '',
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          image: data.image_url || '',
          resume: ''
        };

        await User.findOneAndUpdate(
          { _id: userData._id },
          userData,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log("💾 User saved successfully");
        return res.json({ success: true });
      }

      case "user.updated": {
        console.log("🟡 Updating user in DB:", data.id);
        const userData = {
          email: data.email_addresses?.[0]?.email_address || '',
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          image: data.image_url || ''
        };
        await User.findByIdAndUpdate(data.id, userData);
        console.log("💾 User updated successfully");
        return res.json({ success: true });
      }

      case "user.deleted": {
        console.log("🔴 Deleting user from DB:", data.id);
        await User.findByIdAndDelete(data.id);
        console.log("💾 User deleted successfully");
        return res.json({ success: true });
      }

      default:
        console.log("⚠️ Event type not handled:", type);
        return res.json({ success: false, message: "Event not handled" });
    }
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    return res.status(400).json({ success: false, message: 'Webhook verification failed' });
  }
};





