const User = require('../models/User');
const userCarbon = require('../models/userCarbon');

User.hasMany(userCarbon, {
    foreignKey: 'user_id'
  });


module.exports = {User, userCarbon};