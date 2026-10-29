const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        specialty: {
            type: String,
            required: true,
            trim: true,
        },

        bio: {
            type: String,
            trim: true,
        },

        workingDays: {
            type: [
                {
                    type: Number,
                    min: 1,
                    max: 5,
                    validate: {
                        validator: Number.isInteger,
                        message: "Working days must be integers.",
                    },
                },
            ],
            required: true,
            validate: {
                validator: (days) =>
                    days.length > 0 &&
                    new Set(days).size === days.length,
                message: "Working days must be unique and cannot be empty.",
            },
        },

        startTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):[0-5]\d$/,
        },

        endTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):[0-5]\d$/,
            validate: {
                validator: function (value) {
                    return value > this.startTime;
                },
                message: "End time must be after start time.",
            },
        },

        slotDuration: {
            type: Number,
            required: true,
            default: 30,
            min: 1,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);