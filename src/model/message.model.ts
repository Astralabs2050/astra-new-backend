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
  
  @Table({ timestamps: true, tableName: "messages" }) // Renamed the table to "staff_messages"
  export class MessageModel extends Model {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id!: string;
  
    @Column(DataType.TEXT)
    message?: string;
    
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    receiverId!: string;

    @BelongsTo(() => User, { foreignKey: 'receiverId', as: 'receiver', onDelete: 'CASCADE' })
    receiver!: User;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    senderId!: string;
  
    @BelongsTo(() => User, { foreignKey: 'senderId', as: 'sender', onDelete: 'CASCADE' })
    sender!: User;
  
    // @ForeignKey(() => User)
    // @Column(DataType.UUID)
    // receiverId!: string;
  
    // @BelongsTo(() => User, { foreignKey: 'receiverId', as: 'receiver' })
    // receiver!: User;
  }
  