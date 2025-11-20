import Hero from '../components/layout/Hero';
import GenderCollectionSection from '../components/products/GenderCollectionSection';
import NewArrivalProducts from '../components/products/NewArrivalProducts';
import Productdetails from '../components/products/Productdetails';
import WomenTops from '../components/products/WomensTops'; 
import Featuredcollections from '../components/products/Featuredcollections';
import FeaturesSection from '../components/products/FeaturesSection';
import BestSellers from '../components/products/BestSellers';

const Home = () => {

  return (
    <div className="bg-gray-50">
      <Hero /> 

      <section className="mt-12">
        <GenderCollectionSection />
      </section>

      <section className="mt-12">
        <NewArrivalProducts />
      </section>

<section className="px-4 md:px-8">
  <h1 className="text-3xl md:text-4xl text-center text-gray-900 font-bold mb-1">
    Best Sellers
  </h1>
  <BestSellers />
</section>


      <section className="mt-4 px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl text-center text-gray-900 font-bold mb-8">
          Top Wears for Women
        </h2>
        <WomenTops />
      </section>

     
      <section>
        <Featuredcollections/>
      </section>

      
      <section>
        <FeaturesSection/>
      </section>
    </div>
  );
};

export default Home;