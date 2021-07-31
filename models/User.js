const {DataTypes, Model, STRING} = require('sequelize');
const sequelize = require('../db/connection');
const bcrypt = require('bcrypt');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(25),
        allowNull: false,
        validate: {
            len: [5]
        }
    },
    carbon_id :{
        type: DataTypes.INTEGER,
        allowNull: true.password,
        references: {
            model: 'userCarbon',
            key: 'id'
        }
    }
},
{
    hooks: {
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      }
    
  },
  
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'user'
}
);

module.exports = User;