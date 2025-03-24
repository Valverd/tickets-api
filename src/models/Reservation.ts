import { db } from '../db/db'
import { DataTypes } from 'sequelize'
import User from './User';
import Place from './Place';
import Section from './Section';

const Reservation = db.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {timestamps: false});

User.hasMany(Reservation, {foreignKey: "user_id"})
Reservation.belongsTo(User, {foreignKey: "user_id"})

Place.hasMany(Reservation, {foreignKey: "place_id"})
Reservation.belongsTo(Place, {foreignKey: "place_id"})

Section.hasMany(Reservation, {foreignKey: "section_id"})
Reservation.belongsTo(Section, {foreignKey: "section_id"})

export default Reservation