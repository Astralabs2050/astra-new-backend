"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const helperFunctions_1 = require("../../util/helperFunctions");
const auth_service_1 = require("../service/auth.service");
class User {
    constructor() {
        this.uploadProfileImage = async (req, res) => {
            try {
                const { user, link } = req.body;
                const mediaType = "PROFILE_IMAGE";
                const uploadImage = await (0, helperFunctions_1.uploadSingleMedia)(user === null || user === void 0 ? void 0 : user.id, mediaType, link, "user");
                if (uploadImage === null || uploadImage === void 0 ? void 0 : uploadImage.success) {
                    return res.json({
                        status: true,
                        message: mediaType + " uploaded",
                    });
                }
                else {
                    return res.json({
                        status: false,
                        message: mediaType + " upload failed " + (uploadImage === null || uploadImage === void 0 ? void 0 : uploadImage.message),
                    });
                }
            }
            catch (err) {
                return res.json({
                    status: false,
                    message: err,
                });
            }
        };
        this.getSelf = async (req, res) => {
            const { id } = req === null || req === void 0 ? void 0 : req.user;
            try {
                const response = await this.authService.getAuthUser(id);
                return res.json(response);
            }
            catch (err) {
                return res.json({
                    status: false,
                    message: err,
                });
            }
        };
        this.getProjects = async (req, res) => {
            const { id } = req === null || req === void 0 ? void 0 : req.user;
            try {
                const response = await this.authService.getProjects(id);
                return res.json(response);
            }
            catch (err) {
                return res.json({
                    status: false,
                    message: err,
                });
            }
        };
        this.authService = new auth_service_1.AuthService();
    }
}
exports.UserController = new User();
