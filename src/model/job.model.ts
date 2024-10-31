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

  export enum timelineType {
    more_six_months = "more_six_months",
    three_six_months = "three_six_months",
    one_three_months = "one_three_months",
    one_three_weeks = "one_three_weeks",
  }

  @Table({timestamps: true, tableName: "jobs"})
  export class JobModel extends Model{
    @PrimaryKey
    @Default(uuidv4) // Ensure consistent UUID generation
    @Column(DataType.UUID)
    id!: string;

    @Column(DataType.TEXT)
    description!: string;

    @Column(DataType.ENUM(...Object.values(timelineType)))
    timeline?: timelineType
    
  }