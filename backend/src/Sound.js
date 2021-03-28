const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const SoundSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  url_vocals: String,
  url_accompaniment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

SoundSchema.pre("save", function () {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.key}`;
    const keyFolder = this.key.split('.')[0];
    this.url_vocals = `${process.env.APP_URL}/files/spleeter/${keyFolder}/vocals.mp3`;
    this.url_accompaniment = `${process.env.APP_URL}/files/spleeter/${keyFolder}/accompaniment.mp3`;
  }
});

SoundSchema.pre("remove", function () {
  const keyFolder = this.key.split('.')[0];
  fs.rmdirSync(path.resolve(__dirname, "..", "tmp", "uploads", "spleeter", keyFolder), { recursive: true })
  return promisify(fs.unlink)(
    path.resolve(__dirname, "..", "tmp", "uploads", this.key)
  );
});

module.exports = mongoose.model("Sound", SoundSchema);