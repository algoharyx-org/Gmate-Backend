import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      minlength: 10,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
      select: false,
    },
    avatar: {
      url: String,
      publicId: String
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: { type: Boolean, default: true },
    resetCode: { type: String, select: false },
    resetCodeExpireTime: { type: Date, select: false },
    resetCodeVerify: { type: Boolean, select: false },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password, 12);
});

userSchema.methods.comparePassword = function (userPassword) {
  return bcrypt.compareSync(userPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
