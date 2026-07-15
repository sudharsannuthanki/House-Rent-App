import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProperties } from "../../api";

import HeroLanding from "../../components/HeroLanding";
import AllPropertiesCards from "../user/AllPropertiesCards";
import { PropertyGridSkeleton } from "../../components/Skeleton";

const categories = [
  { icon: "🏢", label: "Apartment", propertyType: "apartment" },
  { icon: "🏡", label: "Villa", propertyType: "villa" },
  { icon: "🏠", label: "Independent House", propertyType: "house" },
  { icon: "🛏", label: "PG / Hostel", propertyType: "pg" },
];

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const data = await getProperties();
        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const featured = properties.slice(0, 8);
  const latest = [...properties]
    .reverse()
    .slice(0, 6);

  return (
    <>
      <HeroLanding featured={properties[0]} />

      <section className="section">
        <div className="container">

          <div className="section-header">
            <div>
              <h2>Featured Properties</h2>
              <p>
                Handpicked homes from verified owners.
              </p>
            </div>
          </div>

          {loading ? (
            <PropertyGridSkeleton count={8} />
          ) : featured.length ? (
            <div className="grid">
              {featured.map((property) => (
                <AllPropertiesCards
                  key={property._id}
                  property={property}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No properties available.
            </div>
          )}
        </div>
      </section>

      <section className="section light">
        <div className="container">

          <div className="section-header">
            <div>
              <h2>Browse by Category</h2>
              <p>
                Choose the type of property you are looking for.
              </p>
            </div>
          </div>

          <div className="category-grid">

            {categories.map((category) => (
              <Link
                key={category.propertyType}
                to={`/renter/properties?propertyType=${category.propertyType}`}
                className="category-card"
              >
                {category.icon}
                <h3>{category.label}</h3>
              </Link>
            ))}

          </div>

        </div>
      </section>

      <section className="section">
        <div className="container">

          <div className="section-header">
            <div>
              <h2>Latest Listings</h2>
              <p>
                Newly listed rental properties.
              </p>
            </div>
          </div>

          {loading ? (
            <PropertyGridSkeleton count={6} />
          ) : (
            <div className="grid">
              {latest.map((property) => (
                <AllPropertiesCards
                  key={property._id}
                  property={property}
                />
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}

export default Home;