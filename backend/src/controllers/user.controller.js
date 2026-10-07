import { asyncHandler } from "../utils/asyncHandler.js"

const registerUser = asyncHandler( async (req , res)=>{
    // get user details from backend
    // validation - not empty
    // check if user already exists: username
    // check for images , check for avatar
    // create user object - create entry in db
    // remove password and refres token field from response
    // check for user creation
    // return res

    const {fullName, email, username,password} = req.body
    console.log("email", email);
})

export {
    registerUser
}