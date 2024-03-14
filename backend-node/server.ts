import express from 'express';
import { connectToMongo } from './config';
import employeeRoutes from './routes/employee.routes';
import userRoutes from './routes/user.routes';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;
connectToMongo().catch(console.error);
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", employeeRoutes);
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});