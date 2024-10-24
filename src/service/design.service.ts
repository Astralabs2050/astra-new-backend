import axios from "axios";
import { DesignModel } from "../model/design.model";
import { MediaModel } from "../model/media.model";
import { sequelize } from "../db"; // Import your sequelize instance

class DesignClass {
  // Method to generate new fashion design iterations
  public generateNewDesign = async (data: { prompt: string; image?: string }) => {
    const transaction = await sequelize.transaction(); // Start a new transaction
    try {
      console.log("Reaching the service1");
      const apiKey = process.env.OPEN_API_KEY;
      const url = "https://api.openai.com/v1/images/generations";

      // Prepare the request payload
      const requestData: any = {
        prompt: data.prompt,
        n: 4, // Number of image iterations to generate
        size: "1024x1024", // Resolution of the images
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

      // Create a new design in the database within the transaction
      const newDesign = await DesignModel.create(
        {
          prompt: data.prompt,
          // Add other fields here if needed, such as outfitName or pieceNumber
        },
        { transaction }
      );

      console.log(newDesign);

      // Save the generated images in the MediaModel and link them to the design
      const mediaEntries = imageUrls.map(async (url: string) => {
        return await MediaModel.create(
          {
            link: url,
            mediaType: "AI_GENERATED_IMAGE", // Assuming mediaType is 'image'
            designIds: newDesign.id, // Link to the newly created design
          },
          { transaction }
        );
      });

      // Await all media entries to be created
      await Promise.all(mediaEntries);

      // Commit the transaction if everything is successful
      await transaction.commit();

      console.log("Reaching the service3", imageUrls);
      return {
        message: "Designs generated",
        data: imageUrls,
        status: true,
      };
    } catch (err: any) {
      // Rollback the transaction in case of any errors
      if (transaction) await transaction.rollback();

      console.error("Error generating design iterations:", err.message || err);

      // Custom error message handling
      let errorMessage = "An unexpected error occurred while generating designs.";
      if (err.response) {
        // API response error
        errorMessage = `API Error: ${err.response.data.error || err.response.data.message}`;
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
}

// Export an instance of the DesignClass
const DesignService = new DesignClass();
export default DesignService;
