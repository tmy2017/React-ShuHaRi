import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropertyDetails from '../components/PropertyDetails';

function Property() {
  const { id } = useParams();
  const properties = useSelector(state => state.properties.list);
  
  const property = properties.find(p => p.id === parseInt(id));

  if (!property) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="property-page">
      <PropertyDetails property={property} />
    </div>
  );
}

export default Property;
