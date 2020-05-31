const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({ 
    description: {
        type: String,
        required: true,
        trim : true,
    },
    title:  {
        type: String,
        required: true,
        trim : true,
    },
    thumb : {
        type: String,
        required: false,
        default: "http://res.cloudinary.com/ionicfirebaseapp/image/upload/c_scale,w_400/v1483635603/shutterstock_85029121_yqrjco.jpg"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    option: [  
        {
                sizename:{
                type: String,
                required: true,
                trim : true,
                },
                value: {
                type: String,
                required: true,
                trim : true,
                }

            
        }
        
    ],
    available : {
        type: Boolean,
        required: true,
        
    }
 },{
     timestamps: true,
 })

 const Menu = mongoose.model('Menu', menuSchema)


 module.exports = Menu;