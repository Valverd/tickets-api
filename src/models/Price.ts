import { db } from '../db/db'
import { DataTypes } from 'sequelize'

const Price = db.define('Price', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {timestamps: false});

export default Price