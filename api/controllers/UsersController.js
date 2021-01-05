/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var jwToken = require('jsonwebtoken')

const secret = sails.config.secret || process.env.JWT_SECRET;


module.exports = {

    list: async function(req, res){
        await Orders.find().exec((err, orders)=>{
  
  if (err){
      res.status(500).send({error: 'Database error'});
  }  
  res.view('pages/list', {orders:orders})
  
  });
   },
  
    login: async function (req, res) {
        var email = req.param('email');
        var password = req.param('password');
    
        if (!email || !password) {
          return res.json(401, {err: 'email and password required'});
        }
    
        Users.findOne({email: email}, function (err, user) {
          if (!user) {
            return res.status(401).send({err: 'invalid email or password'});
          }
    
          Users.comparePassword(password, user, function (err, valid) {
            if (err) {
              return res.json(403, {err: 'forbidden'});
            }
    
            if (!valid) {
              return res.json(401, {err: 'invalid email or password'});
            } else {
                const token = jwToken.sign({_id:email}, secret)
                
                 Users.updateOne({email}).set({token})
              res.status(200).send('logged in')
            }
          });
        })
      },


    signup: async  (req, res)=> {
        if (req.body.password !== req.body.confirmPassword) {
          return res.status(401).send({err: 'Password doesn\'t match!'});
        }

      const  name = req.body.name
      const email = req.body.email
      const password = req.body.password
      const age = req.body.age
 
        try{

            const user =   await Users.create({
                name,
                email,
                password,
                age,
    
            }).fetch()
            if (user) {
                console.log(`hello ${user.password}`)
              res.status(200).send('success');
            }
        }catch(err){
            res.status(401).send(err)
        }
          // If user created successfuly we return user and token as response
         

      }
};

