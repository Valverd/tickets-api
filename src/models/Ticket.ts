import { db } from '../db/db'
import { DataTypes } from 'sequelize'
import Movie from './Movie';
import Place from './Place';
import User from './User';
import Room from './Room';

const Ticket = db.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
});

Movie.hasMany(Ticket, {foreignKey: "movie_id"})
Ticket.belongsTo(Movie, {foreignKey: "movie_id"})

Place.hasMany(Ticket, {foreignKey: "place_id"})
Ticket.belongsTo(Place, {foreignKey: "place_id"})

User.hasMany(Ticket, {foreignKey: "user_id"})
Ticket.belongsTo(User, {foreignKey: "user_id"})

Room.hasMany(Ticket, {foreignKey: "room_id"})
Ticket.belongsTo(Room, {foreignKey: "room_id"})

export default Ticket