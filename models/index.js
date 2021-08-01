const User = require('./User');
const userCarbon = require('./userCarbon');

User.hasMany(userCarbon, {
    foreignKey: 'user_id'
  });

// userCarbon.belongsTo(User, {
//   foreignKey: 'carbon_id'
// });


module.exports = {User, userCarbon};