const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

// app.get('/', (req, res, next) => {
//     // res.status(200).send('Hello from the server side!');
//     res.status(200).json({'message':'Hello from the json side!', 'app': 'Natours'});
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res, next) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res, next) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((t) => t.id === id);
  if (tour) {
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } else {
    res.status(400).json({
      status: "failed",
      message: "Invalid id",
    });
  }
};

const createTour = (req, res, next) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newId };

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res, next) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((t) => t.id === id);
  if (tour) {
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }
};

const deleteTour = (req, res, next) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((t) => t.id === id);
  if (tour) {
    res.status(204).json({
      status: "success",
      data: null,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }
};

app.get("/api/v1/tours", getAllTours);
app.get("/api/v1/tours/:id", getTour);
app.post("/api/v1/tours", createTour);
app.patch("/api/v1/tours/:id", updateTour);
app.delete("/api/v1/tours/:id", deleteTour);


app.listen(3000, () => {
  console.log(`app running on port ${3000}`);
});
