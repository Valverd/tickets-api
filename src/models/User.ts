import { db } from '../db/db'
import { DataTypes} from 'sequelize'
import { UserModel } from '../types/model_types';


const User = db.define<UserModel>('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    birth: {
        type: DataTypes.DATE,
        allowNull: false
    },
});

export default User