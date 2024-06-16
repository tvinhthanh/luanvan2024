import { Request, Response } from "express";
import Hotel from "../models/hotel";
import {HotelType} from "../shared/types"

const saltRounds = 10;

export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
};

export const createHotels = async (req: Request, res: Response) => {
  const { name, city, country, description, price,starRating, type, facilities, adultCount, childCount, Images } = req.body;
  try {
    const newHotel = new Hotel({ name, city, country, description, price,starRating, type, facilities, adultCount, childCount, Images   });
    await newHotel.save();
    res.status(201).json(newHotel);
  } catch (err) {
    res.status(500).json({ message: "Failed to create Hotel" });
  }
};

export const updateHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, city, country, description, price,starRating, type, facilities, adultCount, childCount, Images } = req.body;
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      { name, city, country, description, price,starRating, type, facilities, adultCount, childCount, Images  },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    res.status(500).json({ message: "Failed to update hotel" });
  }
};

export const deleteHotel = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Hotel.findByIdAndDelete(id);
    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete Hotel" });
  }
};
