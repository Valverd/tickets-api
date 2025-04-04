import { db } from '../db/db'
import { DataTypes } from 'sequelize'
import Place from './Place';
import User from './User';
import Section from './Section';
import Price from './Price';

const Ticket = db.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
});

Place.hasMany(Ticket, {foreignKey: "place_id"})
Ticket.belongsTo(Place, {foreignKey: "place_id"})

Section.hasMany(Ticket, {foreignKey: "section_id"})
Ticket.belongsTo(Section, {foreignKey: "section_id"})

User.hasMany(Ticket, {foreignKey: "user_id"})
Ticket.belongsTo(User, {foreignKey: "user_id"})

Price.hasMany(Ticket, {foreignKey: "price_id"})
Ticket.belongsTo(Price, {foreignKey: "price_id"})

export default Ticket