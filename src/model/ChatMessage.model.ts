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
import { ChatRoomModel } from "./ChatRoomModel";

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

  // Remove this if you're moving to direct messaging only
  @ForeignKey(() => ChatRoomModel)
  @Column({
      type: DataType.INTEGER,
      allowNull: true, // Changed to true since we're moving to direct messaging
  })
  roomId?: number;

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

  // Add receiverId for private messaging
  @Column({
      type: DataType.STRING,
      allowNull: false,
  })
  receiverId!: string;

  @Column({
      type: DataType.TEXT,
      allowNull: false,
  })
  content!: string;

  // Add delivered status
  @Column({
      type: DataType.BOOLEAN,
      defaultValue: false,
  })
  delivered!: boolean;

  // Add readAt timestamp
  @Column({
      type: DataType.DATE,
      allowNull: true,
  })
  readAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => ChatRoomModel)
  room?: ChatRoomModel;
}