import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// 🔹 Helper function to check availability
const checkAvailability = async (car, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });
  return bookings.length === 0;
};

// 🔹 API to check availability of cars for given date + location
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    // fetch cars in location that are marked available
    const cars = await Car.find({ location, isAvailable: true });

    // check if each car is available for the date range
    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkAvailability(
        car._id,
        pickupDate,
        returnDate
      );
      return { ...car._doc, isAvailable };
    });

    let availableCars = await Promise.all(availableCarsPromises);
    availableCars = availableCars.filter((car) => car.isAvailable);

    res.json({ success: true, availableCars });
  } catch (error) {
    console.error("checkAvailabilityOfCar error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 🔹 API to create booking
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.json({ success: false, message: "Car is not Available" });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return res.json({ success: false, message: "Car not found" });
    }

    // calculate total price
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = carData.pricePerDay * noOfDays;

    const booking = await Booking.create({
      car,
      owner: carData.owner, // ✅ ensures booking links to the correct owner
      user: _id,
      pickupDate,
      returnDate,
      price,
    });

    const plainBooking = {
      ...booking.toObject(),
      pickupDate: booking.pickupDate.toISOString(),
      returnDate: booking.returnDate.toISOString(),
    };

    res.json({
      success: true,
      message: "Booking Created",
      booking: plainBooking,
    });
  } catch (error) {
    console.error("createBooking error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 🔹 API to get bookings of a user
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const plainBookings = bookings.map((b) => ({
      ...b.toObject(),
      pickupDate: b.pickupDate.toISOString(),
      returnDate: b.returnDate.toISOString(),
    }));

    res.json({ success: true, bookings: plainBookings });
  } catch (error) {
    console.error("getUserBookings error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 🔹 API to get bookings of cars owned by this owner
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized" });
    }

    // 1️⃣ Find all cars owned by this owner
    const carIds = await Car.find({ owner: req.user._id }).distinct("_id");

    if (carIds.length === 0) {
      return res.json({ success: true, bookings: [] });
    }

    // 2️⃣ Get bookings for those cars
    const bookings = await Booking.find({ car: { $in: carIds } })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 })
      .lean();

    const plain = bookings.map((b) => ({
      ...b,
      pickupDate: new Date(b.pickupDate).toISOString(),
      returnDate: new Date(b.returnDate).toISOString(),
    }));

    res.json({ success: true, bookings: plain });
  } catch (error) {
    console.error("getOwnerBookings error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 API to change booking status
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error("changeBookingStatus error:", error.message);
    res.json({ success: false, message: error.message });
  }
};











