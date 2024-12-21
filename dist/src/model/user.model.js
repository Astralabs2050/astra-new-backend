"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const creator_model_1 = require("./creator.model");
const brand_model_1 = require("./brand.model");
var userType;
(function (userType) {
    userType["brand"] = "brand";
    userType["creator"] = "creator";
})(userType || (userType = {}));
const media_model_1 = require("./media.model"); // Adjust the import path as needed
let UsersModel = class UsersModel extends sequelize_typescript_1.Model {
    toJSON() {
        const values = Object.assign({}, this.get());
        delete values.password;
        return values;
    }
    // Computed method to check if OTP is expired
    isOtpExpired() {
        if (!this.otpCreatedAt) {
            return true; // Consider it expired if there's no timestamp
        }
        const expirationTime = new Date(this.otpCreatedAt.getTime() + 30 * 60 * 1000); // 30 minutes in milliseconds
        return new Date() > expirationTime;
    }
};
exports.UsersModel = UsersModel;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(uuid_1.v4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], UsersModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => creator_model_1.CreatorModel, {
        foreignKey: "userId", // Reference to the user's id
        as: "creator", // Alias for the association
    })
], UsersModel.prototype, "creator", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => brand_model_1.BrandModel, {
        foreignKey: "userId", // Reference to the user's id
        as: "brand", // Alias for the association
    })
], UsersModel.prototype, "brand", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => media_model_1.MediaModel, {
        foreignKey: "userId", // Reference to the user's id in the MediaModel
        as: "media", // Alias for the media association
    })
], UsersModel.prototype, "media", void 0);
__decorate([
    (0, sequelize_typescript_1.Index)({ name: "combined-key-index1", unique: true }),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], UsersModel.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], UsersModel.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], UsersModel.prototype, "language", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)
], UsersModel.prototype, "verified", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)
], UsersModel.prototype, "active", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)
], UsersModel.prototype, "lastseen", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], UsersModel.prototype, "otp", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)
], UsersModel.prototype, "isOtpVerified", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(Date.now) // Automatically set to the current timestamp
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)
], UsersModel.prototype, "otpCreatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)
], UsersModel.prototype, "isOtpExp", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)
], UsersModel.prototype, "isAdmin", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(userType)))
], UsersModel.prototype, "userType", void 0);
exports.UsersModel = UsersModel = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: "users" })
], UsersModel);
