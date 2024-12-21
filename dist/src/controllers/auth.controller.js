"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../service/auth.service");
class AuthController {
    constructor() {
        this.registerBrand = async (req, res) => {
            try {
                const response = await this.authService.registerBrandService(req.body);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.registerCreatorEmailVerification = async (req, res) => {
            try {
                const response = await this.authService.verifyCreator(req.body);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.registerCreator = async (req, res) => {
            try {
                const response = await this.authService.registerCreatorService(req.body);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.verifyOtp = async (req, res) => {
            const { otp, email } = req === null || req === void 0 ? void 0 : req.body;
            if (otp && email) {
                try {
                    const result = await this.authService.verifyOtp(otp, email);
                    return res.json(result);
                }
                catch (err) {
                    return res.json({
                        status: false,
                        message: `An error occurred: ${err}`,
                    });
                }
            }
            else {
                return res.json({ status: false, message: "No OTP provided" });
            }
        };
        this.resendOtp = async (req, res) => {
            const { email } = req === null || req === void 0 ? void 0 : req.body;
            if (email) {
                try {
                    const result = await this.authService.resendOtp(email);
                    return res.json(result);
                }
                catch (err) {
                    return res.json({
                        status: false,
                        message: `An error occurred: ${err}`,
                    });
                }
            }
            else {
                return res.json({ status: false, message: "Enter a valid email" });
            }
        };
        this.login = async (req, res) => {
            try {
                const result = await this.authService.login(req.body);
                return res.json(result);
            }
            catch (error) {
                return res.json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.getAuthUser = async (req, res) => {
            try {
                const { id } = req === null || req === void 0 ? void 0 : req.user;
                const result = await this.authService.getAuthUser(id);
            }
            catch (error) {
                return {
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                };
            }
        };
        this.forgotPassword = async (req, res) => {
            try {
                const { email } = req.body;
                const response = await this.authService.forgetPassword(email);
                return res.json(response);
            }
            catch (error) {
                return {
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                };
            }
        };
        this.resetPasswordLink = async (req, res) => {
            try {
                const response = await this.authService.resetPasswordLink(req.body);
                return res.json(response);
            }
            catch (error) {
                return {
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                };
            }
        };
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
