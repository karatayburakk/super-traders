import {
  Table,
  Column,
  Model,
  DataType,
  HasOne,
  HasMany,
} from "sequelize-typescript";
import Portfolio from "./portfolio";
import * as bcrypt from "bcryptjs";

@Table({
  tableName: "user",
  modelName: "user",
  freezeTableName: true,
})
export default class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public set password(value: string) {
    this.setDataValue("password", bcrypt.hashSync(value));
  }

  @HasMany(() => Portfolio)
  portfolios: Portfolio[];
}
