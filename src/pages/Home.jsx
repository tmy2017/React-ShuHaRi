import SearchBar from '../components/SearchBar';
import PropertyList from '../components/PropertyList';

function Home() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">Find your perfect stay</h1>
          <p className="hero-subtitle">
            Discover amazing places to stay around the world
          </p>
        </div>
      </div>
      
      <div className="home-content">
        <SearchBar />
        <PropertyList />
      </div>
    </div>
  );
}

export default Home;
