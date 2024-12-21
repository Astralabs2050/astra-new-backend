"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const waitlist_model_1 = require("../model/waitlist.model");
class waitlistController {
    constructor() {
        this.joinWaitlist = async (req, res) => {
            try {
                // Check if the email already exists
                const existingWaitlistEntry = await waitlist_model_1.Waitlist.findOne({
                    where: { email: req.body.email },
                });
                if (existingWaitlistEntry) {
                    return res.status(400).json({
                        message: "Email is already on the waitlist",
                        status: false,
                    });
                }
                // Create the new waitlist entry
                const waitlist = await waitlist_model_1.Waitlist.create(req.body);
                return res.json({
                    message: "Added to waitlist",
                    status: true,
                });
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
const WaitlistController = new waitlistController();
exports.default = WaitlistController;
