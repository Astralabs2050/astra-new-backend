"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationProjects = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const jobApplication_model_1 = require("./jobApplication.model");
const project_model_1 = require("./project.model");
let JobApplicationProjects = class JobApplicationProjects extends sequelize_typescript_1.Model {
};
exports.JobApplicationProjects = JobApplicationProjects;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => jobApplication_model_1.JobApplicationModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], JobApplicationProjects.prototype, "jobApplicationId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => project_model_1.ProjectModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)
], JobApplicationProjects.prototype, "projectId", void 0);
exports.JobApplicationProjects = JobApplicationProjects = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "job_application_projects" })
], JobApplicationProjects);
