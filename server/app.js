const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
	host: "localhost",
	user: "markus",
	password: "123password456",
	database: "reserve",
});

connection.connect((err) => {
	if (err) {
		console.error("Error connecting to MySQL database:", err);
		return;
	}
	console.log("Connected to MySQL database");
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

//READ
app.get("/api/reservations", (req, res) => {
	var sql = "SELECT * FROM reservations";
	connection.query(sql, function (error, result) {
		if (error) {
			console.log("Error connecting to Database");
		} else {
			res.send({ status: true, data: result });
		}
	});
});

app.get("/api/movies", (req, res) => {
	var sql = "SELECT * FROM movies";
	connection.query(sql, function (error, result) {
		if (error) {
			console.log("Error connecting to Database");
		} else {
			res.send({ status: true, data: result });
		}
	});
});

//ADD
app.post("/api/reservations/add", (req, res) => {
	let details = {
		id: req.body.id,
		name: req.body.name,
		reserved_movie: req.body.reserved_movie,
		total: req.body.total,
		location: req.body.location,
		time: req.body.time,
		payment_method: req.body.payment_method,
		date_reserved: req.body.date_reserved,
		email: req.body.email

	};

	let sql = "INSERT INTO reservations SET ?";
	connection.query(sql, details, (error) => {
		if (error) {
			res.send({ status: false, message: "Reservation Failed" });
		} else {
			console.log("Success");
			res.send({ status: true, message: "Reservation Success" });
		}
	});
});

//SEARCH
app.get("/api/reservations/:id", (req, res) => {
	var reservation_id = req.params.id;
	var sql = "SELECT * FROM reservations WHERE id=" + reservation_id;

	connection.query(sql, function (error, result) {
		if (error) {
			console.log("Error locating information");
		} else {
			res.send({ status: true, data: result });
		}
	});
});

//UPDATE
app.put("/api/reservations/update/:id", (req, res) => {
	//gets the data with the specified ID
	let sql = //sql command
		"UPDATE reservations SET name='" +
		req.body.name +
		"', location='" +
		req.body.location +
		"', time='" +
		req.body.time +
		"', email='" +
		req.body.email +
		"', date_reserved='" +
		req.body.date_reserved +
		"'WHERE id=" + req.params.id;

	let query = connection.query(sql, (error, result) => {
		if (error) {
			console.error(error);
			res.send({ status: false, message: "Update Failed" });
		} else {
			res.send({ status: true, message: "Updated" });
		}
	});
});

//DELETE
app.delete("/api/reservations/delete/:id", (req, res) => {
	let sql = "DELETE FROM reservations WHERE id=" + req.params.id + "";
	let query = connection.query(sql, (error) => {
		if (error) {
			res.send({ status: false, message: "Deletion Failed" });
		} else {
			res.send({ status: true, message: "Deleted" });
		}
	});
});
