import { v2 as cloudinary } from "cloudinary"
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
function extractPublicIdFromCloudinaryUrl(url) {
    try {
       
        const parts = url.split("/");
        const fileWithExtension = parts.pop();
        const publicId = fileWithExtension.split(".")[0]; // remove extension
       
        return publicId;
    } catch {
        return null;
    }
}

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) {
            console.log('File not found');
            return null;
        };
        //upload file on cloudinary
        const result=await cloudinary.uploader.upload(localFilePath, { 
            resource_type: "auto", 
        });
        
        // console.log(result.url);
        fs.unlinkSync(localFilePath);
        return result
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temp files as upload opn failed
        return null;
    }
}

const deleteOnCloudinary = async (oldAvatarUrl)=>{
    try {
        if(!oldAvatarUrl) {
            console.log('File not found');
            return null;
        };
        let result;
        
        const publicId = extractPublicIdFromCloudinaryUrl(oldAvatarUrl);
        console.log(publicId);
        if (publicId) {
            result=await cloudinary.uploader.destroy(publicId,{ resource_type: 'image'}); // delete old image
            // console.log(result);
        }
        return result;

    } catch (error) {

        return error.message;
    }
}
const deleteOnCloudinaryById = async (public_id, resource_type="image") => {
    try {
        if (!public_id) return null;

        //delete file from cloudinary
        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: `${resource_type}`
        });
        return result;
    } catch (error) {
        console.log("delete on cloudinary failed", error);
        return error;
    }
};

export { 
    uploadOnCloudinary,
    deleteOnCloudinary,
    deleteOnCloudinaryById };