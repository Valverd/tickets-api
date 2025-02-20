import { db } from '../db/db'
import { DataTypes } from 'sequelize'
import Movie from './Movie';

const Room = db.define('Room', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    room: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {timestamps: false});

Movie.hasMany(Room, {foreignKey: "movie_id"})
Room.belongsTo(Movie, {foreignKey: "movie_id"})


export default Room