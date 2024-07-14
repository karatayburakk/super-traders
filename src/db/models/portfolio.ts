import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from "sequelize-typescript";
import Share from "./share";
import SharePortfolio from "./share-in-portfolio";
import User from "./user";

@Table({
  tableName: "portfolio",
  modelName: "portfolio",
  freezeTableName: true,
})
export default class Portfolio extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  portfolioName: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsToMany(() => Share, () => SharePortfolio)
  shares: Share[];
}
