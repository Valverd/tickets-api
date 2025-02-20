import { db } from '../db/db'
import { DataTypes } from 'sequelize'
import Ticket from './Ticket';
import Room from './Room';

const Place = db.define('Place', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    place: {
        type: DataTypes.CHAR(3),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
}, {timestamps: false});


Room.hasMany(Place, {foreignKey: "room_id"})
Place.belongsTo(Room, {foreignKey: "room_id"})

export default Place