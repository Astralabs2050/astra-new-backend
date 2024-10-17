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
import { CreatorModel } from "./creator.model";
import { PieceModel } from "./piece.model";

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

  @AllowNull(true) 
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId?: string; 

  @BelongsTo(() => User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE", 
  })
  user?: User; 

  @AllowNull(true) 
  @ForeignKey(() => ProjectModel)
  @Column(DataType.UUID)
  projectId?: string; 

  @BelongsTo(() => ProjectModel, {
    foreignKey: "projectId",
    as: "project",
    onDelete: "CASCADE", 
  })
  project?: ProjectModel; 

  @AllowNull(true) 
  @ForeignKey(() => PieceModel)
  @Column(DataType.UUID)
  pieceId?: string; 

  @BelongsTo(() => ProjectModel, {
    foreignKey: "pieceId",
    as: "piece",
    onDelete: "CASCADE", 
  })
  piece?: PieceModel; 
}
