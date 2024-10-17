import {
  Model,
  Table,
  PrimaryKey,
  Column,
  DataType,
  Default,
  HasMany,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { PieceModel } from "./piece.model";

enum creatorType {
  graphicsDesigner = "graphicsDesigner",
  fashionIllustrator = "fashionIllustrator",
  techPackDesigner = "techPackDesigner",
  manufacturer = "manufacturer" // Changed to `manufacturer`
}

@Table({ timestamps: true, tableName: "designs" })
export class DesignModel extends Model {
  @PrimaryKey
  @Default(uuidv4) // Ensure consistent UUID generation
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  outfitName!: string;

  @Column(DataType.INTEGER)
  pieceNumber!: number;

  @Column(DataType.ENUM(...Object.values(creatorType)))
  creatorType?: creatorType;

  @HasMany(() => PieceModel, {
    foreignKey: "designId", // Changed from `creatorId` to `designId`
    as: "pieces",
    onDelete: "CASCADE", // Cascade delete
  })
  pieces!: PieceModel[]; // Changed to specific array type
}
