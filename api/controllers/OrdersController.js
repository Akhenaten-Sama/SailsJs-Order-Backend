/**
 * OrdersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */








module.exports = {

    

  
list: async function(req, res){
      await Orders.find().exec((err, orders)=>{

if (err){
    res.status(500).send({error: 'Database error'});
}  
res.view('pages/list', {orders:orders})

});
 },



 create: async (req, res)=>{  
     const name = req.body.name;
     const body = req.body.body;
     await Orders.create({
        name:name,
        body:body
     }).exec((err, orders)=>{

        if (err){
            res.status(500).send({error: 'Database error'});
        }  
        res.send(200)
        
        });
 },




delete: async(req, res)=>{
    const id = req.params.id
    await Orders.destroy({id:id}).exec((err)=>{
        if (err){
            res.status(500).send({error:'Unable To Delete'}) 
        }
        res.status(500).send({error: 'Order Deleted'});
        
    })
    return false;
},

update: async(req, res)=>{

    const id = req.params.id
    const name = req.body.name;
    const body = req.body.body;
   await Orders.updateOne({
        id:id
    }).set({
        name:name,
        body:body
    }).exec((err)=>{
        if (err){
            res.status(500).send({error:'Unable To Update'}) 
        }
        res.status(200).send({message: 'updated'})
        
    })



}

}

