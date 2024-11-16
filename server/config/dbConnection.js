import mongoose from "mongoose";

export const dbConnection=()=>{
    mongoose.connect(process.env.CONNECTION_STRING,{
        dbName: "HOSPITAL_MANAGEMENT_SYSTEM"
    }).then(()=>{
        console.log("Connected to Database!!")
    }).catch(err=>{
        console.log(`Some error Occured while connecting ${err}`);
    })
}