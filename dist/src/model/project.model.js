"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid"); // Ensure you import uuidv4
const creator_model_1 = require("./creator.model");
const media_model_1 = require("./media.model");
const jobApplication_model_1 = require("./jobApplication.model");
const JobApplicationProjects_model_1 = require("./JobApplicationProjects.model");
let ProjectModel = class ProjectModel extends sequelize_typescript_1.Model {
};
exports.ProjectModel = ProjectModel;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(uuid_1.v4) // Automatically generate a UUID for new records
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], ProjectModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => creator_model_1.CreatorModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], ProjectModel.prototype, "creatorId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => creator_model_1.CreatorModel, {
        foreignKey: "creatorId",
        as: "creator",
        onDelete: "CASCADE",
    })
], ProjectModel.prototype, "creator", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], ProjectModel.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], ProjectModel.prototype, "projectDescription", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => jobApplication_model_1.JobApplicationModel, () => JobApplicationProjects_model_1.JobApplicationProjects)
], ProjectModel.prototype, "jobApplications", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)
], ProjectModel.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => media_model_1.MediaModel, {
        foreignKey: "projectId", // This will link to the project
        as: "media", // More intuitive naming for multiple media items
    })
], ProjectModel.prototype, "images", void 0);
exports.ProjectModel = ProjectModel = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: "project" })
], ProjectModel);
