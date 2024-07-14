import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from "sequelize-typescript";
import Portfolio from "./portfolio";
import SharePortfolio from "./share-in-portfolio";

@Table({
  tableName: "share",
  modelName: "share",
  freezeTableName: true,
})
export default class Share extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  symbol: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0.0,
  })
  rate: number;

  @BelongsToMany(() => Portfolio, () => SharePortfolio)
  portfolios: Portfolio[];
}
