import express, { Express, Request, Response } from "express";
import cors from "cors";
import usersRouter from "./routers/usersRouter"
import postsRouter from "./routers/postsRouter"
import bodyParser from "body-parser"

const app: Express = express();
app.use(cors());
app.use(bodyParser.json())
const port = 3000;

app.use("/users", usersRouter)
app.use("/posts", postsRouter)

app.get("/", (req: Request, res: Response) => {
	res.send("Server is up!")
})

app.listen(port, () => {
	console.log(`🔋 Server is running at http://localhost:${port}`);
})