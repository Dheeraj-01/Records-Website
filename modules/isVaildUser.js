const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://duser:d123@cluster0.shuag.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex: true,});
var conn =mongoose.Collection;
var UserValidSchema =new mongoose.Schema({
    userId: {
        type:String, 
        required: true
    },
    date:{
        type: Date, 
        default: Date.now }
});

var userVaild = mongoose.model('uservalid', UserValidSchema);
module.exports=userVaild;