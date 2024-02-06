import {
    Model,
    Table,
    PrimaryKey,
    Column,
    DataType,
    Default,
    ForeignKey,
    BelongsTo,
  } from "sequelize-typescript";
  import { v4 as uuidv4 } from "uuid";
  import { UsersModel as User } from "./user.model";
  
  @Table({ timestamps: true, tableName: "notifications" }) // Updated table name to "notifications"
  export class NotificationModel extends Model {
    @PrimaryKey
    @Default(uuidv4)
    @Column({ type: DataType.UUID, allowNull: false })
    id!: string;
  
    @Column({ type: DataType.STRING, allowNull: true })
    notificationType?: string;
  
    @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
    isRead!: boolean;
  
    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: true })
    userId!: string;
  
    @Column({ type: DataType.DATE, allowNull: false })
    createdAt!: Date;
  
    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt!: Date;
  
    @Column({ type: DataType.STRING, allowNull: true })
    notificationContent?: string;
  
    @BelongsTo(() => User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    })
    user!: User;
  }
  