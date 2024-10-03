import {
  Model,
  Table,
  PrimaryKey,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  AllowNull,
  Default,
} from "sequelize-typescript";
import { UsersModel as User } from "./user.model";
import { WorkExperienceModel } from "./workExperience.model";
import { ProjectModel } from "./project.model";
import { v4 as uuidv4 } from "uuid";

@Table({ timestamps: true, tableName: "creators" })
export class CreatorModel extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @BelongsTo(() => User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE", // Ensure cascade delete
  })
  user!: User;

  @HasMany(() => WorkExperienceModel, {
    foreignKey: "creatorId",
    as: "workExperiences",
    onDelete: "CASCADE", // Ensure cascade delete
  })
  workExperiences!: WorkExperienceModel[];

  @HasMany(() => ProjectModel, {
    foreignKey: "creatorId",
    as: "projects",
    onDelete: "CASCADE", // Ensure cascade delete
  })
  projects!: ProjectModel[];
}
