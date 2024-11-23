import React from 'react'

const Hero = ({title,imageUrl}) => {
  return (
    <div className="hero container">
      <div className="banner">
        <h1>{title}</h1>
        <p>
          This Healthcare Management System is designed to provide comprehensive healthcare services 
          with compassion and expertise. Our team of skilled professionals is commited to deliver 
          personalized care tailored to each patient's needs. We prioritize your well-being , ensuring 
          a harmonious journey towards optimal health and wellness.
        </p>
      </div>
      <div className="banner">
        <img src={imageUrl} alt="hero" className="animated-image" />
        <span>
          <img src="/Vector.png" alt="vector" />
        </span>
      </div>
    </div>
  )
}

export default Hero;