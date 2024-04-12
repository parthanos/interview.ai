import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Questions from "./components/Questions";
import { useState } from "react";
import Results from "./components/Results";

function App() {
  const [q,setQ]=useState()
  const [results, setResults] =useState([]);
  const [f, setF] =  useState("");


  function updateQues(ques){
    setQ(ques)
  }
  function updateRes(res){
    setResults(res)
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home updateQues={updateQues} setF={setF} />} />
        <Route path="/questions" element={<Questions ques={q} updateRes={updateRes} f={f}/>} />
        <Route path="/results" element={<Results results={results}/>} />
   
          
      </Routes>
    </BrowserRouter>
  );
}

export default App;
