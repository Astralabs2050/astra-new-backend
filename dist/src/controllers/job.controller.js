"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const job_service_1 = __importDefault(require("../service/job.service"));
class jobController {
    constructor() {
        this.createJob = async (req, res) => {
            try {
                const { id } = req === null || req === void 0 ? void 0 : req.user;
                const response = await job_service_1.default.createJob(req.body, id);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.getJob = async (req, res) => {
            try {
                const { id } = req === null || req === void 0 ? void 0 : req.user;
                const { status } = req.params;
                const response = await job_service_1.default.getJob(id, status);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.saveJob = async (req, res) => {
            try {
                const { id } = req === null || req === void 0 ? void 0 : req.user;
                const { jobId } = req === null || req === void 0 ? void 0 : req.body;
                const response = await job_service_1.default.saveJob(id, jobId);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.acceptDeclineJob = async (req, res) => {
            try {
                const { jobApplicationId, status, negotiation = false } = req === null || req === void 0 ? void 0 : req.body;
                const response = await job_service_1.default.acceptDeclineJobApplication(jobApplicationId, status, negotiation);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.getSaveJob = async (req, res) => {
            try {
                const { id } = req === null || req === void 0 ? void 0 : req.user;
                const response = await job_service_1.default.getSavedJob(id);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.updateJob = async (req, res) => {
            try {
                const { id } = req === null || req === void 0 ? void 0 : req.user;
                const { jobId, status } = req === null || req === void 0 ? void 0 : req.body;
                const response = await job_service_1.default.updateJob(jobId, status);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.getEachJob = async (req, res) => {
            try {
                const { id } = req.params;
                const authUser = req === null || req === void 0 ? void 0 : req.user;
                console.log("the job id", id);
                const response = await job_service_1.default.getEachJob(id, authUser);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.applyJob = async (req, res) => {
            try {
                const { id } = req === null || req === void 0 ? void 0 : req.user;
                const response = await job_service_1.default.applyForJob(req.body, id);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.getAllJobs = async (req, res) => {
            try {
                const response = await job_service_1.default.getAllJobs();
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.getOngoingJobs = async (req, res) => {
            var _a, _b;
            try {
                const id = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.id;
                const status = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.status;
                console.log("status", status, req === null || req === void 0 ? void 0 : req.query);
                const response = await job_service_1.default.getOngoingJobApplication(id, status);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.getJobApplicants = async (req, res) => {
            var _a;
            try {
                const jobId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.jobId;
                console.log("jobId", jobId);
                const response = await job_service_1.default.getJobApplicants(jobId);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.getOneJobApplicants = async (req, res) => {
            var _a, _b;
            try {
                const { id } = req === null || req === void 0 ? void 0 : req.user;
                const jobId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.jobId;
                const userId = (_b = req.query) === null || _b === void 0 ? void 0 : _b.userId;
                const response = await job_service_1.default.getOneJobApplicants(jobId, userId);
                return res.json(response);
            }
            catch (error) {
                return res.status(400).json({
                    status: false,
                    message: `An error occurred: ${(error === null || error === void 0 ? void 0 : error.message) || error}`,
                });
            }
        };
        this.getJobDescWithAi = async (req, res) => {
            try {
                const { design } = req.body;
                console.log("req.params", req.body);
                const response = await job_service_1.default.generateJobDescWithAi(req.body);
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
const JobController = new jobController();
exports.default = JobController;
