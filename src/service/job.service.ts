import { sequelize } from "../db";
import {
  DesignModel,
  JobModel,
  MediaModel,
  PieceModel,
  UsersModel,
} from "../model";
import { JobApplicationModel } from "../model/jobApplication.model";

class jobService {
  public createJob = async (data: any, userId: string) => {
    const transaction = await sequelize.transaction();
    try {
      const { designId, description, timeline, manufacturer } = data;

      // Check if the design is valid
      const design = await DesignModel.findOne({
        where: { id: designId },
      });

      if (!design) {
        return {
          message: "No design found",
          status: false,
        };
      }

      // Check if a job already exists for this design
      const existingJob = await JobModel.findOne({
        where: { designId },
      });

      if (existingJob) {
        return {
          message: "A job already exists for this design",
          status: false,
        };
      }

      // Create job
      console.log("new job", {
        description,
        timeline,
        manufacturer,
        designId,
        userId,
      });
      const newJob = await JobModel.create(
        {
          description,
          timeline,
          manufacturer,
          designId,
          userId,
        },
        { transaction },
      );

      await transaction.commit();

      return {
        message: "Job created successfully",
        status: true,
        data: newJob,
      };
    } catch (error: any) {
      await transaction.rollback();
      return {
        message: error?.message || "An error occurred during job creation",
        status: false,
      };
    }
  };

  public getJob = async (userId: string, status?: any) => {
    try {
      const jobs = await JobModel.findAll({
        where: {
          userId,
          ...(status !== undefined && { status }), // Filter by status if provided
        },
        include: [
          {
            model:  DesignModel,
            as: "design",
            include: [
              {
                model: MediaModel,
                as: "media", // Include all media associated with the design
              },
              {
                model: PieceModel,
                as: "pieces", // Include all pieces associated with the design
              },
            ],
          },
          {
            model: UsersModel,
            as: "user",
          },
        ],
      });

      return {
        status: true,
        message: "gotten all jobs",
        data: jobs,
      };
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  };

  public applyForJob = async (jobId: string, userId: string) => {
    const transaction = await sequelize.transaction();
    try {
      //check if the job is valid
      const job = await JobModel.findOne({
        where: { id: jobId },
      });

      if (!job) {
        return {
          message: "No job found",
          status: false,
        };
      }

      // Check if the user has already applied for this job
      const existingApplication = await JobApplicationModel.findOne({
        where: { jobId, userId },
      });

      if (existingApplication) {
        return {
          message: "You have already applied for this job",
          status: false,
        };
      }

      // Create application
      const newApplication = await JobApplicationModel.create(
        {
          userId,
          jobId,
        },
        { transaction },
      );

      await transaction.commit();

      return {
        message: "Application created successfully",
        status: true,
        data: newApplication,
      };
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  };
}

const JobService = new jobService();
export default JobService;
