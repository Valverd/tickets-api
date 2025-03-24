import { db } from '../db/db'
import { DataTypes } from 'sequelize'
import Room from './Room';
import { PlaceModel } from '../types/model_types';

const Place = db.define<PlaceModel>('Place', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    place: {
        type: DataTypes.CHAR(3),
        allowNull: false
    }
}, {timestamps: false});


Room.hasMany(Place, {foreignKey: "room_id"})
Place.belongsTo(Room, {foreignKey: "room_id"})

export default Place