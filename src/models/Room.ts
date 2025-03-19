import { db } from '../db/db'
import { DataTypes } from 'sequelize'
import Movie from './Movie';
import { RoomModel } from '../types/model_types';
import Price from './Price';

const Room = db.define<RoomModel>('Room', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    room: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type_room: {
        type: DataTypes.ENUM("VIP", "Normal"),
        allowNull: false
    }
}, {timestamps: false});

Movie.hasMany(Room, {foreignKey: "movie_id"})
Room.belongsTo(Movie, {foreignKey: "movie_id"})

Price.hasMany(Room, {foreignKey: "price_id"})
Room.belongsTo(Price, {foreignKey: "price_id"})


export default Room