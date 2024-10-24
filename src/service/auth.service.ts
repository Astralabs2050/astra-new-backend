import {
  getSingleUploadedMedia,
  uploadSingleMedia,
} from "../../util/helperFunctions";
import { UsersModel } from "../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "../../util/sendMail";
import {
  BrandModel,
  CreatorModel,
  ProjectModel,
  WorkExperienceModel,
} from "../model";
import { sequelize } from "../db";

interface Brand {
  id: string; // UUID for the user
  verified: boolean; // Indicates if the user is verified
  active: boolean; // Indicates if the user is active
  isAdmin: boolean; // Indicates if the user has admin privileges
  email: string; // User's email address
  updatedAt: string; // Timestamp for when the user was last updated
  createdAt: string; // Timestamp for when the user was created
  username: string; // User's username
  userId: string; // UUID of the user
  password?: string | null;
  otp?: string | null;
}

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
    const otp = uuidv4().substring(0, 4);

    const newUser = {
      email,
      password: hashPassword,
      username,
      otp,
    };

    const newCreateUser = await UsersModel.create(newUser);
    await uploadSingleMedia(
      newCreateUser?.id,
      "PROFILE_IMAGE",
      `https://api.dicebear.com/7.x/initials/svg?seed=${username}/svg?randomizeIds=false`,
      "user",
    );

    try {
      await sendEmail(email, "OTP", `otp ${otp}`);
    } catch (err) {
      console.log("Error sending mail:", err);
    }

    return { status: true, message: "User registered successfully" };
  }

  public async login(credentials: any) {
    const { email, password } = credentials;

    if (!email) {
      return { status: false, message: "Provide email " };
    }

    let userExists = await UsersModel.findOne({ where: { email } });

    if (userExists) {
      const doesPasswordMatch = await bcrypt.compare(
        password,
        userExists.password,
      );
      if (doesPasswordMatch) {
        const jwtSecret: any = process.env.JWT_SECRET;
        console.log("jwtSecret", jwtSecret);
        const expirationTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
        const token = jwt.sign({ data: userExists }, jwtSecret, {
          expiresIn: expirationTime,
        });
        delete userExists?.dataValues["password"];
        delete userExists?.dataValues["otp"];
        return {
          status: true,
          message: "Login successful",
          data: { ...userExists?.dataValues, token },
        };
      } else {
        return { status: false, message: "Password does not match" };
      }
    } else {
      return { status: false, message: "User not found" };
    }
  }

  public async verifyOtp(otp: string, email: string) {
    const userToBeVerified = await UsersModel.findOne({
      where: {
        email,
        otp,
        verified: false,
      },
    });

    if (userToBeVerified) {
      await userToBeVerified.update({ verified: true });
      return { status: true, message: "OTP verified successfully" };
    } else {
      return { status: false, message: "Invalid OTP" };
    }
  }

  public async resendOtp(email: string) {
    const userToBeVerified: any = await UsersModel.findOne({
      where: { email, verified: false },
    });

    if (userToBeVerified) {
      const otp = uuidv4().substring(0, 4);
      await userToBeVerified.update({ otp });
      await sendEmail(email, "Resend OTP", `Hello your otp is  ${otp}`);
      return { status: true, message: `OTP sent to ${email}` };
    } else {
      return { status: false, message: "Email already verified or invalid" };
    }
  }
  public async registerCreatorService(data: any) {
    const transaction = await sequelize.transaction();
    try {
      const { email, password, fullName, profileImage } = data;

      // Check if the user already exists
      const userWithEmailExists = await UsersModel.findOne({
        where: { email },
        transaction,
      });

      if (userWithEmailExists) {
        return {
          status: false,
          message: `User with email ${email} already exists`,
        };
      }

      // Hash the password
      const salt: string = await bcrypt.genSalt(15);
      const hashPassword: string = await bcrypt.hash(password, salt);
      const otp = uuidv4().slice(0, 4);

      const newUser = {
        email,
        password: hashPassword,
        otp,
      };

      // Create user within transaction
      const newCreateUser = await UsersModel.create(newUser, { transaction });

      // Validate and process category and skills if they are arrays
      const category = Array.isArray(data?.category) ? data.category : [];
      const skills = Array.isArray(data?.skills) ? data.skills : [];

      // Create the creator profile
      const creator = {
        userId: newCreateUser.id,
        fullName,
        location: data?.location,
        category, // using validated category array
        skills, // using validated skills array
        creatorType: data?.creatorType,
      };
      const newCreator = await CreatorModel.create(creator, { transaction });

      // Create work experience if available
      if (Array.isArray(data?.work) && data.work.length > 0) {
        const workExperiences = data.work.map((work: any) => ({
          creatorId: newCreator.id,
          title: work.title,
          description: work.description,
          companyName: work.companyName,
          startyear: work.startyear,
          startMonth: work.startMonth,
          endyear: work.endyear,
          endMonth: work.endMonth,
        }));
        await WorkExperienceModel.bulkCreate(workExperiences, { transaction });
      }

      if (Array.isArray(data?.projects) && data.projects.length > 0) {
        const projectExperiences = data.projects.map((project: any) => ({
          creatorId: newCreator.id,
          title: project.title,
          projectDescription: project.projectDescription,
          tags: project.tags,
        }));

        const newProjects = await ProjectModel.bulkCreate(projectExperiences, {
          transaction,
        });

        // Upload project images (if available)
        await Promise.all(
          newProjects.map(async (project: any, index: number) => {
            const productImage = await uploadSingleMedia(
              project.id,
              "PROJECT_IMAGE",
              data.projects[index]?.image,
              "project",
              transaction,
            );
            console.log("productImage", productImage);
          }),
        );
      }

      // Commit the transaction
      await transaction.commit();

      // Upload profile picture after transaction is successful
      if (profileImage) {
        await uploadSingleMedia(
          newCreateUser.id,
          "PROFILE_PICTURE",
          profileImage,
          "user",
        );
      }

      return {
        status: true,
        message: "Creator profile successfully created",
      };
    } catch (error: any) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error("Error registering creator:", error);
      return {
        status: false,
        message: "Error registering creator",
        error: error.message,
      };
    }
  }

  public async registerBrandService(data: any) {
    const transaction = await sequelize.transaction();

    try {
      const { email, password, username } = data;

      // Check if the user already exists
      const userWithEmailExists = await UsersModel.findOne({
        where: { email },
        transaction,
      });

      if (userWithEmailExists) {
        return {
          status: false,
          message: `User with email ${email} already exists`,
        };
      }

      const salt: string = await bcrypt.genSalt(15);
      const hashPassword: string = await bcrypt.hash(password, salt);
      const otp = uuidv4().slice(0, 4);

      const newUser = {
        email,
        password: hashPassword,
        otp,
      };

      // Create user with transaction
      const newCreateUser = await UsersModel.create(newUser, { transaction });

      const newBrand = {
        username,
        userId: newCreateUser.id,
      };

      // Create brand with transaction
      const newCreatedBrand = await BrandModel.create(newBrand, {
        transaction,
      });

      //send otp main
      await sendEmail(
        email,
        "Your OTP for Brand Verification",
        `
        <h1>Welcome, ${username}!</h1>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>Please verify your brands email.</p>
      `,
      );
      // Commit the transaction
      await transaction.commit();
      const brandData: Brand = {
        ...newCreateUser.dataValues,
        ...newCreatedBrand.dataValues,
      };
      brandData["password"] = null;
      brandData["otp"] = null;
      delete brandData["password"];
      delete brandData["otp"];
      return {
        message: "Brand created successfully",
        status: true,
        data: brandData,
      };
    } catch (error: any) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      return {
        status: false,
        message: `An error occurred: ${error?.message || error}`,
      };
    }
  }
  public async getAuthUser(id: string) {
    try {
      const user = await UsersModel.findOne({
        where: {
          id,
        },
      });
      if (!user) {
        return {
          message: "User not found",
          status: false,
        };
      }
      return {
        message: "user found",
        data: user,
        status: true,
      };
    } catch (error: any) {
      return {
        status: false,
        message: `An error occurred: ${error?.message || error}`,
      };
    }
  }
}
