"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieceModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const design_model_1 = require("./design.model");
const media_model_1 = require("./media.model");
var creatorType;
(function (creatorType) {
    creatorType["digital"] = "digital";
    creatorType["physical"] = "physical";
})(creatorType || (creatorType = {}));
let PieceModel = class PieceModel extends sequelize_typescript_1.Model {
};
exports.PieceModel = PieceModel;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(uuid_1.v4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], PieceModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => design_model_1.DesignModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], PieceModel.prototype, "designId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => design_model_1.DesignModel, {
        foreignKey: "designId",
        as: "design",
        onDelete: "CASCADE",
    })
], PieceModel.prototype, "design", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], PieceModel.prototype, "pieceType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], PieceModel.prototype, "designNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT)
], PieceModel.prototype, "piecePrice", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT)
], PieceModel.prototype, "modelingPrice", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => media_model_1.MediaModel, {
        foreignKey: "pieceId", // This will link to the project
        as: "media", // More intuitive naming for multiple media items
    })
], PieceModel.prototype, "images", void 0);
exports.PieceModel = PieceModel = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: "pieces" }) // Updated table name to "pieces"
], PieceModel);
