import React from 'react'

const Biography = ({imageUrl}) => {
  return (
    <div className='container biography'>
      <div className='banner'>
        <img src={imageUrl} alt='aboutImg' />
      </div>
      <div className="banner">
        <p>Biography</p>
        <h3>Who Are We?</h3>
        <p>
        We are a state-of-the-art healthcare management system designed to transform the healthcare experience for providers, patients, and administrators alike. At our core, we are innovators and problem-solvers, committed to addressing the complexities of modern healthcare with seamless, integrated solutions. Our platform is built to optimize operations, enhance patient care, and promote transparency across all levels of the healthcare ecosystem. By leveraging advanced technology, we empower stakeholders to navigate challenges, streamline workflows, and focus on what truly matters—delivering high-quality, patient-centered care. Together, we are shaping a future where healthcare is more accessible, efficient, and impactful for all.
        </p>
      </div>  
    </div>
  )
}

export default Biography