import cors from "cors";
import express from "express";
import { range } from "../range.ts";

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

range.forEach((index1) => {
  range.forEach((index2) => {
    router.post(`/${index1}/${index2}`, (req: any, res: any) => {
      res.status(201).json(req.body);
    });
  });
});

app.use(router);

// Start the server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
