const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/connection');


class userCarbon extends Model {}

userCarbon.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    make: {
        type: DataTypes.STRING,
        allowNull: true
    },
    model: {
        type: DataTypes.STRING,
        allowNull: true
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    mpYear: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    totalCarbon: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        }
    
    },
},
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'userCarbon'   
});

module.exports = userCarbon;