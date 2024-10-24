// Import packages
import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize/types/sequelize";
import {
  UsersModel,
  MediaModel,
  BrandModel,
  CreatorModel,
  ProjectModel,
  WorkExperienceModel,
  DesignModel,
  PieceModel
} from "./model";
import { dbConfig } from "../common/utility";

const sequelizeOptions: any = {
  host: dbConfig.dbhost || "127.0.0.1",
  port: dbConfig.dbport || 3306,
  dialect: "mysql" as Dialect,
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
  models: [
    UsersModel,
    MediaModel,
    BrandModel,
    CreatorModel,
    ProjectModel,
    WorkExperienceModel,
    DesignModel,
    PieceModel
  ],
};

const sequelize = new Sequelize(
  dbConfig.dbname,
  dbConfig.dbuser,
  dbConfig.dbpassword,
  sequelizeOptions,
);
// sequelize.addModels([ParkOwner, IndividualParkOwner, CorporateParkOwner]);

const initDB = async () => {
  await sequelize.authenticate();
  await sequelize
    .sync({ alter: true })
    .then(async () => {
      console.log("Database connected!");
    })
    .catch(function (err: any) {
      console.log(err, "Something went wrong with the Database Update!");
    });
};

export { sequelize, initDB };
