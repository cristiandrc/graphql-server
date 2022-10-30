import dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const config = {
  urlDb: process.env.URI_DB,
  jwtSecretLogin: process.env.JWT_SECRET_LOGIN,
};

export default config;
