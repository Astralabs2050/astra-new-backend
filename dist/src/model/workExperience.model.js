"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkExperienceModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const creator_model_1 = require("./creator.model"); // Adjust the path as necessary
const uuid_1 = require("uuid");
let WorkExperienceModel = class WorkExperienceModel extends sequelize_typescript_1.Model {
};
exports.WorkExperienceModel = WorkExperienceModel;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(uuid_1.v4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], WorkExperienceModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => creator_model_1.CreatorModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], WorkExperienceModel.prototype, "creatorId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => creator_model_1.CreatorModel, {
        foreignKey: "creatorId",
        as: "creator",
        onDelete: "CASCADE",
    })
], WorkExperienceModel.prototype, "creator", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], WorkExperienceModel.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], WorkExperienceModel.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], WorkExperienceModel.prototype, "companyName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)
], WorkExperienceModel.prototype, "startYear", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)
], WorkExperienceModel.prototype, "startMonth", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)
], WorkExperienceModel.prototype, "endYear", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)
], WorkExperienceModel.prototype, "endMonth", void 0);
exports.WorkExperienceModel = WorkExperienceModel = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: "work_experiences" })
], WorkExperienceModel);
