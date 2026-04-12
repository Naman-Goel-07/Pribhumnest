import React from 'react'
import Banner from '../Utils/Banner'
import NewlyAdded from '../Products/NewlyAdded'
import Features from '../Products/Features'
import Testimonials from './Testimonials'
import ProductAddOwner from '../Products/ProductAddOwner'
import Faqs from './Faqs'

const Hero = () => {
  
  return (
    <>
    <Banner/>
    <NewlyAdded/>
    <Features/>
    <Testimonials/>
    <ProductAddOwner/>
    <Faqs/>
    </>
  )
}

export default Hero