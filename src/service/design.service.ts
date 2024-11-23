import axios from "axios";
import { creatorType, DesignModel } from "../model/design.model";
import { MediaModel } from "../model/media.model";
import { sequelize } from "../db"; // Import your sequelize instance
import { uploadImageToS3 } from "../../util/aws";
import { PieceModel, UsersModel } from "../model";

class DesignClass {
  // Method to generate new fashion design iterations
  public generateNewDesign = async (
    data: {
      prompt: string;
      image?: string;
    },
    userId: string,
  ) => {
    const transaction = await sequelize.transaction(); // Start a new transaction
    try {
      const apiKey = process.env.OPEN_API_KEY;
      const url = "https://api.openai.com/v1/images/generations";

      // Prepare the request payload
      const requestData: any = {
        prompt: data.prompt + "from the above text description extract various cloth attributes. Examples of attributes to look out for are: fit, gender, size, category, material, pattern, occasion, color, and style. use this attributes in conjunction with the description generate a beautiful illustration of clothing item, with meticulous attention to detail. The background of the images should be plain white. The focus should be on presenting the clothing illustration on a white background he focus should be on presenting the clothing illustration on a white background. Artwork by rockstar games, artwork of gta 5, cel shading, cel art.",
        n: 4, // Number of image iterations to generate
        size: "512x512", // Resolution of the images
      };

      // Check if there is an image (URL or base64) provided
      if (data.image) {
        requestData["image"] = data.image; // Include image if provided
      }
      console.log("Reaching the service2");

      // Make a request to OpenAI's API
      const response = await axios.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      // Extract the URLs of the generated images from the response
      const imageUrls = response.data.data.map((image: any) => image.url);
      //check if the use exists
      const userExists = await UsersModel.findByPk(userId);
      if (!userExists)
        return {
          status: false,
          message: "User ID not found in the database.",
        };

      // Create a new design in the database within the transaction
      const newDesign = await DesignModel.create(
        {
          prompt: data.prompt,
          userId,
          // Add other fields here if needed, such as outfitName or pieceNumber
        },
        { transaction },
      );

      console.log(newDesign);

      // Save the generated images in the MediaModel and link them to the design
      const mediaEntries = imageUrls.map(async (url: string) => {
        return await MediaModel.create(
          {
            link: url,
            mediaType: "AI_GENERATED_IMAGE", // Assuming mediaType is 'image'
            designIds: newDesign.id,

            // Link to the newly created design
          },
          { transaction },
        );
      });

      // Await all media entries to be created
      await Promise.all(mediaEntries);

      // Commit the transaction if everything is successful
      await transaction.commit();

      console.log("Reaching the service3", imageUrls);
      return {
        message: "Designs generated",
        data: {
          images: imageUrls,
          designId: newDesign.id,
        },
        status: true,
      };
    } catch (err: any) {
      // Rollback the transaction in case of any errors
      if (transaction) await transaction.rollback();

      console.error("Error generating design iterations:", err.message || err);

      // Custom error message handling
      let errorMessage =
        "An unexpected error occurred while generating designs.";
      if (err.response) {
        // API response error
        errorMessage = `API Error: ${
          err.response.data.error || err.response.data.message
        }`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Network error: No response received from the API.";
      } else if (err.name === "SequelizeValidationError") {
        // Database validation error
        errorMessage = "Database validation error: " + err.message;
      }

      return {
        message: errorMessage,
        status: false,
      };
    }
  };
  public uploadNewDesign = async (data: any, userId: string) => {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      // Destructure images from the data object
      const { images } = data;
      console.log("images", images);

      // Check if there are images to upload
      if (!images || images.length === 0) {
        return {
          message: "Please select an image to upload",
          status: false,
        };
      }

      // Upload all images in parallel to Cloudinary
      const uploadPromises = images.map((image: any) =>
        uploadImageToS3("UPLOAD_DESIGN_IMAGES", image, userId),
      );
      console.log("uploadPromises", uploadPromises);
      const imageResults = await Promise.all(uploadPromises);

      // Filter out failed uploads and log if any uploads failed
      const successfulUploads = imageResults.filter((result) => result.success);
      const failedUploads = imageResults.filter((result) => !result.success);

      if (failedUploads.length > 0) {
        console.warn("Some images failed to upload:", failedUploads);
        await transaction.rollback();
        return {
          message: "Some images failed to upload. Please try again.",
          status: false,
        };
      }

      // Collect only successful URLs for the database
      const imageLinks = successfulUploads.map((result) => result.url);

      // Create a new design in the database within the transaction
      const newDesign = await DesignModel.create(
        {
          prompt: "User uploaded design",
          userId,
          // Add other fields here if needed, such as outfitName or pieceNumber
        },
        { transaction }, // Pass the transaction object here
      );

      // Create media records for each uploaded image
      const mediaRecords = imageLinks.map((image_link: string) => ({
        link: image_link,
        mediaType: "USER_UPLOADED_IMAGES",
        designIds: newDesign.id, // Link to the newly created design
        userId,
      }));

      // Save all media records in bulk within the transaction
      await MediaModel.bulkCreate(mediaRecords, { transaction });

      // Commit the transaction if everything is successful
      await transaction.commit();

      return {
        message: "Images uploaded successfully",
        data: {
          images: imageLinks,
          designId: newDesign.id,
        },
        status: true,
      };
    } catch (err: any) {
      // Rollback the transaction in case of error
      await transaction.rollback();

      return {
        message: err?.message || "An error occurred during upload",
        status: false,
      };
    }
  };

  public addCreatorToDesign = async (
    designId: string,
    creator: creatorType,
  ) => {
    try {
      //check if the design id is valid
      const design = await DesignModel.findOne({
        where: { id: designId },
      });
      if (!design) {
        return {
          message: "No design found",
          status: false,
        };
      }
      //update design model
      await design.update({
        creatorType: creator,
      });
      return {
        message: "Creator added successfully",
        status: true,
        data: design,
      };
    } catch (err: any) {
      return {
        message: err?.message || "An error occurred during upload",
        status: false,
      };
    }
  };
  public additionalInformation = async (designId: string, data: any) => {
    const transaction = await sequelize.transaction();
    try {
      // Validate Design
      const design = await DesignModel.findOne({ where: { id: designId } });
      if (!design) {
        await transaction.rollback();
        return { message: "No design found", status: false };
      }

      // Update Design
      await design.update(
        { outfitName: data?.outfitName, pieceNumber: data?.pieceNumber },
        { transaction },
      );

      // Create Pieces
      const createdPieces = await Promise.all(
        data?.pieces?.map(async (piece: any) =>
          PieceModel.create(
            {
              designId: design.id,
              pieceType: piece.type,
              designNumber: piece.designNumber,
              piecePrice: piece.piecePrice,
            },
            { transaction },
          ),
        ),
      );

      // Prepare Image Data for Cloudinary Upload
      const imageUploads = data.imageData.map((image: any, index: number) => ({
        image: image.image,
        view: image.view,
        pieceId: createdPieces[index]?.id,
        type: image.view,
      }));

      const printUploads = data.prints.map((print: any, index: number) => ({
        image: print.image,
        pieceId: createdPieces[index]?.id,
        type: "PRINT",
      }));

      const allUploads = [...imageUploads, ...printUploads];

      // Upload All Images
      const uploadResults = await Promise.all(
        allUploads.map((upload) =>
          uploadImageToS3(upload.view || "PRINT", upload.image, upload.pieceId),
        ),
      );

      // Filter Successful and Failed Uploads
      const successfulUploads = uploadResults.filter(
        (result) => result.success,
      );
      const failedUploads = uploadResults.filter((result) => !result.success);

      if (failedUploads.length > 0) {
        console.warn("Some images failed to upload:", failedUploads);
        await transaction.rollback();
        return {
          message: "Some images failed to upload. Please try again.",
          status: false,
        };
      }

      // Create Media Records
      const mediaRecords = successfulUploads.map((result, index) => ({
        link: result.url,
        mediaType: allUploads[index].type,
        pieceId: allUploads[index].pieceId,
        designId: design.id,
      }));

      await MediaModel.bulkCreate(mediaRecords, { transaction });

      // Commit Transaction
      await transaction.commit();
      return { message: "Data saved successfully", status: true };
    } catch (err: any) {
      await transaction.rollback();
      return {
        message: err?.message || "An error occurred during upload",
        status: false,
      };
    }
  };
}

// Export an instance of the DesignClass
const DesignService = new DesignClass();
export default DesignService;
