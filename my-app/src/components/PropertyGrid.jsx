import React from 'react';
import PropertyCard from './PropertyCard.jsx';
// Assuming 'sites' is your property data. Ensure the path is correct.
// If you have a different data source, adjust this import.
import { sites as propertiesData } from '../data/frontend.js';

export default function PropertyGrid({ properties: list = propertiesData }) {
  return (
    <section className="flex flex-wrap justify-center gap-8 sm:gap-10 lg:gap-12 max-w-full mx-auto px-4"> {/* Increased gap and added horizontal padding */}
      {list.map((prop) => (
        <PropertyCard key={prop.id} property={prop} />
      ))}
    </section>
  );
}
