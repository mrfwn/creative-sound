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
    urls_beats_vocals = [],
    url_bass = "",
    urls_beats_bass = [],
    url_piano = "",
    urls_beats_piano = [],
    url_drums = "",
    urls_beats_drums = [],
    url_other = "",
    urls_beats_other = []
  } = req.file;




  console.log(`spleeter ${key}`) // TODO: files with spaces are breaking
  const pathFile = path.resolve(__dirname, "..", "tmp", "uploads");
  const pathSample = path.resolve(__dirname, "..", "tmp", "uploads", "spleeter");

  await spawn(`cd ${pathFile} && spleeter separate -p spleeter:5stems -c mp3 -o spleeter ${key}`, {
    shell: true
  });
  console.log("Passou Spleet");
  const { stdout } = await spawn('python', ['sample.py', `${pathSample}/${key}`], { encoding: 'utf8', maxBuffer: 2 * 2048 * 2048 });
  console.log("Passou Beat");
  const beats = JSON.parse(stdout);
  const keyFolder = key.split('.')[0];

  const sound = await Sound.create({
    name,
    size,
    key,
    url,
    url_vocals,
    urls_beats_vocals: beats.vocals.length > 0 ? beats.vocals.map(beat => `${process.env.APP_URL}/files/spleeter/${keyFolder}/vocals/${beat}`) : [],
    url_bass,
    urls_beats_bass: beats.bass.length > 0 ? beats.bass.map(beat => `${process.env.APP_URL}/files/spleeter/${keyFolder}/bass/${beat}`) : [],
    url_piano,
    urls_beats_piano: beats.piano.length > 0 ? beats.piano.map(beat => `${process.env.APP_URL}/files/spleeter/${keyFolder}/piano/${beat}`) : [],
    url_drums,
    urls_beats_drums: beats.drums.length > 0 ? beats.drums.map(beat => `${process.env.APP_URL}/files/spleeter/${keyFolder}/drums/${beat}`) : [],
    url_other,
    urls_beats_other: beats.other.length > 0 ? beats.other.map(beat => `${process.env.APP_URL}/files/spleeter/${keyFolder}/other/${beat}`) : []
  });

  return res.json(sound);
});

routes.delete("/sounds/:id", async (req, res) => {
  const sound = await Sound.findById(req.params.id);

  await sound.remove();

  return res.send();
});

module.exports = routes;
