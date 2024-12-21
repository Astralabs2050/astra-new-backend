"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const user_model_1 = require("./user.model");
const project_model_1 = require("./project.model");
const piece_model_1 = require("./piece.model");
const design_model_1 = require("./design.model");
let MediaModel = class MediaModel extends sequelize_typescript_1.Model {
};
exports.MediaModel = MediaModel;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(uuid_1.v4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], MediaModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
], MediaModel.prototype, "link", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], MediaModel.prototype, "mediaType", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.UsersModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], MediaModel.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.UsersModel, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
    })
], MediaModel.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.ForeignKey)(() => design_model_1.DesignModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], MediaModel.prototype, "designId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => design_model_1.DesignModel, {
        foreignKey: "designId", // Updated foreign key
        as: "design",
        onDelete: "CASCADE",
    })
], MediaModel.prototype, "design", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.ForeignKey)(() => project_model_1.ProjectModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], MediaModel.prototype, "projectId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => project_model_1.ProjectModel, {
        foreignKey: "projectId",
        as: "project",
        onDelete: "CASCADE",
    })
], MediaModel.prototype, "project", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.ForeignKey)(() => piece_model_1.PieceModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], MediaModel.prototype, "pieceId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => piece_model_1.PieceModel, {
        foreignKey: "pieceId",
        as: "piece",
        onDelete: "CASCADE",
    })
], MediaModel.prototype, "piece", void 0);
exports.MediaModel = MediaModel = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: "media" })
], MediaModel);
