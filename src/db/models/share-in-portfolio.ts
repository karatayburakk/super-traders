import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from "sequelize-typescript";
import Portfolio from "./portfolio";
import Share from "./share";

@Table({
  tableName: "share-in-portfolio",
  modelName: "share-in-portfolio",
  freezeTableName: true,
  indexes: [{ fields: ["shareId", "portfolioId"], unique: true }],
})
export default class ShareInPortfolio extends Model {
  @ForeignKey(() => Share)
  @Column
  shareId: number;

  @ForeignKey(() => Portfolio)
  @Column
  portfolioId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  shareSymbol: string;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  rate: number;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  price: number;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  totalPrice: number;
}
