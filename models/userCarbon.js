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
    totalCarbonLbs: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalCarbonMt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    carbonSecLbs: {
        type: DataTypes.DECIMAL(26,25),
        allowNull: false
    },
    carbonSecMt: {
        type: DataTypes.DECIMAL(26,26),
        allowNull: false
    },
    carbonMsLbs: {
        type: DataTypes.DECIMAL(26,26),
        allowNull: false
    },
    carbonMsMt: {
        type: DataTypes.DECIMAL(26,26),
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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