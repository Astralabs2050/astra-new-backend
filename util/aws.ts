import AWS from "aws-sdk";

// Configure the AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadImageToS3 = async (
  mediaType: string,
  data: Buffer | string,
  id?: string,
): Promise<{
  success: boolean;
  url?: string;
  message?: string;
  error?: any;
}> => {
  const randomString = Math.ceil(1000000000 * Math.random()).toString();
  const fileName = `${mediaType}_${id || randomString}`;

  try {
    // Check if the data is a Base64-encoded string
    const isBase64 =
      typeof data === "string" && /^data:image\/\w+;base64,/.test(data);

    let fileData;
    if (isBase64) {
      // Remove the "data:image/*;base64," prefix and decode Base64 to buffer
      const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
      fileData = Buffer.from(base64Data, "base64");
    } else if (Buffer.isBuffer(data)) {
      // Use the buffer directly if data is already a Buffer
      fileData = data;
    } else {
      throw new Error("Invalid data format. Expected Base64 string or Buffer.");
    }

    const params: any = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: fileData,
      ContentType: mediaType, // e.g., 'image/png' or 'image/jpeg'
      ACL: "public-read",
    };

    const result = await s3.upload(params).promise();

    return {
      success: true,
      url: result.Location,
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
