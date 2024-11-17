import {
  Model,
  Table,
  PrimaryKey,
  Column,
  DataType,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { JobModel } from "./job.model";
import { UsersModel } from "./user.model";
import { ProjectModel } from "./project.model";

@Table({ timestamps: true, tableName: "job_applications" })
export class JobApplicationModel extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @ForeignKey(() => JobModel)
  @Column(DataType.UUID)
  jobId!: string;

  @BelongsTo(() => JobModel, {
    foreignKey: "jobId",
    as: "job",
    onDelete: "CASCADE",
  })
  job!: JobModel;

  @AllowNull(false)
  @ForeignKey(() => UsersModel)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => UsersModel, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
  })
  user!: UsersModel;



   // Add the HasMany association for MediaModel
   @HasMany(() => ProjectModel, {
    foreignKey: "productId", // Reference to the user's id in the MediaModel
    as: "projects", // Alias for the media association
  })
  projects?: ProjectModel[];

}
