import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiMapPin, FiTag, FiSquare } from 'react-icons/fi'; // Changed FiRuler to FiSquare

/* Swiper (for slideable images) */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // Added Autoplay
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // Import autoplay CSS

/* helper: 6 200 000 → “62 Lakh” */
const toLakhs = (rupees) => {
  if (rupees === undefined || rupees === null) return 'N/A';
  // Ensure rupees is a number before rounding
  const numRupees = Number(rupees);
  if (isNaN(numRupees)) return 'N/A';

  const lakhs = Math.round(numRupees / 1_00_000);
  return `${lakhs} Lakh`;
};

export default function PropertyCard({ property }) {
  const {
    id,
    title,              // “Indirapuram, Ghaziabad”
    locality,           // “Locality 1” (or derive from title)
    price,              // 6200000
    units = 0,          // 2500 (optional, e.g., sq ft or property count)
    images = [],        // e.g. ['house1.jpg','house1b.jpg']
    city,               // Added city for better display
    propertyType,       // e.g., "Apartment", "Villa", "Plot"
  } = property;

  // Fallback for locality if not provided
  const displayLocality = locality || (title.includes(',') ? title.split(',')[0].trim() : title);
  const displayCity = city || (title.includes(',') ? title.split(',')[1]?.trim() : 'Unknown City');

  return (
    <Link
      to={`/properties/${id}`}
      className="relative block w-80 sm:w-80 md:w-96 lg:w-80 xl:w-96 rounded-xl overflow-hidden shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl group" // Enhanced shadow and hover
    >
      {/* ── Top: image carousel ─────────────── */}
      <div className="relative h-48 bg-gray-200"> {/* Increased height */}
        {images.length ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            loop
            navigation={{
              nextEl: `.swiper-button-next-${id}`,
              prevEl: `.swiper-button-prev-${id}`,
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }} // Auto-play images
            className="h-full w-full"
          >
            {images.map((img, index) => (
              <SwiperSlide key={`${id}-${img}-${index}`}>
                <img
                  src={`/images/${img}`}     /* adjust path if needed */
                  alt={`${title} - ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" // Subtle zoom on hover
                />
              </SwiperSlide>
            ))}
            {/* Custom Navigation Arrows (hidden by default, shown on hover) */}
            <div className={`swiper-button-prev swiper-button-prev-${id} absolute left-2 z-10 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <div className={`swiper-button-next swiper-button-next-${id} absolute right-2 z-10 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </Swiper>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-700">
              No Image Available
            </span>
          </div>
        )}
      </div>

      {/* ── Bottom: summary text ──────────────────────────────────── */}
      <div className="bg-white p-5 space-y-2"> {/* Increased padding and spacing */}
        <h3 className="font-extrabold text-xl text-gray-900 truncate" title={title}>
          {title}
        </h3>
        <p className="text-sm text-gray-600 flex items-center">
          <FiMapPin className="mr-1 text-blue-500" /> {displayLocality}, {displayCity}
        </p>
        <p className="text-md text-gray-700 flex items-center font-semibold">
          <FiTag className="mr-1 text-green-500" /> {toLakhs(price)}
        </p>
        {propertyType && (
          <p className="text-sm text-gray-600 flex items-center">
            <FiSquare className="mr-1 text-purple-500" /> {propertyType} {units ? `• ${units} units` : ''} {/* Changed FiRuler to FiSquare */}
          </p>
        )}
      </div>

      {/* Decorative arrow for "View Details" */}
      <div className="absolute bottom-4 right-4 bg-blue-600 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
        <FiChevronRight className="w-6 h-6" />
      </div>
    </Link>
  );
}
