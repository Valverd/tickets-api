import { db } from '../db/db'
import { DataTypes } from 'sequelize'
import Room from './Room';

const RoomTime = db.define('RoomTime', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {timestamps: false});

export default RoomTime

RoomTime.hasMany(Room, {foreignKey: "room_id"})
Room.belongsTo(RoomTime, {foreignKey: "room_id"})