"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedJobsModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const job_model_1 = require("./job.model");
const user_model_1 = require("./user.model");
let SavedJobsModel = class SavedJobsModel extends sequelize_typescript_1.Model {
};
exports.SavedJobsModel = SavedJobsModel;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(uuid_1.v4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], SavedJobsModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.ForeignKey)(() => job_model_1.JobModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], SavedJobsModel.prototype, "jobId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => job_model_1.JobModel, {
        foreignKey: "jobId",
        as: "job",
        onDelete: "CASCADE",
    })
], SavedJobsModel.prototype, "job", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.UsersModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], SavedJobsModel.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.UsersModel, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
    })
], SavedJobsModel.prototype, "user", void 0);
exports.SavedJobsModel = SavedJobsModel = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: "saved_jobs" })
], SavedJobsModel);
