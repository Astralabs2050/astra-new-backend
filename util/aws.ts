import AWS from "aws-sdk";

// Configure the AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Add your AWS access key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Add your AWS secret access key
  region: process.env.AWS_REGION, // Specify your AWS region
});

export const uploadImageToS3 = async (
  mediaType: string,
  data: Buffer | string,
  id?: string
): Promise<{
  success: boolean;
  url?: string;
  message?: string;
  error?: any;
}> => {
  const randomString = Math.ceil(1000000000 * Math.random()).toString();
  const fileName = `${mediaType}_${id || randomString}`;

  try {
    const params:any = {
      Bucket: process.env.AWS_S3_BUCKET_NAME, // Your S3 bucket name
      Key: fileName, // File name to save as in S3
      Body: data, // The file data
      ContentType: mediaType, // Set content type (e.g., 'image/png' or 'image/jpeg')
      ACL: "public-read", // Access control for public-read access
    };

    const result = await s3.upload(params).promise();

    return {
      success: true,
      url: result.Location, // S3 URL of the uploaded file
    };
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    return {
      success: false,
      message: "Error uploading image",
      error,
    };
  }
};
