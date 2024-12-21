"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Waitlist = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
let Waitlist = class Waitlist extends sequelize_typescript_1.Model {
};
exports.Waitlist = Waitlist;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(uuid_1.v4) // Generates a unique UUID for each record
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], Waitlist.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false) // Ensures description cannot be null
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], Waitlist.prototype, "fullName", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false) // Ensures description cannot be null
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], Waitlist.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false) // Ensures description cannot be null
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
], Waitlist.prototype, "make", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false) // Ensures description cannot be null
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
], Waitlist.prototype, "link", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false) // Ensures description cannot be null
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)
], Waitlist.prototype, "occasion", void 0);
exports.Waitlist = Waitlist = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: "waitlist" })
], Waitlist);
