import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Wallet = sequelize.define("Wallet", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.0,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: "USD",
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

export default Wallet;
