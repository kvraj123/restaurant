

const aws = require('aws-sdk')
const multer  = require('multer');
const multerS3 = require('multer-s3');
const express = require('express')

const Tasks = require('../models/category')
const authAdmin = require('../middleware/authAdmin')
const auth = require('../middleware/auth')
const path = require( 'path' );
const router = new express.Router()

const s3 = new aws.S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.REGION,
    Bucket: process.env.BUCKET_NAME
   })

   const profileImgUpload = multer({
    storage: multerS3({
     s3: s3,
     bucket: process.env.BUCKET_NAME,
     acl: 'public-read',
     key: function (req, file, cb) {
      cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
     }
    }),
    limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function( req, file, cb ){
     checkFileType( file, cb );
    }
   }).single('thumb');

   function checkFileType( file, cb ){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    // Check mime
    const mimetype = filetypes.test( file.mimetype );if( mimetype && extname ){
     return cb( null, true );
    } else {
     cb( 'Error: Images Only!' );
    }
   }


   router.post( '/profile-img-upload', ( req, res ) => {
       profileImgUpload( req, res, ( error ) => {
    // console.log( 'requestOkokok', req.file );
    // console.log( 'error', error );
    if( error ){
     console.log( 'errors', error );
     res.json( { error: error } );
    } else {
     // If File not found
     if( req.file === undefined ){
      console.log( 'Error: No File Selected!' );
      res.json( 'Error: No File Selected' );
     } else {
      // If Success
      const imageName = req.file.key;
      const imageLocation = req.file.location; 
      res.json( {
       image: imageName,
       location: imageLocation
      } );
     }
    }
   });
  });


  

  router.post('/createCategory',authAdmin,  async (req,res) => {

    profileImgUpload( req, res, ( error ) => {
        
        if( error ){
         console.log( 'errors', error );
         res.json( { error: error } );
        } else {
         // If File not found
         if( req.file === undefined ){
          console.log( 'Error: No File Selected!' );
          res.json( 'Error: No File Selected' );
         } else {
          // If Success
          const imageName = req.file.key;
          const imageLocation = req.file.location; 
          const category = new Tasks(
        
            {
                ...req.body,
                owner: req.user._id,
                thumb: imageLocation
            }
        
             );
          const response =  category.save(
            {
                ...req.body,
                owner: req.user._id,
                thumb: imageLocation,
            }
            );
            res.send(response)                 
            }
        }
       });
   
   
})






// router.post('/createCategory',authAdmin,  async (req,res) => {
//     const category = new Tasks(
        
//             {
//                 ...req.body,
//                 owner: req.user._id,
//             }
        
//     );
//     try{
//         const response = await category.save();
//         res.send(response)
//     } catch(e) {
//         res.status(400).send(e)
//     }
   
// })


// get /task?completed=true

// limit
// GET /getTasks?limit=10?skip=0  //first 1-10 result
// GET /getTasks?limit=10?skip=10  //second 10-20 result
// Get /getTasks?sortBy=createdAt:desc
// Get /getTasks?sortBy=completed:desc
// 1 =asce && -1= desc
router.get('/getCategory',auth, async (req,res) => {
   

    const match = {}
    const sort = {}

    // if(req.query.completed) {
    //     match.completed = req.query.completed === 'true' ? true : false;
    // }

    // if(req.query.sortBy) {
    //     const parts = req.query.sortBy.split(':')
    //     sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    // }
    try{
        const response = await Tasks.find({});
        // await req.user.populate({
        //     path: 'tasks',
        //     match: match,
        //     options: {
        //         limit: parseInt(req.query.limit),
        //         skip: parseInt(req.query.skip),
        //         // sort:{
        //         //     createdAt: -1
        //         // }
        //         sort
        //     }
        // }).execPopulate()
        res.send(response)
    } catch(e) {
        res.status(500).send(e)
    }
})





router.patch('/updateCategory/:id', authAdmin ,async(req,res) => {
    // const updates = Object.keys(req.body);
    // console.log(updates)
    // const allowUpdates = [ 'title']
    // const isValidOperation = updates.every((update) => allowUpdates.includes(update));

    // if(!isValidOperation) {
    //     return res.status(404).send({'error': 'invalid update'})
    // }
    const user = await Tasks.findById(req.params.id);

    profileImgUpload( req, res, ( error ) => {
        
        if( error ){
         console.log( 'errors', error );
         res.json( { error: error } );
        } else {
         // If File not found
         if( req.file === undefined ){
          console.log( 'Error: No File Selected!' );
          res.json( 'Error: No File Selected' );
         } else {
             console.log('req', req)
          // If Success
          const imageName = req.file.key;
          const imageLocation = req.file.location; 
          

          try {
    
            user.thumb = imageLocation
            user.title = req.body.title
            user.description = req.body.description
            user.owner = req.user._id
    
             user.save();
            
    
            if(!user) {
                res.status(404).send()
            }
            res.send(user);
        } catch(e) {
            res.status(400).send(e)
        }
                     
          }
        }
       });

    // try {
    //     // const user = await Tasks.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

    //     const user = await Tasks.findById(req.params.id);

    //     updates.forEach((update) => user[update] = req.body[update]);

    //     await user.save();
        

    //     if(!user) {
    //         res.status(404).send()
    //     }
    //     res.send(user);
    // } catch(e) {
    //     res.status(400).send(e)
    // }
})




router.delete('/deleteCategory/:id', authAdmin, async (req,res) => {

    try {
        const task = await Tasks.findByIdAndDelete(req.params.id);
        if(!task) {
            res.status(404).send({error: 'Not-Found'})
        }
        res.send(task);
    } catch(e) {
        res.status(400).send(e);
    }
})


module.exports = router;