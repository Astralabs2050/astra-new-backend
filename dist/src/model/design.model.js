"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignModel = exports.creatorType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const piece_model_1 = require("./piece.model");
const media_model_1 = require("./media.model");
const user_model_1 = require("./user.model");
var creatorType;
(function (creatorType) {
    creatorType["graphicsDesigner"] = "graphicsDesigner";
    creatorType["fashionIllustrator"] = "fashionIllustrator";
    creatorType["techPackDesigner"] = "techPackDesigner";
    creatorType["manufacturer"] = "manufacturer";
})(creatorType || (exports.creatorType = creatorType = {}));
let DesignModel = class DesignModel extends sequelize_typescript_1.Model {
};
exports.DesignModel = DesignModel;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(uuid_1.v4) // Ensure consistent UUID generation
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], DesignModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], DesignModel.prototype, "outfitName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)
], DesignModel.prototype, "pieceNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
], DesignModel.prototype, "prompt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], DesignModel.prototype, "publicKey", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(creatorType)))
], DesignModel.prototype, "creatorType", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => media_model_1.MediaModel, {
        foreignKey: "designId", // Updated foreign key
        as: "media",
    })
], DesignModel.prototype, "images", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.UsersModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], DesignModel.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.UsersModel, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
    })
], DesignModel.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => piece_model_1.PieceModel, {
        foreignKey: "designId",
        as: "pieces",
        onDelete: "CASCADE",
    })
], DesignModel.prototype, "pieces", void 0);
exports.DesignModel = DesignModel = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: "designs" })
], DesignModel);
