import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUDE_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (localFilePath) =>{
  try {
    if(!localFilePath) return null
    // upload the file on clodinary
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type:"auto"
    })
    //file has been uploaded successfully
    console.log("File has been uploaded successfully !", response.url)
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath) // removes the locally saved temporary file as the upload operation got failed
    return null
  }
}

export { uploadOnCloudinary }


// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUDE_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null;

//         const response = await cloudinary.uploader.upload(
//             localFilePath,
//             {
//                 resource_type: "auto"
//             }
//         );

//         console.log(
//             "File uploaded successfully!",
//             response.secure_url
//         );

//         // Delete local file only after successful upload
//         fs.unlink(localFilePath, (error) => {
//             if (error) {
//                 console.error("Could not delete temp file:", error.message);
//             }
//         });

//         return response;

//     } catch (error) {
//         console.error("Cloudinary upload failed:", error.message);

//         // Keep the local file so you can debug the issue
//         return null;
//     }
// };

// export { uploadOnCloudinary };
