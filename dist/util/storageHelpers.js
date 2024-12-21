"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = __importDefault(require("./cloudinary"));
const uploadImageToCloudinary = async (mediaType, data, id) => {
    const randomString = Math.ceil(1000000000 * Math.random()).toString();
    try {
        const result = await cloudinary_1.default.uploader.upload(data, {
            resource_type: "auto",
            public_id: `${mediaType}_${id || randomString}`,
        });
        return {
            success: true,
            url: result.secure_url,
        };
    }
    catch (error) {
        console.error("Error uploading image:", error);
        return {
            success: false,
            message: "Error uploading image",
            error,
        };
    }
};
exports.uploadImageToCloudinary = uploadImageToCloudinary;
