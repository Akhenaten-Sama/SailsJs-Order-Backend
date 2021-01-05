/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */



module.exports = {
  
    login: function (req, res) {
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
              Users.generateAuth(email, user)
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
              //Users.generateAuth()
              res.status(200).send('sucess');
            }
        }catch(err){
            res.status(401).send(err)
        }
          // If user created successfuly we return user and token as response
         
    
      }
};

