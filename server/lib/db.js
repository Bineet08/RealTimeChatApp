import mongoose from "mongoose"

export const connectDB = async() => {
    try{
        mongoose.connection.on('connected', () =>
            console.log('MONGODB CONNECTED'))
        
        mongoose.connection.on('error', (error) =>
            console.log('MONGODB CONNECTION ERROR:', error))
        
        await mongoose.connect(`${process.env.MONGODB_URL}/chat-app`)
    } catch(error){
        console.log('Connection Error:', error);
    }
}