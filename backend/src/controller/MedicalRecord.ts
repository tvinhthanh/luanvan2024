import { Request, Response } from "express";
import MedicalRecord from "../models/MedicalRecord";

export const getAllMedicalRecords = async (req: Request, res: Response) => {
  try {
    const medicalRecords = await MedicalRecord.find().populate('userID pet');
    res.status(200).json(medicalRecords);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch medical records" });
  }
};

export const createMedicalRecord = async (req: Request, res: Response) => {
  const { userID, pet, date, description, status } = req.body;
  try {
    const newRecord = new MedicalRecord({ userID, pet, date, description, status });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ message: "Failed to create medical record" });
  }
};

export const updateMedicalRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userID, pet, date, description, status } = req.body;
  try {
    const updateData: any = { userID, pet, date, description, status };
    const updatedRecord = await MedicalRecord.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedRecord);
  } catch (err) {
    res.status(500).json({ message: "Failed to update medical record" });
  }
};

export const deleteMedicalRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await MedicalRecord.findByIdAndDelete(id);
    res.status(200).json({ message: "Medical record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete medical record" });
  }
};
export const getMedicalRecordById = async (req: Request, res: Response) => {
    try {
      const medicalRecordId = req.params.id;
      const medicalRecord = await MedicalRecord.findById(medicalRecordId).populate('userID pet');
      if (!medicalRecord) {
        return res.status(404).json({ message: "Medical record not found" });
      }
      res.status(200).json(medicalRecord);
    } catch (error) {
      console.error("Error fetching medical record:");
      res.status(500).json({ message: "Failed to fetch medical record" });
    }
  };