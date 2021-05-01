const routes = require("express").Router();
var spawn = require('promisify-child-process').spawn;

const multer = require("multer");
const multerConfig = require("./multer");
const path = require("path");


const Sound = require("./Sound");

routes.get("/sounds", async (req, res) => {
  const sounds = await Sound.find();

  return res.json(sounds);
});

routes.post("/sounds", multer(multerConfig).single("file"), async (req, res) => {
  const { originalname: name, 
    size, 
    key, 
    location: url = "", 
    url_vocals = "", 
    url_bass = "", 
    url_piano = "", 
    url_drums = "", 
    url_other = "" } = req.file;
  const sound = await Sound.create({
    name,
    size,
    key,
    url,
    url_vocals,
    url_bass,
    url_piano,
    url_drums,
    url_other,
  });
  console.log(`spleeter ${key}`) // TODO: files with spaces are breaking
  const pathFile = path.resolve(__dirname, "..", "tmp", "uploads");

  await spawn(`cd ${pathFile} && spleeter separate -p spleeter:5stems -c mp3 -o spleeter ${key}`, {
    shell: true
  });
  return res.json(sound);
});

routes.delete("/sounds/:id", async (req, res) => {
  const sound = await Sound.findById(req.params.id);

  await sound.remove();

  return res.send();
});

module.exports = routes;
