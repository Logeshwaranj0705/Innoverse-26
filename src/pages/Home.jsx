import React from 'react'
import Navbar from "../components/home/navbar";
import Hero from "../components/home/hero";
import About from "../components/home/about";
import Tracks from "../components/home/tracks";
import Timelap from "../components/home/timeline";
import Prizes from "../components/home/prizes";
import Footer from "../components/home/footer";
const Home = () => {
  return (
    <div className="bg-black min-h-screen">
          <Navbar />
          <section id="home">
            <Hero />
          </section>
    
          <section id="timeline">
            <Timelap />
          </section>
    
          <section id="about">
            <About />
          </section>
    
          <section id="tracks">
            <Tracks />
          </section>
    
          <section id="prizes">
            <Prizes />
          </section>
    
          <section id="footer">
            <Footer />
          </section>
        </div>
  )
}

export default Home