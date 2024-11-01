import { sequelize } from "../db";
import { DesignModel, JobModel, UsersModel } from "../model";

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
          },
          {
            model: UsersModel,
            as: "user",
          },
        ],
      });

      return jobs;
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  };
}

const JobService = new jobService();
export default JobService;
