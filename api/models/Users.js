/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var bcrypt = require('bcryptjs');
var jwToken = require('jsonwebtoken')

const secret = sails.config.secret || process.env.JWT_SECRET;

module.exports = {

  
  PrimaryKey:'id',
    

  attributes: {

  id:{
type:'number',
autoIncrement:true,
unique:true
  },

    name:{
     type:'string'
    },

    
    email: {
      type: 'string',
      isEmail:true,
      required: true,
      unique: true // Yes unique one
    },

    password: {
      type: 'string'
    },

    token:{
      type:'string'
    },

    orders:{
      collection: 'orders',
      via:'user'
    },
   
  },

   // We don't wan't to send back encrypted password either
   customToJSON: function () {
    var obj = this.toObject();
    delete obj.encryptedPassword;
    return obj;
  },
  // Here we encrypt password before creating a User
  beforeCreate :   function (values, proceed) {
  
 

console.log(values)
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
        sails.log.error('error1');
        return proceed();
    }

    bcrypt.hash(values.password, salt, (err, hash) => {
        if (err) {
            sails.log.error('error 2');
            return proceed();
        }
        values.password = hash; // encrypted password
        return proceed();
    });
});
  },

  comparePassword : function (password, user, cb) {

    // const isMatch =  bcrypt.compare(password, user.encryptedPassword)
    //  console.log(isMatch)
    //  if(!isMatch){ 
    //      throw new Error ('unable to login')
    //  }
    bcrypt.compare(password, user.password, function (err, match) {

      if(err) cb(err);
      if(match) {
        cb(null, true);
      } else {
        cb(err);
      }
    })
  },

  generateAuth : function(email, user,){
    token = jwToken.sign({_id:email}, secret)
    user.token = token
  },

  datastore:'postgres'

};

