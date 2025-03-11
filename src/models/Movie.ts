import { db } from '../db/db'
import { DataTypes } from 'sequelize'
import { MovieModel } from '../types/model_types';

const Movie = db.define<MovieModel>('Movie', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    tickets_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    age_group: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    duration: {
        type: DataTypes.TIME,
        allowNull: false
    }
    
}, {timestamps: false});


export default Movie