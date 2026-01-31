import express from 'express'
import 'dotenv/config'
import connectDB from './database/db.js';
import UserRouter from './routes/UserRoute.js';
import ProductRouter from './routes/ProductRoute.js';
import CartRouter from './routes/CartRoute.js'
import OrderRouter from './routes/OrderRoute.js'
import cors from 'cors'

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, resp) => {
    resp.send('This is Ecommarce website')
})

app.use('/api/v1/user',UserRouter)
app.use('/api/v1/product',ProductRouter)
app.use('/api/v1/cart',CartRouter)
app.use('/api/v1/orders',OrderRouter)

const port = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is listening at port: ${port}`);
    })
})
