import fs from "fs"
import {v2 as cloudinary} from 'cloudinary';
import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (file) => {
    try {
        if (!fs.existsSync(file)) return null;
        const result = await cloudinary.uploader.upload(file, {
            resource_type:"auto"
        });
        console.log("file is uploaded successfully", result.url)
        fs.unlinkSync(file)
        return result;
    } catch (error) {
        fs.unlinkSync(file)// remove the locally saved temporary file because operation got failed
        console.log(error);
        return null;
    }
}

export {uploadOnCloudinary};