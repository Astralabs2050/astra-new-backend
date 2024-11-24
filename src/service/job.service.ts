import { where } from "sequelize";
import { sequelize } from "../db";
import {
  BrandModel,
  CreatorModel,
  DesignModel,
  JobApplicationProjects,
  JobModel,
  MediaModel,
  PieceModel,
  ProjectModel,
  UsersModel,
} from "../model";
import { JobApplicationModel } from "../model/jobApplication.model";
import { SavedJobsModel } from "../model/savedJob.model";
import { timelineStatus } from "../model/job.model";

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

  public getSavedJob = async (userId: string) => {
    try {
      //get all saved jobs by userId
      const savedJobs = await SavedJobsModel.findAll({
        where: { userId },
        include: [
          {
            model: JobModel,
            as: "job",
            include: [
              {
                model: DesignModel,
                as: "design",
              },
            ],
          },
          {
            model: UsersModel,
            as: "user",
            attributes: {
              exclude: [
                "password",
                "isOtpVerified",
                "otpCreatedAt",
                "isOtpExp",
              ],
            }, // Exclude sensitive fields
          },
        ],
      });

      // Remove sensitive fields from the user object

      return {
        message: "Saved jobs fetched successfully",
        status: true,
        data: savedJobs,
      };
    } catch (error: any) {
      return {
        message:
          error?.message || "An error occurred while fetching saved jobs",
        status: false,
      };
    }
  };
  public acceptDeclineJobApplication = async (
    jobId: string,
    status: boolean,
    negotiation: boolean,
  ) => {
    const transaction = await sequelize.transaction();

    try {
      // Fetch the job application
      const jobApplicationFound = await JobApplicationModel.findByPk(jobId);
      if (!jobApplicationFound) {
        return { message: "Job application not found", status: false };
      }

      // Update the job application status
      const [updatedRows] = await JobApplicationModel.update(
        { status, negotiation },
        { where: { id: jobId }, transaction },
      );

      // Ensure the update was successful
      if (!updatedRows) {
        throw new Error("Failed to update job application");
      }

      // If the application is accepted, update the job details
      if (status) {
        // Verify the userId exists in the UsersModel
        const userExists = await UsersModel.findByPk(
          jobApplicationFound.userId,
        );
        if (!userExists) {
          throw new Error(
            "The associated user for the brandId does not exist. Update failed.",
          );
        }

        await JobModel.update(
          {
            timelineStatus: "ongoing",
            makerId: jobApplicationFound.userId, // Ensure this is a valid user ID
          },
          { where: { id: jobApplicationFound.jobId }, transaction },
        );
      }

      // Commit the transaction
      await transaction.commit();

      return {
        message: "Job application updated successfully",
        status: true,
      };
    } catch (error: any) {
      // Roll back the transaction on error
      await transaction.rollback();

      return {
        message:
          error?.message ||
          "An error occurred while accepting/declining job application",
        status: false,
      };
    }
  };

  public getOngoingJobApplication = async (id: string, filter?: string) => {
    try {
      const whereClause: any = {
        makerId: id,
      };

      // Add timelineStatus to the where clause only if filter is provided
      if (filter) {
        whereClause.timelineStatus = filter;
      }

      const getJob = await JobModel.findAll({
        where: whereClause,
        include: [
          {
            model: DesignModel,
            as: "design",
            include: [
              {
                model: MediaModel,
                as: "media",
              },
              {
                model: PieceModel,
                as: "pieces",
                include: [
                  {
                    model: MediaModel,
                    as: "media",
                  },
                ],
              },
            ],
          },
          {
            model: JobApplicationModel,
            as: "job",
          },
          {
            model: UsersModel,
            as: "user",
            include: [
              {
                model: CreatorModel,
                as: "creator", // Alias defined in UsersModel
              },
              {
                model: BrandModel,
                as: "brand", // Alias defined in UsersModel
              },
            ],
            attributes: {
              exclude: [
                "password",
                "isOtpVerified",
                "otpCreatedAt",
                "isOtpExp",
              ],
            }, // Exclude sensitive fields
          },
        ],
      });

      return {
        message: "Ongoing job applications fetched successfully",
        status: true,
        data: getJob,
      };
    } catch (error: any) {
      return {
        message:
          error?.message ||
          "An error occurred while fetching ongoing job applications",
        status: false,
      };
    }
  };

  public saveJob = async (userId: string, jobId: string) => {
    try {
      // check if the job is valid
      const job = await JobModel.findOne({ where: { id: jobId } });
      if (!job) {
        return {
          message: "No job found",
          status: false,
        };
      }

      //save job
      const saveJob = await SavedJobsModel.create({
        jobId,
        userId,
      });

      return {
        message: "Job saved successfully",
        status: true,
        data: saveJob,
      };
    } catch (error: any) {
      return {
        message: error?.message || "An error occurred while saving the job",
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
            attributes: {
              exclude: [
                "password",
                "isOtpVerified",
                "otpCreatedAt",
                "isOtpExp",
              ],
            }, // Exclude sensitive fields
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

  public getEachJob = async (jobId: string) => {
    try {
      const job = await JobModel.findOne({
        where: { id: jobId },
        include: [
          {
            model: DesignModel,
            as: "design",
            include: [
              {
                model: MediaModel,
                as: "media",
              },
              {
                model: PieceModel,
                as: "pieces",
                include: [
                  {
                    model: MediaModel,
                    as: "media",
                  },
                ],
              },
            ],
          },
          {
            model: UsersModel,
            as: "user",
            include: [
              {
                model: CreatorModel,
                as: "creator", // Alias defined in UsersModel
              },
              {
                model: BrandModel,
                as: "brand", // Alias defined in UsersModel
              },
            ],
            attributes: {
              exclude: [
                "password",
                "isOtpVerified",
                "otpCreatedAt",
                "isOtpExp",
              ],
            }, // Exclude sensitive fields
          },
        ],
      });

      if (!job) {
        return {
          message: "No job found",
          status: false,
        };
      }

      return {
        status: true,
        message: "gotten job",
        data: job,
      };
    } catch (error: any) {
      console.error("Error fetching job:", error);
      throw error;
    }
  };

  public getAllJobs = async () => {
    try {
      const jobs = await JobModel.findAll({
        where: {
          status: false,
        },
        include: [
          {
            model: DesignModel,
            as: "design",
          },
          {
            model: UsersModel,
            as: "user",
            attributes: {
              exclude: [
                "password",
                "isOtpVerified",
                "otpCreatedAt",
                "isOtpExp",
              ],
            }, // Exclude sensitive fields
          },
        ],
      });

      return {
        status: true,
        message: "gotten all jobs",
        data: jobs,
      };
    } catch (error: any) {}
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
          wallet: data?.wallet,
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
              include: [
                {
                  model: CreatorModel,
                  as: "creator", // Alias defined in UsersModel
                },
                {
                  model: BrandModel,
                  as: "brand", // Alias defined in UsersModel
                },
              ],
            },
          ],
        });
      const sanitizedData = jobApplications.map((application) => {
        const { user, ...applicationDetails } = application.toJSON(); // Convert Sequelize object to JSON
        if (user) {
          // Remove sensitive fields
          delete user.password;
          delete user.isOtpVerified;
          delete user.otpCreatedAt;
          delete user.isOtpExp;
        }
        return { ...applicationDetails, user };
      });

      return {
        status: true,
        message: "Got all job applicants",
        data: sanitizedData,
      };
    } catch (error) {
      console.error("Error getting job applications:", error);
      throw error;
    }
  };

  public getOneJobApplicants = async (jobId: string, userId: string) => {
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
      console.log("userIduserId", userId);
      const jobApplications: any = await JobApplicationModel.findOne({
        where: {
          jobId: job?.dataValues?.id,
          userId,
        },
        include: [
          {
            model: UsersModel,
            as: "user",
            include: [
              {
                model: CreatorModel,
                as: "creator", // Alias defined in UsersModel
              },
              {
                model: BrandModel,
                as: "brand", // Alias defined in UsersModel
              },
            ],
          },
        ],
      });
      console.log("jobApplicationsuser", jobApplications?.user);
      if (jobApplications?.user) {
        jobApplications.user.password = null;
        jobApplications.user.isOtpVerified = null;
        jobApplications.user.otpCreatedAt = null;
        jobApplications.user.isOtpExp = null;
        delete jobApplications?.user?.password;
        delete jobApplications?.user?.isOtpVerified;
        delete jobApplications?.user?.otpCreatedAt;
        delete jobApplications?.user?.isOtpExp;
      }

      return {
        status: true,
        message: "Got job applicant",
        data: jobApplications,
      };
    } catch (error) {
      console.error("Error getting job application:", error);
      throw error;
    }
  };
}

const JobService = new jobService();
export default JobService;
