import mongoose, {Schema , Document} from "mongoose";

export interface  Message extends Document {
    content : string ; 
    createdAt : Date ;

    
}
const MessageSchema : Schema<Message> = new Schema({
    content : {
        type : String ,
        required : true 
    },
    createdAt : {
        type : Date , 
        required : true , 
        default : Date.now()
    }
})

export interface User extends Document {
   username : string ; 
    email : string ;
    password : string ;
    verifyCode : string ;
    verifyCodeExpiry : Date ; 
    isVerified: boolean;
    isAcceptingMessage : boolean ; 
    messages : Message[];
    // createdAt : Date ;  // Date when the user was created.
}

const UserSchema : Schema<User> = new Schema({
    username : {
        type : String , 
        trim : true , 
        required : true 
    },
    email : {
        type : String , 
        required : [true , "Email is required ! "],
        unique : true , 
        match : [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "pleae use a valid email ! "]
    },
    password : {
        type : String , 
        required : true    
    },
    verifyCode : {
        type : String , 
        required : [ true , "Verify code is required ! "]  
    },
    isVerified: {
        type: Boolean,
        default: false,
      },
    verifyCodeExpiry : {
        type : Date , 
        required : [true , "Please specify the expiry date of the verification code ! "] 
    },
    isAcceptingMessage : {
        type : Boolean , 
        required : [true , "Please specify if you want to accept messages or not ! "], 
    },
    messages : [MessageSchema],
    
});

// note in next js they dont know wheter our app is run first time or previousley run so many time so ot can create a new model or use the existing one so we need to check if the model is already created or not


// const userModel = mongoose.model("userModel" , UserSchema); this is normal way 

// we use this way in next js ; 

const userModel = (mongoose.models.userModel as mongoose.Model<User>) || mongoose.model<User>("userModel" , UserSchema);

export default userModel;