import { Webhook } from "svix";
import User from "../models/user.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("➡️ Webhook received!");

    // Create a svix instance with clerk webhook secret
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    
    // Convert raw buffer to string for webhook verification
    const payload = req.body.toString();
    
    // Verify headers
    await webhook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    });

    console.log("✅ Webhook verified successfully");

    // Parse the payload after verification
    const { data, type } = JSON.parse(payload);
    console.log("📌 Event type:", type);
    console.log("📌 User data:", data);

    // Switch case to handle different events
    switch(type) {
      case "user.created": {
        console.log("🟢 Creating user in DB:", data.id);
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || '',
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown User',
          image: data.image_url || '',
          resume: ''
        };
        
        await User.create(userData);
        console.log("💾 User created successfully:", userData);
        res.json({ success: true });
        break;
      }
      
      case "user.updated": {
        console.log("🟡 Updating user in DB:", data.id);
        const userData = {
          email: data.email_addresses?.[0]?.email_address || '',
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown User',
          image: data.image_url || '',
        };
        
        await User.findByIdAndUpdate(data.id, userData);
        console.log("💾 User updated successfully:", userData);
        res.json({ success: true });
        break;
      }
      
      case "user.deleted": {
        console.log("🔴 Deleting user from DB:", data.id);
        await User.findByIdAndDelete(data.id);
        console.log("💾 User deleted successfully");
        res.json({ success: true });
        break;
      }
      
      default:
        console.log("⚠️ Event type not handled:", type);
        res.json({ success: true });
        break;
    }
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.status(400).json({ success: false, message: 'Webhook verification failed' });
  }
};