import {sequelize} from "../db.js";
import {DataTypes} from "sequelize";
export const Message = sequelize.define('message', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type: {type: DataTypes.STRING, required: true},
    textOrPathToFile: {type: DataTypes.STRING, required: true},
    roomId: {type: DataTypes.STRING, required: true},
    userId: {type: DataTypes.STRING, required: true},
    userName: {type: DataTypes.STRING, required: true}
})
