// ChatMessage.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt
  } from "sequelize-typescript";
  import { ChatRoomModel } from "./ChatRoom.model";
  
  @Table({
    tableName: "chat_messages",
    timestamps: true,
  })
  export class ChatMessageModel extends Model {
    @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    })
    id!: number;
  
    @ForeignKey(() => ChatRoomModel)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    roomId!: number;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    senderId!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    senderName!: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: false,
    })
    content!: string;
  
    @CreatedAt
    createdAt!: Date;
  
    @UpdatedAt
    updatedAt!: Date;
  
    @BelongsTo(() => ChatRoomModel)
    room!: ChatRoomModel;
  }