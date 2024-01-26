import {
    Model,
    Table,
    PrimaryKey,
    Column,
    DataType,
    AllowNull,
    Default,
    Index,
    ForeignKey,
    BelongsTo,
  } from "sequelize-typescript";
  import { v4 as uuidv4 } from "uuid";
  import { UsersModel as User } from "./user.model"; // Assuming you have a User model

  
  @Table({ timestamps: true, tableName: "article" })
  export class ArticleModel extends Model {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id!: string;
  
    @Column(DataType.TEXT)
    article?: string;

    @Column(DataType.STRING)
    title?:string
    
    @Default(false)
    @Column(DataType.BOOLEAN)
    approved?: boolean;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    approviedBy!: string;
    
    @BelongsTo(() => User, {
        foreignKey: "approviedBy",
        as: "approver",
        onDelete: "CASCADE",
      })
      approver!: User;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId!: string;
  
    @BelongsTo(() => User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    })
    user!: User;
  }
  