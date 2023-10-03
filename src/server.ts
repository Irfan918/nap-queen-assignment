
import express, { Application, Request, Response } from 'express';
import mongoose, {connect} from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/posts';
import dotenv from 'dotenv';
dotenv.config();
const app: Application = express();


const PORT = process.env.PORT || 3000;
const mongodbUri = process.env.MONGODB_URI

connect('mongodbUri')
    .then(()=> {
      console.log("succesfully connected");
    }).catch((error:any)=>{
      console.log(error);
    })

app.use(bodyParser.json());

// Routes
app.use('/api/posts', postRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
 // res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
