const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({ 
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
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    }
 },{
     timestamps: true,
 })

 const Category = mongoose.model('Category', categorySchema)


 module.exports = Category;