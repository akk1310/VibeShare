import { connectDB } from "./db/index.js";
import app from "./app.js";
const PORT=process.env.PORT||8000;


await connectDB()
 .then(()=>{
    console.log("MONGODB Connected")
    app.listen(PORT,()=>{
        console.log(`Server running at port ${PORT}`)
    })
}
)
 .catch((error)=>console.log(error));

