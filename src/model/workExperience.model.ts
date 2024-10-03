import {
  Model,
  Table,
  PrimaryKey,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { CreatorModel as Creator } from "./creator.model"; // Adjust the path as necessary

@Table({ timestamps: true, tableName: "work_experiences" })
export class WorkExperienceModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Creator)
  @Column(DataType.UUID)
  creatorId!: string;

  @BelongsTo(() => Creator, {
    foreignKey: "creatorId",
    as: "creator",
    onDelete: "CASCADE",
  })
  creator!: Creator;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  description!: string;

  @Column(DataType.STRING)
  companyName!: string;

  @Column(DataType.DATE)
  startDate!: Date;

  @Column(DataType.DATE)
  endDate!: Date;
}
