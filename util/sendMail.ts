import axios from "axios";

export const sendUserMail = async (mail: any, name: any, otp: any) => {
  const apiUrl = "https://api.brevo.com/v3/smtp/email";
  const apiKey = process.env.API_KEY; // Replace with your actual API key
  const hostUrl = process.env.HOST_URL;

  const data = {
    sender: {
      name: "lawblaze",
      email: process.env.MAIL_SENDER,
    },
    to: [
      {
        email: mail,
        name: name,
      },
    ],
    subject: "Verify your Mail",
    htmlContent: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          background-color: #f4f4f4;
        }
    
        p {
          margin-bottom: 15px;
        }
    
        a {
          color: #007bff;
          text-decoration: none;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <p>Dear ${name},</p>
      <p>Click the following link to verify your email: <a href="${hostUrl}/auth/verify/${otp}">${hostUrl}/auth/verify/${otp}</a></p>
      <p>Best regards,<br>Lawblaze at DateConnect</p>
    </body>
    </html>
    
    `,
  };

  const headers = {
    accept: "application/json",
    "api-key": apiKey,
    "content-type": "application/json",
  };

  try {
    const response = await axios.post(apiUrl, data, { headers });
  } catch (error: any) {
    console.error("error from mail",error.message || error);
  }
};
