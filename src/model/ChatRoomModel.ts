// ChatRoom.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    HasMany,
    CreatedAt,
    UpdatedAt
  } from "sequelize-typescript";
  import { ChatMessageModel } from "./ChatMessage.model";
  
  @Table({
    tableName: "chat_rooms",
    timestamps: true,
  })
  export class ChatRoomModel extends Model {
    @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    })
    id!: number;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    name!: string;
  
    @Column({
      type: DataType.JSON,
      defaultValue: [],
    })
    participants!: string[];
  
    @CreatedAt
    createdAt!: Date;
  
    @UpdatedAt
    updatedAt!: Date;
  
    @HasMany(() => ChatMessageModel)
    messages!: ChatMessageModel[];
  }