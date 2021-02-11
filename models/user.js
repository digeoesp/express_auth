'use strict';
const bcrypt = require('bcrypt')
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      validate:{
        len: {
        args: [1,99],
        msg: 'name must be between 1 and 99 charachters'
      }}
    },
    email:{
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'invalid email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len:{
          args: [ 8, 99],
        msg : 'password must be between 8 and 99 characters'
      }
     }
    }
  }, {
    sequelize,
    modelName: 'user',
  });
//before a user is created we are encrypting the password and using hash in its place
  user.addHook('beforeCreate', (pendingUser)=>{//pendinguser is object thta gets passed to datat base
  //bcrypt is going to hassh the password
    let hash =  bcrypt.hashSync(pendingUser.password, 12) //passes password, the hashes the pass 12 times
    pendingUser.password = hash
})
//validation what tghe user is giving us is correct
//checking the password on sign in and comparing it to the hash password in the datat base
  user.prototype.validPassword = function(typedPassword){
    let isCorrectPassword = bcrypt.compareSync(typedPassword, this.password)/// .this refers to user//check to see if they match typedPassword and this.password
  
    return isCorrectPassword//comes back true or false
}

//return an object from the database of the user without the encrypted password
  user.prototype.toJson = function() {
    let userData = this.get()//
    delete userData.password//does not delete rom the database//only removes it
    return userData//
}

  return user;
};
