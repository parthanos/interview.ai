//jshint esversion:6
const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const axios = require('axios');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });
  

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
    credentials: true
}));

const py_url="https://20b3-54-83-110-134.ngrok-free.app";


app.post("/techField",async (req,res)=>{
    console.log(req.body.field)
    //axios.get(`).then(function(response){res.status(200).json(response)})
    const backres = await axios.get(`${py_url}/questions/${req.body.field}`)
    // console.log(backres)
    res.status(200).json(backres.data.questions)
})
app.post("/answers",(req,res)=>{
    console.log(req.body)
    axios.post(`${py_url}/answer_analysis`,req.body).then(function (response){
      console.log(response.data.response)
      res.status(200).json(response.data.response)
    })
    // res.status(200).json([{q:"name", your_ans:"", score:"good",suggestions:"louder"},{q:"hobbies", your_ans:"", score:"hobbies",suggestions:""},{q:"role", your_ans:"", score:"role",suggestions:""}])
    
})
app.post('/api/upload-audio', upload.single('audio'), (req, res) => {
  // 'audio' should match the name of the field in your FormData object

  // Access the uploaded file via req.file
  const audioFile = req.file;

  // Process the uploaded audio file as needed
  console.log('Audio file received:', audioFile);

  // Send a response back to the client
  res.send('Audio uploaded successfully');
});
app.post('/asr', (req, res) => {
  // 'audio' should match the name of the field in your FormData object

  // Access the uploaded file via req.file
  console.log(req.body)
});




app.listen(4000, function(){
    console.log('server connected on port 4000');
})