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

// API Controller function to manage clerk user with database
export const clerkWebhooks = async (req, res) => {
    try {
        // Log incoming request for debugging
        console.log("🎯 Webhook received:", req.headers, req.body);

        // Validate environment variable
        if (!process.env.CLERK_WEBHOOK_SECRET) {
            console.error("❌ Missing CLERK_WEBHOOK_SECRET");
            return res.status(500).json({
                success: false, 
                message: 'Webhook secret not configured'
            });
        }

        // Create a svix instance with clerk webhook secret
        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        
        // Get the request body as string for verification
        // If body is already a buffer (raw), convert to string
        // If body is an object, stringify it
        const payload = Buffer.isBuffer(req.body) ? req.body.toString() : JSON.stringify(req.body);
        
        // Prepare headers for verification
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        // Verify headers exist
        if (!headers["svix-id"] || !headers["svix-timestamp"] || !headers["svix-signature"]) {
            console.error("❌ Missing required svix headers");
            return res.status(400).json({
                success: false, 
                message: 'Missing required webhook headers'
            });
        }

        // Verify the webhook
        let evt;
        try {
            evt = webhook.verify(payload, headers);
        } catch (verifyError) {
            console.error("❌ Webhook verification failed:", verifyError.message);
            return res.status(400).json({
                success: false, 
                message: 'Webhook verification failed'
            });
        }

        // Extract data and type from verified event
        const { data, type } = evt;
        
        console.log(`📝 Processing event: ${type} for user: ${data?.id}`);

        // Switch case to handle different events
        switch (type) {
            case "user.created": {
                try {
                    // Validate required data
                    if (!data?.id || !data?.email_addresses?.[0]?.email_address) {
                        console.error("❌ Missing required user data for creation");
                        return res.status(400).json({
                            success: false, 
                            message: 'Missing required user data'
                        });
                    }

                    // Check if user already exists
                    const existingUser = await User.findById(data.id);
                    if (existingUser) {
                        console.log(`👤 User ${data.id} already exists, skipping creation`);
                        return res.status(200).json({ success: true, message: 'User already exists' });
                    }

                    const userData = {
                        _id: data.id,
                        email: data.email_addresses[0].email_address,
                        name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown User',
                        image: data.image_url || '',
                        resume: ''
                    };

                    await User.create(userData);
                    console.log(`✅ User created: ${data.id}`);
                    return res.status(200).json({ success: true, message: 'User created successfully' });

                } catch (createError) {
                    console.error("❌ Error creating user:", createError);
                    return res.status(500).json({
                        success: false, 
                        message: 'Failed to create user'
                    });
                }
            }

            case "user.updated": {
                try {
                    if (!data?.id) {
                        console.error("❌ Missing user ID for update");
                        return res.status(400).json({
                            success: false, 
                            message: 'Missing user ID'
                        });
                    }

                    const updateData = {};
                    
                    if (data.email_addresses?.[0]?.email_address) {
                        updateData.email = data.email_addresses[0].email_address;
                    }
                    
                    if (data.first_name || data.last_name) {
                        updateData.name = `${data.first_name || ''} ${data.last_name || ''}`.trim();
                    }
                    
                    if (data.image_url) {
                        updateData.image = data.image_url;
                    }

                    // Only update if we have data to update
                    if (Object.keys(updateData).length > 0) {
                        await User.findByIdAndUpdate(data.id, updateData);
                        console.log(`✅ User updated: ${data.id}`);
                    } else {
                        console.log(`⚠️ No update data for user: ${data.id}`);
                    }

                    return res.status(200).json({ success: true, message: 'User updated successfully' });

                } catch (updateError) {
                    console.error("❌ Error updating user:", updateError);
                    return res.status(500).json({
                        success: false, 
                        message: 'Failed to update user'
                    });
                }
            }

            case "user.deleted": {
                try {
                    if (!data?.id) {
                        console.error("❌ Missing user ID for deletion");
                        return res.status(400).json({
                            success: false, 
                            message: 'Missing user ID'
                        });
                    }

                    await User.findByIdAndDelete(data.id);
                    console.log(`✅ User deleted: ${data.id}`);
                    return res.status(200).json({ success: true, message: 'User deleted successfully' });

                } catch (deleteError) {
                    console.error("❌ Error deleting user:", deleteError);
                    return res.status(500).json({
                        success: false, 
                        message: 'Failed to delete user'
                    });
                }
            }

            default:
                console.log(`⚠️ Unhandled event type: ${type}`);
                return res.status(200).json({ success: true, message: 'Event received but not processed' });
        }

    } catch (error) {
        console.error("❌ Webhook controller error:", error);
        return res.status(500).json({
            success: false, 
            message: 'Internal server error'
        });
    }
};
