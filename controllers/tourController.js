const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

// Aliasing middleware to the five best cheapest tours.
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Retrieve all the tours.
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    /***** BUILDING THE QUERY *****/

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    /***** EXECUTING THE QUERY *****/

    const tours = await features.query;

    /* Sending a response */

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Retrieve a specific tour based on the ID.
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); // Same thing as 'Tour.findOne({ _id: req.params.id })'.

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Create a new tour.
exports.createTour = async (req, res) => {
  try {
    // const newTour({});
    // newTour.save();
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Change the values of a specific tour based on the ID.
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the new document.
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Delete a specific tour based on the ID.
exports.deleteTour = async (req, res) => {
  try {
    // Delete operations in a REST API don't save the content in a variable because there is no need to send data to the client.
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          // _id: { $toUpper: '$difficulty' }, // If NULL the will be only one group.
          _id: { $toUpper: '$difficulty' }, // Grouped by difficulty.
          numTours: { $sum: 1 }, // Add one to each tour to get the tours quantity.
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      /* {
        $match: {
          _id: { $ne: 'EASY' },
        },
      }, */
    ]);

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
