module.exports = {
  apps: [
    {
      name: "my-ts-app",
      script: "src/index.ts", // Entry point of your TypeScript project
      interpreter: "node", // Use Node.js as the interpreter
      interpreter_args: "-r ts-node/register", // Register ts-node to compile TypeScript on the fly
      watch: true, // Optional: Enable file watching
      env: {
        NODE_ENV: "development",
        DB_NAME: process.env.DB_NAME,
        DB_PORT: process.env.DB_PORT,
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        APP_URL: process.env.APP_URL,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS,
        JWT_SECRET: process.env.JWT_SECRET,
        OPEN_API_KEY: process.env.OPEN_API_KEY,
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION,
        AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME
      },
      env_production: {
        NODE_ENV: "production",
        DB_NAME: process.env.DB_NAME,
        DB_PORT: process.env.DB_PORT,
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        APP_URL: process.env.APP_URL,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_SECRET: process.env.JWT_SECRET,
        OPEN_API_KEY: process.env.OPEN_API_KEY,
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env.AWS_REGION,
        AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME
      },
    },
  ],
};
