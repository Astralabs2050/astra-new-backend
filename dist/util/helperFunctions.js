"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleUploadedMedia = exports.uploadSingleMedia = void 0;
const model_1 = require("../src/model");
// Function to upload a single media file associated with a user or project
const uploadSingleMedia = async (entityId, mediaType, link, entityType, transaction, model) => {
    try {
        let entityExists;
        // Check if the entity exists based on entityType
        if (entityType === "project") {
            entityExists = await model_1.ProjectModel.findOne({ where: { id: entityId } });
        }
        else if (entityType === "user") {
            entityExists = await model_1.UsersModel.findOne({
                where: { id: entityId },
                transaction,
            });
        }
        // If the entity does not exist, log a warning but continue with media creation
        if (entityType && !entityExists) {
            console.warn(`Warning: ${(entityType === null || entityType === void 0 ? void 0 : entityType.charAt(0).toUpperCase()) + (entityType === null || entityType === void 0 ? void 0 : entityType.slice(1))} with id ${entityId} does not exist. Media will still be created.`);
        }
        // Create new media record regardless of entity existence
        const mediaData = Object.assign({ link,
            mediaType }, (entityType === "project"
            ? { projectId: entityId }
            : { userId: entityId }));
        // Create the media record
        const newMedia = await model_1.MediaModel.create(mediaData, { transaction });
        return {
            success: true,
            message: "profileImage: Media uploaded successfully",
            media: newMedia, // Optionally return the created media
        };
    }
    catch (err) {
        return {
            success: false,
            message: "profileImage: " +
                (err.message || "An error occurred while uploading the media"),
        };
    }
};
exports.uploadSingleMedia = uploadSingleMedia;
// Function to retrieve uploaded media associated with a user or project
const getSingleUploadedMedia = async (entityId, mediaType, entityType) => {
    try {
        let entityExists;
        // Check if the entity exists
        if (entityType === "user") {
            entityExists = await model_1.UsersModel.findOne({ where: { id: entityId } });
        }
        else if (entityType === "project") {
            entityExists = await model_1.ProjectModel.findOne({ where: { id: entityId } });
        }
        else {
            throw new Error("Invalid entity type specified");
        }
        if (!entityExists) {
            throw new Error(`Entity with id ${entityId} does not exist`);
        }
        // Fetch the existing media for the entity and media type
        const existingMedia = await model_1.MediaModel.findOne({
            where: {
                entityId,
                mediaType,
                entityType, // Check the entity type to retrieve the correct media
            },
        });
        if (existingMedia) {
            return {
                success: true,
                link: existingMedia.link,
            };
        }
        else {
            throw new Error("No such media found");
        }
    }
    catch (err) {
        return {
            success: false,
            message: err.message || "An error occurred while fetching the media",
        };
    }
};
exports.getSingleUploadedMedia = getSingleUploadedMedia;
