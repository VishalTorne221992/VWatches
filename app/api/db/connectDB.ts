import mongoose from "mongoose"
export const connectDB = async () => {

    try{
         
        const conn = await mongoose.connect(process.env.MONGO_URI as string)
        console.log(`MongoDb Connected: ${conn.connection.host}`)
    }catch(error : any){
        console.log("Error connecting to mongoDB", error.message)
        process.exit(1);
    }
}