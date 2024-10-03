import {
  getSingleUploadedMedia,
  uploadSingleMedia,
} from "../../util/helperFunctions";
import { UsersModel } from "../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "../../util/sendMail";

export class AuthService {
  public async register(userData: any) {
    const { email, username, password } = userData;

    const userWithEmailExists = await UsersModel.findOne({ where: { email } });

    if (userWithEmailExists)
      return {
        status: false,
        message: `User with email ${email} already exists`,
      };

    const salt: string = await bcrypt.genSalt(15);
    const hashPassword: string = await bcrypt.hash(password, salt);
    const otp = uuidv4();

    const newUser = {
      email,
      password: hashPassword,
      username,
      otp,
    };

    const newCreateUser = await UsersModel.create(newUser);
    await uploadSingleMedia(
      newCreateUser,
      "PROFILE_IMAGE",
      `https://api.dicebear.com/7.x/initials/svg?seed=${username}/svg?randomizeIds=false`,
    );

    try {
      await sendEmail(email, "OTP", `otp ${otp}`);
    } catch (err) {
      console.log("Error sending mail:", err);
    }

    return { status: true, message: "User registered successfully" };
  }

  public async login(credentials: any) {
    const { phoneNumber, email, password, userType } = credentials;

    if (!email && !phoneNumber) {
      return { status: false, message: "Provide email or phone number" };
    }

    if (userType === "student") {
      const emailPattern = /^(201[5-9]|20[2-9][0-9])en\d{4}@unijos\.edu\.ng$/;
      if (!emailPattern.test(email)) {
        return {
          status: false,
          message:
            "Provide a valid university of Jos faculty of engineering email.",
        };
      }
    }

    let userExists = email
      ? await UsersModel.findOne({ where: { email, userType } })
      : await UsersModel.findOne({ where: { phoneNumber, userType } });

    if (userExists) {
      const doesPasswordMatch = await bcrypt.compare(
        password,
        userExists.password,
      );
      if (doesPasswordMatch) {
        const jwtSecret: any = process.env.JWT_SECRET;
        const expirationTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
        const token = jwt.sign({ data: userExists }, jwtSecret, {
          expiresIn: expirationTime,
        });
        const profileImg = await getSingleUploadedMedia(
          userExists,
          "PROFILE_IMAGE",
        );
        return {
          status: true,
          message: "Login successful",
          data: { ...userExists?.dataValues, token, profileImg },
        };
      } else {
        return { status: false, message: "Password does not match" };
      }
    } else {
      return { status: false, message: "User not found" };
    }
  }

  public async verifyOtp(otp: string) {
    const userToBeVerified = await UsersModel.findOne({
      where: { otp, verified: false },
    });

    if (userToBeVerified) {
      await userToBeVerified.update({ verified: true });
      return { status: true, message: "OTP verified successfully" };
    } else {
      return { status: false, message: "Invalid OTP" };
    }
  }

  public async resendOtp(email: string) {
    const userToBeVerified:any = await UsersModel.findOne({
      where: { email, verified: false },
    });

    if (userToBeVerified) {
      const otp = uuidv4();
      await userToBeVerified.update({ otp });
     
      await sendEmail(email, "OTP", `Dear ${userToBeVerified?.fullName} your otp is  ${otp}`);
      return { status: true, message: `Verification link sent to ${email}` };
    } else {
      return { status: false, message: "Email already verified or invalid" };
    }
  }
}


