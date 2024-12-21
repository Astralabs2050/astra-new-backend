"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class measurementController {
    constructor() {
        this.uploadMeasurement = async (req, res) => {
            try {
                const { id } = req === null || req === void 0 ? void 0 : req.user;
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
const MeasurementController = new measurementController();
exports.default = MeasurementController;
