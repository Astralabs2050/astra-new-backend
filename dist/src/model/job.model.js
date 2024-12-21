"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = exports.timelineStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const design_model_1 = require("./design.model");
const user_model_1 = require("./user.model");
const jobApplication_model_1 = require("./jobApplication.model");
var timelineStatus;
(function (timelineStatus) {
    timelineStatus["completed"] = "completed";
    timelineStatus["ongoing"] = "ongoing";
})(timelineStatus || (exports.timelineStatus = timelineStatus = {}));
let JobModel = class JobModel extends sequelize_typescript_1.Model {
};
exports.JobModel = JobModel;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(uuid_1.v4) // Generates a unique UUID for each record
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], JobModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false) // Ensures description cannot be null
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
], JobModel.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)
], JobModel.prototype, "timeline", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], JobModel.prototype, "impression", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)
], JobModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(timelineStatus)))
], JobModel.prototype, "timelineStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)
], JobModel.prototype, "manufacturer", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.UsersModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], JobModel.prototype, "makerId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.UsersModel, {
        foreignKey: "makerId",
        as: "maker", // Define the alias for this association
        onDelete: "SET NULL", // Optional, based on your requirements
    })
], JobModel.prototype, "maker", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.UsersModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], JobModel.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.UsersModel, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
    })
], JobModel.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => design_model_1.DesignModel),
    (0, sequelize_typescript_1.AllowNull)(false) // Ensures foreign key cannot be null
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], JobModel.prototype, "designId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => design_model_1.DesignModel, {
        foreignKey: "designId",
        as: "design",
        onDelete: "CASCADE",
    })
], JobModel.prototype, "design", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => jobApplication_model_1.JobApplicationModel, {
        foreignKey: "jobId", // Reference to the user's id in the MediaModel
        as: "job", // Alias for the media association
    })
], JobModel.prototype, "job", void 0);
exports.JobModel = JobModel = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: "jobs" })
], JobModel);
