import express from "express";
import "dotenv/config";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
	morgan(morganFormat, {
		stream: {
			write: (message) => {
				const logObject = {
					method: message.split(" ")[0],
					url: message.split(" ")[1],
					status: message.split(" ")[2],
					responseTime: message.split(" ")[3],
				};
				logger.info(JSON.stringify(logObject));
			},
		},
	})
);

let teaData = [];
let nextID = 1;

app.post("/teas", (req, res) => {
	const { name, price } = req.body;
	let newTea = { id: nextID++, name: name, price: price };
	teaData.push(newTea);
	res.status(201).send(newTea);
});

app.get("/teas", (req, res) => {
	res.status(200).send(teaData);
});

app.get("/teas/:id", (req, res) => {
	const tea = teaData.find((tea) => tea.id === parseInt(req.params.id));
	if (!tea) {
		res.status(404).send("Tea Not Found");
	}
	res.status(200).send(tea);
});

app.put("/teas/:id", (req, res) => {
	const tea = teaData.find((tea) => tea.id === parseInt(req.params.id));
	if (!tea) {
		res.status(404).send("Tea Not Found");
	}
	const { name, price } = req.body;
	tea.name = name;
	tea.price = price;
	res.status(201).send(tea);
});

app.delete("/teas/:id", (req, res) => {
	const teaIndex = teaData.findIndex(
		(tea) => tea.id === parseInt(req.params.id)
	);
	if (teaIndex == -1) {
		res.status(404).send("Tea Not Found");
	}
	teaData.splice(teaIndex, 1);
	res.status(200).send("Deleted");
});

app.listen(port, () => {
	console.log(`Server is running on port:${port}`);
});
