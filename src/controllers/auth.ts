import { Request, Response } from "express";
import { UsersModel } from "../model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { sendUserMail } from "../../util/sendMail";
import { successHTML,errorHTML } from "../../template/emailVerification";
import { getSingleUploadedMedia,uploadSingleMedia } from "../../util/helperFunctions";

export class AuthController {
  public register = async (req: Request, res: Response) => {
    const { fullName, phoneNumber, email, password, userType,level } = req.body;

    try {
      if (userType === "student") {
        // Define the regex pattern for the email format
        const emailPattern = /^(201[5-9]|20[2-9][0-9])en\d{4}@unijos\.edu\.ng$/;
      
        // Test the email against the pattern
        if (!emailPattern.test(email)) {
          return res.json({
            status: false,
            message: "Provide a valid university of jos faculty of engineering email e.g 2018en0338@unijos.edu.ng",
          });
         
        } 
      } 
      const userWithEmailExists = await UsersModel.findOne({
        where: {
          email: email,
        },
      });
      const userWithPhoneExists = await UsersModel.findOne({
        where: {
          phoneNumber: phoneNumber,
        },
      });
      if (userWithEmailExists) {
        return res.json({
          status: false,
          message: `User with email ${email} already exists`,
        });
      }
      if (userWithPhoneExists) {
        return res.json({
          status: false,
          message: `User with phone number ${phoneNumber} already exists`,
        });
      }

      // Hash password
      const salt: string = await bcrypt.genSalt(15);
      const hashPassword: string = await bcrypt.hash(password, salt)
      const otp = uuidv4();
      let newUser:any;
     if(userType === "student"){
       // Create user
       newUser = {
        email,
        password: hashPassword,
        phoneNumber,
        fullName,
        userType,
        level,
        otp
      };
     
     }else{
       // Create user
       newUser = {
        email,
        password: hashPassword,
        phoneNumber,
        fullName,
        userType,
        otp
      }
     }

      // Save user to the database
     const newCreateUser = await UsersModel.create(newUser);
       //upload profile picture
       const uploadImage = await uploadSingleMedia(newCreateUser,"PROFILE_IMAGE","https://img.icons8.com/doodle/48/user-male-circle.png")
      //send mail notification
      try{
        const mail = sendUserMail(email,fullName,otp)
        console.log(res)
      }catch(err){
        console.log(err)
      }
     

      return res.json({
        status: true,
        message: "User registered successfully",
      });
    } catch (error) {
      return res.json({
        status: false,
        message: `An error occurred: ${error}`,
      });
    }
  };

  public login = async (req: Request, res: Response) => {
    const { phoneNumber, email, password, userType } = req.body;
    console.log(req.body);
    
    try {
      let userExists;
  
      if (!email && !phoneNumber) {
        return res.json({
          status: false,
          message: "Provide email or phone number",
        });
      }
      if (userType === "student") {
        // Define the regex pattern for the email format
        const emailPattern = /^(201[5-9]|20[2-9][0-9])en\d{4}@unijos\.edu\.ng$/;
      
        // Test the email against the pattern
        if (!emailPattern.test(email)) {
          return res.json({
            status: false,
            message: "Provide a valid university of jos faculty of engineering email e.g 2018en0338@unijos.edu.ng",
          });
         
        } 
      } 
      if (email) {
        userExists = await UsersModel.findOne({
          where: {
            email: email,
            userType: userType,
          },
        });
      } else if (phoneNumber) {
        userExists = await UsersModel.findOne({
          where: {
            phoneNumber: phoneNumber,
            userType: userType,
          },
          
        });
      }
  
      if (userExists) {
        console.log('found')
        const doesPasswordMatch = await bcrypt.compare(password, userExists.password);
  
        if (doesPasswordMatch) {
          const jwtSecret: any = process.env.JWT_SECRET;
          const expirationTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  
          const token = jwt.sign(
            {
              data: userExists, // Place your user data here
              exp: expirationTime,
            },
            jwtSecret,
          );
            const profileImg = await getSingleUploadedMedia(userExists, 'PROFILE_IMAGE')
          return res.json({
            status: true,
            message: "Login successful",
            data: { ...userExists?.dataValues, token: token,profileImg },
          });
        } else {
          return res.json({
            status: false,
            message: "Password does not match",
          });
        }
      } else {
        console.log('not found')
        return res.json({
          status: false,
          message: "User not found",
        });
      }
    } catch (error:any) {
      return res.json({
        status: false,
        message: `An error occurred: ${error.message || error}`,
      });
    }
  };
 
public verifyOtp = async (req: Request, res: Response) => {
  const otp = req.params?.otp;

  if (otp) {
    try {
      const userToBeVerified = await UsersModel.findOne({
        where: {
          otp: otp,
          verified: false,
        },
      });

      if (userToBeVerified) {
        // Update the 'verified' field to true
        await userToBeVerified.update({ verified: true });
        
        return res.send(successHTML);
      } else {
        
        return res.send(errorHTML);
      }
    } catch (err) {
      
      return res.send(errorHTML);
    }
  }
};
  public resendOtp  = async (req: Request, res: Response) => {
    
    const email = req.params?.email
    if(email){
        try{
          const userToBeVerified = await UsersModel.findOne({
            where: {
              email,
              verified: false
            },
          });
          if(userToBeVerified){
            let otp = uuidv4()
            await userToBeVerified.update({ otp: otp });
            try{
              const mail = sendUserMail(email,userToBeVerified.fullName,otp)
              return res.json({
                status:true,
                message: `verification link sent to ${email}`
              })
            }catch(err){
              console.log(err)
            }
          }else{
            return res.json({
              status:false,
              message:'Email already verified or invalid'
            })
          }
  }catch(err){
    return res.json({
      status:false,
      message:"an error occurred"+ err
    })
  }
    }else{
      return res.json({
        status:false,
        message:"enter a valid email"
      })
    }
}
  }

const authController = new AuthController();
export default authController;
