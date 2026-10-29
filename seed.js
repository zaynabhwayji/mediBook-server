require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");
const Doctor = require("./models/Doctor");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // 1. Create Admin
    const admin = await User.create({
      name: "MediBook Admin",
      email: "admin@medibook.com",
      password: "Admin12345",
      role: "admin",
    });

    // 2. Create Doctors
    const doctorsData = [
      {
        name: "Dr. Sarah Ahmad",
        email: "sarah@medibook.com",
        specialty: "Cardiology",
      },
      {
        name: "Dr. Ali Hassan",
        email: "ali@medibook.com",
        specialty: "Dermatology",
      },
      {
        name: "Dr. Maya Khalil",
        email: "maya@medibook.com",
        specialty: "Pediatrics",
      },
    ];

    for (const data of doctorsData) {
      const doctorUser = await User.create({
        name: data.name,
        email: data.email,
        password: "Doctor12345",
        role: "doctor",
      });

      await Doctor.create({
        user: doctorUser._id,
        specialty: data.specialty,
        bio: "",
        workingDays: [1, 2, 3, 4, 5],
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: 30,
      });
    }

    // 3. Create Patients
    await User.create([
      {
        name: "John Patient",
        email: "john@medibook.com",
        password: "Patient12345",
        role: "patient",
      },
      {
        name: "Lina Patient",
        email: "lina@medibook.com",
        password: "Patient12345",
        role: "patient",
      },
      {
        name: "Omar Patient",
        email: "omar@medibook.com",
        password: "Patient12345",
        role: "patient",
      },
    ]);

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();