import { Helmet } from "react-helmet-async";
import Hero from "../../Components/Layout/Hero";


const Home = () => {
  return (
   <>
   <Helmet>
       <title>Find Best PGs in India | Pribhumnest</title>
        <meta
          name="description"
          content="Pribhumnest helps you discover verified PGs across India with food, WiFi, and security. No brokerage, flexible stay, and easy shifting."
        />
        <link rel="canonical" href="https://pribhumnest.in" />
   </Helmet>
   <Hero/>
   </>
  );
};

export default Home;
