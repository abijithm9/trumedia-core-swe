import React from 'react'
import './BaseballLoadingSpinner.css'
import baseballImage from "./baseball.png" 

const BaseballSpinner = () => {
  return (
    <div className="spinner-container">
        <img src={baseballImage} alt="Baseball" style={{
          width: '60px',
          height: '60px',
          animation: 'spin 1s linear infinite'
        }} />
        <img src={baseballImage} alt="Baseball" style={{
          width: '60px',
          height: '60px',
          animation: 'spin 1s linear infinite'
        }} />
        <img src={baseballImage} alt="Baseball" style={{
          width: '60px',
          height: '60px',
          animation: 'spin 1s linear infinite'
        }} />
    </div>
  )
}

export default BaseballSpinner