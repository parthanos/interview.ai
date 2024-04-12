import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./styles.css"
import techFields from '../data/techFields'
import axios from 'axios';

const Home = ({updateQues, setF}) => {
    const [ques,setQues]=useState();
    const navigate = useNavigate();
    const fieldClicked= async (field)=>{
        axios.post('http://localhost:4000/techField', {
            "field": field
          })
          .then(async function (response) {
            setF(field)
            setQues(response.data)
            await updateQues(response.data)
            navigate('/questions')
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    return (
        <div className='home-container'>
            
            <div className='home-contents'>
            <h1>Interview.ai</h1>
            <br></br>

                {
                    
                    techFields.map((field,key) =>
                        <button className='home-button' onClick={()=>fieldClicked(field)}>
                            {field}
                        </button>

                    )
                }
            </div>


        </div>
    )
}

export default Home