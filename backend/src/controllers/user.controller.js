import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const generateAccessAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        // saving in user (basically in database so every thing which in model user that will get cicked in and hence require validation for that solution is below)

        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating the access token")
    }
}



const registerUser = asyncHandler( async (req , res)=>{
    // get user details from backend
    // validation - not empty
    // check if user already exists: username
    // check for images , check for avatar
    // create user object - create entry in db
    // remove password and refres token field from response
    // check for user creation
    // return res

    const {fullname, email, username,password} = req.body
    console.log("email", email);

    console.log(req.body)

    if([fullname,email,username,password].some((field)=> field?.trim() === "")){
        throw new ApiError(400, "All fileds are required")
    }

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath =  req.files?.avatar[0]?.path;
    // const coverImageLocalPath =  req.files?.coverImage[0]?.path;

    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }


    // console.log(req.files);
    console.log(avatarLocalPath);
    // console.log(avatar);


    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    // checking the user is created or not and then deselecting(or removing the fields which do not want )
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser, "User registered successfully !")
    )


})


const loginUser = asyncHandler(async (req, res)=>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and refresh token
    // send cookies for the user

    const {email, username,password} = req.body;

    if(!username || !email){
        throw new ApiError(400, "email or username is required for login")
    }

    const user = await User.findOne({
        $or:[{email},{username}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }
    // here User and user are different User is comming from mongoose which we made from mongoose model but 
    // so User will have the methods of mongoose and will not have the method that we have created

    // user this user will have all the method that we created for checking the user 
    // password field etc
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    // now here we have user which is comming from the line 119 so when we took the user 
    // from that line our refreshToken is empty since we call the method at line 136
    // hence we will have empty refreshToken so to get the refreshToken we have 2 options 
    // 1. update the user here 
    // 2. hit a new request to the database and get the refreshToken
    // now question is that if hitting the database is expesive then update the user here only 
    // or if it is not then hit the database ( apply the method accordigly )

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const options = {
            httpOnly:true,
            secure:true
        }

        return res
        .status(200)
        .cookie("accesToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user:loggedInUser,accessToken,
                    refreshToken
                },
                "User logged In Successfully"
            )
        )
    

})

export {
    registerUser,
    loginUser
}