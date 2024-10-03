import { MediaModel, UsersModel, ProjectModel } from "../src/model";

// Function to upload a single media file associated with a user or project
export const uploadSingleMedia = async (
  entityId: string,
  mediaType: string,
  link: string,
  entityType: "user" | "project", // Specify the entity type
) => {
  try {
    let entityExists;

    // Check if the entity exists based on the entity type
    if (entityType === "user") {
      entityExists = await UsersModel.findOne({ where: { id: entityId } });
    } else if (entityType === "project") {
      entityExists = await ProjectModel.findOne({ where: { id: entityId } });
    } else {
      throw new Error("Invalid entity type specified");
    }

    if (!entityExists) {
      throw new Error(`Entity with id ${entityId} does not exist`);
    }

    // Check if the media file already exists for the entity and media type
    const existingMedia = await MediaModel.findOne({
      where: {
        entityId, // Using the same ID for user or project
        mediaType,
        entityType, // Added to distinguish between user and project media
      },
    });

    if (existingMedia) {
      // Update the existing media link
      existingMedia.link = link;
      await existingMedia.save();
    } else {
      // Create a new media entry
      await MediaModel.create({
        link,
        mediaType,
        entityId, // Reference the same ID for either user or project
        entityType, // Indicate whether it's user or project media
      });
    }

    return {
      success: true,
      message: "File uploaded successfully",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "An error occurred while uploading the file",
    };
  }
};

// Function to retrieve uploaded media associated with a user or project
export const getSingleUploadedMedia = async (
  entityId: string,
  mediaType: string,
  entityType: "user" | "project",
) => {
  try {
    let entityExists;

    // Check if the entity exists
    if (entityType === "user") {
      entityExists = await UsersModel.findOne({ where: { id: entityId } });
    } else if (entityType === "project") {
      entityExists = await ProjectModel.findOne({ where: { id: entityId } });
    } else {
      throw new Error("Invalid entity type specified");
    }

    if (!entityExists) {
      throw new Error(`Entity with id ${entityId} does not exist`);
    }

    // Fetch the existing media for the entity and media type
    const existingMedia = await MediaModel.findOne({
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
    } else {
      throw new Error("No such media found");
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "An error occurred while fetching the media",
    };
  }
};
