// models/Investment.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Investment = sequelize.define("Investment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  plan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING, // e.g. "30 days", "6 months"
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "completed", "cancelled"),
    defaultValue: "active",
  },
  profit: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});


export default Investment;
