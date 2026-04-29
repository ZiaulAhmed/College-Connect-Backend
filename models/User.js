// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ================= BASIC DETAILS =================
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student",
    },

    department: {
      type: String,
      default: null,
    },

    // ================= STUDENT FIELDS =================
    dob: {
      type: Date,
      default: null,
    },

    contact: {
      type: String,
      default: null,
    },

    admissionToken: {
      type: String,
      unique: true,
      sparse: true, // allows null for faculty/admin
      trim: true,
    },

    semester: {
      type: Number,
      default: null,
    },

    // ================= FACULTY FIELDS =================
    facultyId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    aadharId: {
      type: String,
      default: null,
    },

    panId: {
      type: String,
      default: null,
    },

    addressProof: {
      type: String,
      default: null, // later can store file URL
    },

    bankDetails: {
      accountNumber: { type: String, default: null },
      ifscCode: { type: String, default: null },
      bankName: { type: String, default: null },
    },

    // ================= APPROVAL WORKFLOW =================
    approvalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    approvalComment: {
      type: String,
      default: null, // admin comment on approval/rejection
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ================= SECURITY =================
// Remove password before sending user object to client
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
