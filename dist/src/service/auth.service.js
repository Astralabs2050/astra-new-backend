"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const helperFunctions_1 = require("../../util/helperFunctions");
const user_model_1 = require("../model/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const sendMail_1 = __importDefault(require("../../util/sendMail"));
const model_1 = require("../model");
const db_1 = require("../db");
const aws_1 = require("../../util/aws");
const sequelize_1 = require("sequelize");
class AuthService {
    async register(userData) {
        const { email, username, password } = userData;
        const userWithEmailExists = await user_model_1.UsersModel.findOne({ where: { email } });
        if (userWithEmailExists)
            return {
                status: false,
                message: `User with email ${email} already exists`,
            };
        const salt = await bcrypt_1.default.genSalt(15);
        const hashPassword = await bcrypt_1.default.hash(password, salt);
        const otp = (0, uuid_1.v4)().substring(0, 4);
        const newUser = {
            email,
            password: hashPassword,
            username,
            otp,
        };
        const newCreateUser = await user_model_1.UsersModel.create(newUser);
        await (0, helperFunctions_1.uploadSingleMedia)(newCreateUser === null || newCreateUser === void 0 ? void 0 : newCreateUser.id, "PROFILE_IMAGE", `https://api.dicebear.com/7.x/initials/svg?seed=${username}/svg?randomizeIds=false`, "user");
        try {
            await (0, sendMail_1.default)(email, "OTP", `otp ${otp}`);
        }
        catch (err) {
            console.log("Error sending mail:", err);
        }
        return { status: true, message: "User registered successfully" };
    }
    async verifyCreator(data) {
        const transaction = await db_1.sequelize.transaction();
        try {
            const { fullName, email, password } = data;
            // Check if the user already exists
            const userWithEmailExists = await user_model_1.UsersModel.findOne({
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
            const salt = await bcrypt_1.default.genSalt(15);
            const hashPassword = await bcrypt_1.default.hash(password, salt);
            const otp = (0, uuid_1.v4)().slice(0, 4);
            const newUser = {
                email,
                password: hashPassword,
                otp,
            };
            // Create user within transaction
            const newCreateUser = await user_model_1.UsersModel.create(newUser, { transaction });
            // Create the creator profile
            const creator = {
                userId: newCreateUser.id,
                fullName,
            };
            const newCreator = await model_1.CreatorModel.create(creator, { transaction });
            // Commit the transaction
            try {
                await (0, sendMail_1.default)(email, "OTP", `otp ${otp}`);
            }
            catch (err) {
                return {
                    status: false,
                    message: "Error registering creator",
                    error: err.message,
                };
                console.log("Error sending mail:", err);
            }
            await transaction.commit();
            return {
                status: true,
                message: "OTP Sent",
            };
        }
        catch (error) {
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
    async login(credentials) {
        const { email, password } = credentials;
        if (!email) {
            return { status: false, message: "Provide email " };
        }
        let userExists = await user_model_1.UsersModel.findOne({ where: { email } });
        if (userExists) {
            const doesPasswordMatch = await bcrypt_1.default.compare(password, userExists.password);
            if (doesPasswordMatch) {
                const jwtSecret = process.env.JWT_SECRET;
                const expirationTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
                const token = jsonwebtoken_1.default.sign({ data: userExists }, jwtSecret, {
                    expiresIn: expirationTime,
                });
                userExists === null || userExists === void 0 ? true : delete userExists.dataValues["password"];
                userExists === null || userExists === void 0 ? true : delete userExists.dataValues["otp"];
                return {
                    status: true,
                    message: "Login successful",
                    data: Object.assign(Object.assign({}, userExists === null || userExists === void 0 ? void 0 : userExists.dataValues), { token }),
                };
            }
            else {
                return { status: false, message: "Password does not match" };
            }
        }
        else {
            return { status: false, message: "User not found" };
        }
    }
    async verifyOtp(otp, email) {
        const userToBeVerified = await user_model_1.UsersModel.findOne({
            where: {
                email,
                otp,
                verified: false,
            },
        });
        if (userToBeVerified) {
            await userToBeVerified.update({ verified: true });
            return { status: true, message: "OTP verified successfully" };
        }
        else {
            return { status: false, message: "Invalid OTP" };
        }
    }
    async resendOtp(email) {
        const userToBeVerified = await user_model_1.UsersModel.findOne({
            where: { email, verified: false },
        });
        if (userToBeVerified) {
            const otp = (0, uuid_1.v4)().substring(0, 4);
            await userToBeVerified.update({ otp });
            await (0, sendMail_1.default)(email, "Resend OTP", `Hello your otp is  ${otp}`);
            return { status: true, message: `OTP sent to ${email}` };
        }
        else {
            return { status: false, message: "Email already verified or invalid" };
        }
    }
    async registerCreatorService(data) {
        const transaction = await db_1.sequelize.transaction();
        try {
            const { email, fullName, profileImage } = data;
            // Check if the user already exists
            const userWithEmailExists = await user_model_1.UsersModel.findOne({
                where: { email },
                transaction,
            });
            if (!userWithEmailExists) {
                return {
                    message: "Invalid Email",
                    status: false,
                };
            }
            if (!(userWithEmailExists === null || userWithEmailExists === void 0 ? void 0 : userWithEmailExists.verified)) {
                return {
                    message: "Please verify your email",
                    status: false,
                };
            }
            // Check if the creator already exists
            const existingCreator = await model_1.CreatorModel.findOne({
                where: { userId: userWithEmailExists.id },
                transaction,
            });
            // Validate and process category and skills if they are arrays
            const category = Array.isArray(data === null || data === void 0 ? void 0 : data.category) ? data.category : [];
            const skills = Array.isArray(data === null || data === void 0 ? void 0 : data.skills) ? data.skills : [];
            if (existingCreator) {
                // Update the existing creator profile
                await model_1.CreatorModel.update({
                    fullName,
                    location: data === null || data === void 0 ? void 0 : data.location,
                    category,
                    skills,
                    creatorType: data === null || data === void 0 ? void 0 : data.creatorType,
                }, {
                    where: { userId: userWithEmailExists.id },
                    transaction,
                });
                // Get the creator's ID for work and projects
                const creatorId = existingCreator.id;
                // Update work experience if available
                if (Array.isArray(data === null || data === void 0 ? void 0 : data.work) && data.work.length > 0) {
                    await model_1.WorkExperienceModel.destroy({
                        where: { creatorId },
                        transaction,
                    });
                    const workExperiences = data.work.map((work) => ({
                        creatorId,
                        title: work.title,
                        description: work.description,
                        companyName: work.companyName,
                        startyear: work.startyear,
                        startMonth: work.startMonth,
                        endyear: work.endyear,
                        endMonth: work.endMonth,
                    }));
                    await model_1.WorkExperienceModel.bulkCreate(workExperiences, {
                        transaction,
                    });
                }
                // Update projects if available
                if (Array.isArray(data === null || data === void 0 ? void 0 : data.projects) && data.projects.length > 0) {
                    await model_1.ProjectModel.destroy({
                        where: { creatorId },
                        transaction,
                    });
                    const projectExperiences = data.projects.map((project) => ({
                        creatorId,
                        title: project.title,
                        projectDescription: project.projectDescription,
                        tags: project.tags,
                    }));
                    const newProjects = await model_1.ProjectModel.bulkCreate(projectExperiences, {
                        transaction,
                    });
                    try {
                        await Promise.all(newProjects.map(async (project, index) => {
                            var _a, _b, _c, _d;
                            // Upload project images (if available)
                            console.log("data.projects[index]?.image", (_a = data.projects[index]) === null || _a === void 0 ? void 0 : _a.image);
                            const uploadPromises = (_d = (_c = (_b = data.projects[index]) === null || _b === void 0 ? void 0 : _b.image) === null || _c === void 0 ? void 0 : _c.map((image) => (0, aws_1.uploadImageToS3)("PROJECT_IMAGE", image, project.id))) !== null && _d !== void 0 ? _d : [];
                            console.log("uploadPromises", uploadPromises);
                            // Wait for all image upload promises to resolve
                            const uploadResults = await Promise.all(uploadPromises);
                            // Filter out failed uploads and log if any uploads failed
                            const successfulUploads = uploadResults.filter((result) => result.success);
                            const failedUploads = uploadResults.filter((result) => !result.success);
                            if (failedUploads.length > 0) {
                                console.warn("Some images failed to upload:", failedUploads);
                                await transaction.rollback();
                                throw new Error("Some images failed to upload. Please try again.");
                            }
                            // Collect only successful URLs for the database
                            const imageLinks = successfulUploads.map((result) => result.url);
                            const mediaRecords = imageLinks.map((image_link) => ({
                                link: image_link,
                                mediaType: "USER_UPLOADED_IMAGES",
                                projectId: project.id, // Link to the newly created design
                            }));
                            // Save all media records in bulk within the transaction
                            await model_1.MediaModel.bulkCreate(mediaRecords, { transaction });
                        }));
                    }
                    catch (error) {
                        console.error(error);
                        return {
                            message: error.message,
                            status: false,
                        };
                    }
                }
            }
            else {
                // Create the creator profile if it does not exist
                const creator = {
                    userId: userWithEmailExists.id,
                    location: data === null || data === void 0 ? void 0 : data.location,
                    category,
                    skills,
                    creatorType: data === null || data === void 0 ? void 0 : data.creatorType,
                };
                const newCreator = await model_1.CreatorModel.create(creator, { transaction });
                // Create work experience and projects as before
                // [Insert the previous logic for creating work experience and projects]
            }
            // Commit the transaction
            await transaction.commit();
            // Upload profile picture after transaction is successful
            if (profileImage) {
                // Step 1: Upload to Cloudinary
                const uploadResult = await (0, helperFunctions_1.uploadSingleMedia)(userWithEmailExists.id, "PROFILE_PICTURE", profileImage, "user");
                // Check if the upload was successful
                if (!uploadResult.success) {
                    console.warn("Failed to upload profile image to Cloudinary.");
                    throw new Error("Profile image upload failed. Please try again.");
                }
                // Step 2: Save the uploaded image link to the MediaModel
                const mediaRecord = {
                    link: uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.url, // Use the URL returned from Cloudinary
                    mediaType: "PROFILE_PICTURE",
                    userId: userWithEmailExists.id, // Link to the user
                };
                await model_1.MediaModel.create(mediaRecord);
                console.log("Profile image successfully uploaded and saved to MediaModel.");
            }
            return {
                status: true,
                message: existingCreator
                    ? "Creator profile successfully updated"
                    : "Creator profile successfully created",
            };
        }
        catch (error) {
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
    async registerBrandService(data) {
        const transaction = await db_1.sequelize.transaction();
        try {
            const { email, password, username } = data;
            // Check if the user already exists
            const userWithEmailExists = await user_model_1.UsersModel.findOne({
                where: { email },
                transaction,
            });
            if (userWithEmailExists) {
                return {
                    status: false,
                    message: `User with email ${email} already exists`,
                };
            }
            const salt = await bcrypt_1.default.genSalt(15);
            const hashPassword = await bcrypt_1.default.hash(password, salt);
            const otp = (0, uuid_1.v4)().slice(0, 4);
            const newUser = {
                email,
                password: hashPassword,
                otp,
            };
            // Create user with transaction
            const newCreateUser = await user_model_1.UsersModel.create(newUser, { transaction });
            const newBrand = {
                username,
                userId: newCreateUser.id,
            };
            // Create brand with transaction
            const newCreatedBrand = await model_1.BrandModel.create(newBrand, {
                transaction,
            });
            //send otp main
            await (0, sendMail_1.default)(email, "Your OTP for Brand Verification", `
        <h1>Welcome, ${username}!</h1>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>Please verify your brands email.</p>
      `);
            // Commit the transaction
            await transaction.commit();
            const brandData = Object.assign(Object.assign({}, newCreateUser.dataValues), newCreatedBrand.dataValues);
            brandData["password"] = null;
            brandData["otp"] = null;
            delete brandData["password"];
            delete brandData["otp"];
            return {
                message: "Brand created successfully",
                status: true,
                data: brandData,
            };
        }
        catch (error) {
            // Rollback the transaction in case of error
            await transaction.rollback();
            return {
                status: false,
                message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
            };
        }
    }
    async getAuthUser(id) {
        try {
            const user = await user_model_1.UsersModel.findOne({
                where: {
                    id,
                },
                include: [
                    {
                        model: model_1.CreatorModel,
                        as: "creator", // Alias defined in the association
                        required: false, // Make it optional in case the user is not a creator
                    },
                    {
                        model: model_1.BrandModel,
                        as: "brand", // Alias defined in the association
                        required: false, // Make it optional in case the user is not a brand
                    },
                    {
                        model: model_1.MediaModel, // Include MediaModel to get profile picture
                        where: {
                            mediaType: "PROFILE_PICTURE", // Filter by mediaType = "PROFILE_PICTURE"
                        },
                        required: false, // Make it optional in case the user doesn't have a profile picture
                    },
                ],
            });
            if (!user) {
                return {
                    message: "User not found",
                    status: false,
                };
            }
            return {
                message: "User found",
                data: Object.assign({}, user.toJSON()),
                status: true,
            };
        }
        catch (error) {
            return {
                status: false,
                message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
            };
        }
    }
    async forgetPassword(email) {
        try {
            //get the user
            console.log("email", email);
            const userToBeVerified = await user_model_1.UsersModel.findOne({
                where: { email },
            });
            if (!userToBeVerified) {
                return {
                    status: false,
                    message: `User with email ${email} not found`,
                };
            }
            const otp = (0, uuid_1.v4)().substring(0, 4);
            await userToBeVerified.update({
                otp,
                isOtpExp: false,
                otpCreatedAt: new Date(),
            });
            await (0, sendMail_1.default)(email, "Resend OTP", `your reset otp is ${otp}`);
            return {
                status: true,
                message: `your reset password link has been sent to email`,
            };
        }
        catch (err) {
            return {
                message: err.message,
                status: false,
            };
        }
    }
    async getProjects(userId) {
        var _a;
        try {
            // Find the user with related creator and projects
            const user = await user_model_1.UsersModel.findOne({
                where: {
                    id: userId,
                },
                include: [
                    {
                        model: model_1.CreatorModel,
                        as: "creator", // Alias defined in the association
                        required: false, // Optional in case the user is not a creator
                        include: [
                            {
                                model: model_1.ProjectModel,
                                as: "projects", // Alias for the projects association
                                include: [
                                    {
                                        model: model_1.MediaModel,
                                        as: "media", // Alias for the media association
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            if (!user) {
                return {
                    message: "User not found or no associated creator",
                    status: false,
                };
            }
            return {
                message: "Projects and media fetched successfully",
                status: true,
                data: ((_a = user.creator) === null || _a === void 0 ? void 0 : _a.projects) || [],
            };
        }
        catch (err) {
            return {
                message: err.message,
                status: false,
            };
        }
    }
    async resetPasswordLink(data) {
        try {
            // Check if the data exists
            const validToken = await user_model_1.UsersModel.findOne({
                where: {
                    otp: data.otp,
                    email: data.email,
                    otpCreatedAt: {
                        [sequelize_1.Op.gte]: new Date(new Date().getTime() - 60 * 60 * 1000), // OTP validity (1 hour)
                    },
                    isOtpExp: false,
                },
            });
            if (!validToken) {
                return {
                    status: false,
                    message: "Invalid OTP or Token expired",
                };
            }
            // Validate that password is provided
            if (!(data === null || data === void 0 ? void 0 : data.password)) {
                return {
                    status: false,
                    message: "Password is required",
                };
            }
            // Hash the password
            const salt = await bcrypt_1.default.genSalt(15);
            const hashedPassword = await bcrypt_1.default.hash(data.password, salt);
            // Update the password
            await validToken.update({
                password: hashedPassword,
                isOtpExp: true,
            });
            return {
                message: "Password updated successfully",
                status: true,
            };
        }
        catch (err) {
            return {
                message: err.message,
                status: false,
            };
        }
    }
}
exports.AuthService = AuthService;
