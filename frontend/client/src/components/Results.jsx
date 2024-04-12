import React, { useEffect, useState } from 'react'

const Results = ({ results }) => {

    return (
        <div className="container">
            {results.map((item, key) =>
                <div >
                    <h2>Question {key + 1}</h2>

                    <p>{item}</p>

                </div>
            )}
        </div>
    )
}

export default Results