"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const design_service_1 = __importDefault(require("../service/design.service"));
class designController {
    constructor() {
        this.createNewDesign = async (req, res) => {
            try {
                console.log("reaching the controller");
                const { id } = req === null || req === void 0 ? void 0 : req.user;
                const response = await design_service_1.default.generateNewDesign(req.body, id);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.uploadNewDesign = async (req, res) => {
            try {
                const { id } = req === null || req === void 0 ? void 0 : req.user;
                const response = await design_service_1.default.uploadNewDesign(req.body, id);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.addCreatorToDesign = async (req, res) => {
            try {
                const { creator, designId } = req.body;
                const response = await design_service_1.default.addCreatorToDesign(designId, creator);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.additionalInfromation = async (req, res) => {
            var _a;
            try {
                const { designId } = req.body;
                const response = await design_service_1.default.additionalInformation(designId, (_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
    }
}
const DesignController = new designController();
exports.default = DesignController;
