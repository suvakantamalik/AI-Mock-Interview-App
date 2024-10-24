/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:Qj1wUC2lzcWJ@ep-orange-darkness-a5ly7twx.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require',
    }
  };