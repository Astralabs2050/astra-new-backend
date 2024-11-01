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
  
  export enum TimelineType {
    MORE_SIX_MONTHS = "more_six_months",
    THREE_SIX_MONTHS = "three_six_months",
    ONE_THREE_MONTHS = "one_three_months",
    ONE_THREE_WEEKS = "one_three_weeks",
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
  
    @Column(DataType.ENUM(...Object.values(TimelineType)))
    timeline?: TimelineType;
  
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    manufacturer!: boolean;
  
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
  