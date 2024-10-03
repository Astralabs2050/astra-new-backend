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
  brand = "brand",
  creator = "creator",
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

  @AllowNull(true)
  @Column(DataType.DATE)
  lastseen?: Date;

  @AllowNull(true)
  @Column(DataType.STRING)
  otp?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isAdmin?: boolean;

  @AllowNull(true)
  @Column(DataType.ENUM(...Object.values(userType)))
  userType?: userType;

  toJSON() {
    const values = { ...this.get() } as any;
    delete values.password;
    return values;
  }
}
