import { sequelize } from "../db";
import {
  DesignModel,
  JobApplicationProjects,
  JobModel,
  MediaModel,
  PieceModel,
  ProjectModel,
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
            model: DesignModel,
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

  public applyForJob = async (data: any, userId: string) => {
    const transaction = await sequelize.transaction();
    try {
      // Check if the job is valid
      const job = await JobModel.findOne({
        where: { id: data?.jobId },
      });

      if (!job) {
        return {
          message: "No job found",
          status: false,
        };
      }

      // Check if the user has already applied for this job
      const existingApplication = await JobApplicationModel.findOne({
        where: { jobId: data?.jobId, userId },
      });

      if (existingApplication) {
        return {
          message: "You have already applied for this job",
          status: false,
        };
      }

      // Validate that the project IDs exist (if provided)
      if (data?.projectIds && Array.isArray(data.projectIds)) {
        // Check each project ID to see if it exists
        for (const projectId of data.projectIds) {
          const project = await ProjectModel.findOne({
            where: { id: projectId },
          });

          if (!project) {
            return {
              message: `Invalid project ID: ${projectId}`,
              status: false,
            };
          }
        }
      }

      // Create the job application
      const newApplication = await JobApplicationModel.create(
        {
          userId,
          jobId: data?.jobId,
          amount: data?.amount,
          minAmount: data?.minAmount,
        },
        { transaction },
      );

      // If projectIds are provided, associate them with the job application via the join table
      if (data?.projectIds && Array.isArray(data.projectIds)) {
        const projectAssociations = data.projectIds.map(
          (projectId: string) => ({
            jobApplicationId: newApplication.id,
            projectId,
          }),
        );

        // Create associations in the join table
        await JobApplicationProjects.bulkCreate(projectAssociations, {
          transaction,
        });
      }

      await transaction.commit();

      return {
        message: "Application created successfully",
        status: true,
        data: newApplication,
      };
    } catch (error: any) {
      await transaction.rollback(); // Rollback transaction on error
      console.error("Error applying for jobs:", error);
      return {
        message: "An error occurred while applying for the job",
        status: false,
        error: error.message,
      };
    }
  };

  public getJobApplicants = async (jobId: string) => {
    try {
      // Check if the job exists
      const job = await JobModel.findOne({
        where: { id: jobId },
      });

      if (!job) {
        return {
          message: "No job found",
          status: false,
        };
      }

      // Get applications for the job with pagination
      const { rows: jobApplications, count: totalApplications } =
        await JobApplicationModel.findAndCountAll({
          where: { jobId },
          include: [
            {
              model: UsersModel,
              as: "user",
            },
          ],
        });

      return {
        status: true,
        message: "Got all job applicants",
        data: jobApplications,
      };
    } catch (error) {
      console.error("Error getting job applications:", error);
      throw error;
    }
  };
}

const JobService = new jobService();
export default JobService;
