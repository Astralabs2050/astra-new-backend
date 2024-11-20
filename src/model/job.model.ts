import {
  Model,
  Table,
  PrimaryKey,
  Column,
  DataType,
  Default,
  HasMany,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { DesignModel } from "./design.model";
import { UsersModel } from "./user.model";
import { BrandModel } from "./brand.model";

enum timelineStatus {
  completed = "completed",
  ongoing = "ongoing",
}

@Table({ timestamps: true, tableName: "jobs" })
export class JobModel extends Model {
  @PrimaryKey
  @Default(uuidv4) // Generates a unique UUID for each record
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false) // Ensures description cannot be null
  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.DATE)
  timeline?: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  status!: boolean;

  @AllowNull(true)
  @Column(DataType.ENUM(...Object.values(timelineStatus)))
  timelineStatus?: timelineStatus;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  manufacturer!: boolean;



  @AllowNull(true)
  @ForeignKey(() => UsersModel)
  @Column(DataType.UUID)
  makerId?: string;

  @AllowNull(true)
  @ForeignKey(() => UsersModel)
  @Column(DataType.UUID)
  userId?: string;

  @BelongsTo(() => UsersModel, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
  })
  user?: UsersModel;

  @ForeignKey(() => DesignModel)
  @AllowNull(false) // Ensures foreign key cannot be null
  @Column(DataType.UUID)
  designId!: string;

  @BelongsTo(() => DesignModel, {
    foreignKey: "designId",
    as: "design",
    onDelete: "CASCADE",
  })
  design!: DesignModel;
}
