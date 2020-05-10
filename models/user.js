const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    }
})

// authorSchema.pre('remove', function(next){
//     Book.find({author: this.id}, (err, books) =>{
//         if(err){
//             next(err);
//         }else if(books.length>0){
//             next(new Error('This author has books still'))
//         }else{
//             next();
//         }
//     })
// })

module.exports = mongoose.model('User', userSchema);