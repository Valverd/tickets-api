import { db } from '../db/db'
import { DataTypes } from 'sequelize'
import User from './User';
import Movie from './Movie';

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
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

Movie.hasMany(Ticket)
Ticket.belongsTo(Movie)

User.hasMany(Ticket)
Ticket.belongsTo(User)

export default Ticket