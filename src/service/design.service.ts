import axios from 'axios';

class DesignClass {
    // Method to generate new fashion design iterations
    //Expensive to generate new design use sparingly
    public generateNewDesign = async (data: { prompt: string; image?: string }) => {
        try {
            console.log("reaching the service1")
            const apiKey = process.env.OPEN_API_KEY 
            const url = 'https://api.openai.com/v1/images/generations';

            // Prepare the request payload
            const requestData: any = {
                prompt: data.prompt,
                n: 4, // Number of image iterations to generate
                size: '1024x1024', // Resolution of the images
            };

            // Check if there is an image (URL or base64) provided
            if (data.image) {
                requestData['image'] = data.image; // Include image if provided
            }
            console.log("reaching the service2")
            // Make a request to OpenAI's API
            const response = await axios.post(url, requestData, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            // Extract the URLs of the generated images from the response
            const imageUrls = response.data.data.map((image: any) => image.url);
            console.log("reaching the service3",imageUrls)
            return {
                message:"Designs generated",
                data:imageUrls,
                status:true
            
            }; // Return array of image URLs (4 design iterations)
        } catch (err) {
            console.error("Error generating design iterations:", err);
            return err; // Return the error if the request fails
        }
    };
}

// Export an instance of the DesignClass
const DesignService = new DesignClass();
export default DesignService;
