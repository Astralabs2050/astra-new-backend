import {
  Model,
  Table,
  PrimaryKey,
  Column,
  DataType,
  AllowNull,
  Default,
  Index,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

enum userType {
  student = "student",
  staff = "staff",
}

@Table({ timestamps: true, tableName: "users" })
export class UsersModel extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column(DataType.UUID)
  id!: string;

  @Index({ name: "combined-key-index1", unique: true })
  @AllowNull(false)
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  verified?: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  active?: boolean;

  @Column(DataType.DATE)
  lastseen?: Date;

  @Column(DataType.STRING)
  otp?: string;

  @Column(DataType.STRING)
  phoneNumber?: string;

  @Column(DataType.STRING)
  fullName?: string;

  @Column(DataType.STRING)
  level?: string;

  @Column(DataType.BOOLEAN)
  isAdmin: boolean = false;

  @Column(DataType.ENUM(...Object.values(userType)))
  userType!: userType;
}
