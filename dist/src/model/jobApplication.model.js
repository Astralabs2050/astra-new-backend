"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const job_model_1 = require("./job.model");
const user_model_1 = require("./user.model");
const project_model_1 = require("./project.model");
const JobApplicationProjects_model_1 = require("./JobApplicationProjects.model");
let JobApplicationModel = class JobApplicationModel extends sequelize_typescript_1.Model {
};
exports.JobApplicationModel = JobApplicationModel;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(uuid_1.v4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], JobApplicationModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.ForeignKey)(() => job_model_1.JobModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], JobApplicationModel.prototype, "jobId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => job_model_1.JobModel, {
        foreignKey: "jobId",
        as: "job",
        onDelete: "CASCADE",
    })
], JobApplicationModel.prototype, "job", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.UsersModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], JobApplicationModel.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], JobApplicationModel.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)
], JobApplicationModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)
], JobApplicationModel.prototype, "negotiation", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false) // Ensures description cannot be null
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
], JobApplicationModel.prototype, "wallet", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], JobApplicationModel.prototype, "minAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.UsersModel, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
    })
], JobApplicationModel.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => project_model_1.ProjectModel, () => JobApplicationProjects_model_1.JobApplicationProjects)
], JobApplicationModel.prototype, "projects", void 0);
exports.JobApplicationModel = JobApplicationModel = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: "job_applications" })
], JobApplicationModel);
