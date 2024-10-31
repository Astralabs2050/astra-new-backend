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
import { MediaModel } from "./media.model";

enum creatorType {
  graphicsDesigner = "graphicsDesigner",
  fashionIllustrator = "fashionIllustrator",
  techPackDesigner = "techPackDesigner",
  manufacturer = "manufacturer",
}

@Table({ timestamps: true, tableName: "designs" })
export class DesignModel extends Model {
  @PrimaryKey
  @Default(uuidv4) // Ensure consistent UUID generation
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  outfitName?: string;

  @Column(DataType.INTEGER)
  pieceNumber?: number;

  @Column(DataType.STRING)
  prompt?: string;

  @Column(DataType.ENUM(...Object.values(creatorType)))
  creatorType?: creatorType;

  @HasMany(() => MediaModel, {
    foreignKey: "designId", // Updated foreign key
    as: "media",
  })
  images?: MediaModel[];

  @HasMany(() => PieceModel, {
    foreignKey: "designId",
    as: "pieces",
    onDelete: "CASCADE",
  })
  pieces?: PieceModel[];
}
