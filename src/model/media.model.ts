import {
  Model,
  Table,
  PrimaryKey,
  Column,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
  Default,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { UsersModel as User } from "./user.model"; // Assuming you have a User model
import { ProjectModel } from "./project.model"; // Adjust the path as necessary

@Table({ timestamps: true, tableName: "media" })
export class MediaModel extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  link!: string;

  @Column(DataType.STRING)
  mediaType!: string;

  @AllowNull(true) // Allow null for optional association
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId?: string; // Optional foreign key to User

  @BelongsTo(() => User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE", // Change behavior if user is deleted
  })
  user?: User; // Optional association

  @AllowNull(true) // Allow null for optional association
  @ForeignKey(() => ProjectModel)
  @Column(DataType.UUID)
  projectId?: string; // Optional foreign key to Project

  @BelongsTo(() => ProjectModel, {
    foreignKey: "projectId",
    as: "project",
    onDelete: "CASCADE", // Change behavior if project is deleted
  })
  project?: ProjectModel; // Optional association
}
