import { db } from '../db/db'
import { DataTypes } from 'sequelize'
import Movie from './Movie';
import Room from './Room';
import { timeStamp } from 'console';

const Section = db.define('Section', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    schedule: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    day: {
        type: DataTypes.DATEONLY,
    }
}, { timestamps: false });

Movie.hasMany(Section, { foreignKey: 'movie_id' })
Section.belongsTo(Movie, { foreignKey: 'movie_id' })

Room.hasMany(Section, { foreignKey: 'room_id' })
Section.belongsTo(Room, { foreignKey: 'room_id' })

export default Section