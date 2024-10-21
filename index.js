import express from 'express';
import mongoose from 'mongoose';
import productRouter from './routes/product.js';
import userRouter from './routes/user.js';

await mongoose.connect(process.env.MONGO_URI);

const app = express();

app.use(express.json())

app.use(productRouter)
app.use(userRouter)

const port = 3003

app.listen(port, () => {
     console.log(`App is listening on server ${port}`)
})