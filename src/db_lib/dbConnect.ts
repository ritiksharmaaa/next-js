import mongoose from "mongoose";


type ConnectionObject ={
    isConnected?: number , 


}

// we use pattern called a singlton pattern ussages 
const connection : ConnectionObject = {}



// note in cpp void and js void have diffrent in cpp mean nothing return but in js mean whatever you want to return return it . 
async function dbConnected() : Promise<void> {
    // first rule alsway check is there any concetion available or not if not get new one elde use previous one . 
    if(connection.isConnected){
        console.log("dbConnected already  ! ")
        return 
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || "mongodb+srv://root_nextjs:6Q9NiqAu1zYNt8MT@nextwebapp.zitlyt5.mongodb.net/?retryWrites=true&w=majority&appName=nextwebapp" ) 
        // here we get db.connection an array we use as we need 
        connection.isConnected = db.connections[0].readyState  // ready state is juat a number 
        console.log("DB Connected successfully ")

        
    } catch (error) {
        console.log("Error in connecting to db : ", error)
        process.exit(1)
        
    }

}

export default dbConnected ; 