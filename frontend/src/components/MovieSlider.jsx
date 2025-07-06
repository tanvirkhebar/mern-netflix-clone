import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link } from "react-router-dom";
import { SMALL_IMAGE_BASE_URL } from "../utils/constant";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MovieSlider = ({ category }) => {
  const { contentType } = useContentStore();
  const [content, setContent] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const sliderRef = useRef(null);

  const formattedCategoryName = category.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase());
  const formattedContentType = contentType.trim() === "movie" ? "Movies" : "TV Shows";

  useEffect(() => {
    const getContent = async () => {
      try {
        console.log(`Fetching content for type: ${contentType.trim()}, category: ${category}`);
        const res = await axios.get(`/api/v1/${contentType.trim()}/${category}`);
        console.log("API Response:", res.data.content);

        if (res.data.content) {
          setContent(res.data.content);
        } else {
          console.warn("No content received from API.");
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    getContent();
  }, [contentType, category]);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: +sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="relative bg-gradient-to-b from-black to-[#141414] text-white px-4 md:px-16 py-6"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      {/* Section Title */}
      <h2 className="mb-4 text-3xl font-extrabold text-[#e50914] tracking-wide">
        {formattedCategoryName} {formattedContentType}
      </h2>

      {/* Slider Content */}
      <div className="flex space-x-6 overflow-x-scroll scrollbar-hide" ref={sliderRef}>
        {content.length > 0 ? (
          content.map((item) => (
            <Link
              to={`/watch/${item.id}`}
              className="min-w-[280px] relative group"
              key={item.id}
            >
              <div className="relative rounded-lg overflow-hidden transform transition-transform duration-300 ease-out group-hover:scale-105">
                {/* Movie/TV Image */}
                <img
                  src={SMALL_IMAGE_BASE_URL + item.backdrop_path}
                  alt={item.title || item.name || "Content image"}
                  className="rounded-lg shadow-lg transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent group-hover:opacity-80 transition-opacity duration-300"></div>
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-lg group-hover:shadow-[0_0_20px_10px_rgba(229,9,20,0.6)] transition-shadow duration-300"></div>
              </div>

              {/* Title */}
              <p className="mt-2 text-center text-white font-extrabold text-xl group-hover:text-[#e50914] group-hover:font-semibold tracking-wide transition-all duration-300">
                {item.title || item.name}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-lg text-center text-gray-500">No content available.</p>
        )}
      </div>

      {/* Scroll Arrows */}
      {showArrows && (
        <>
          <button
            className="absolute top-1/2 -translate-y-1/2 left-2 md:left-10 flex items-center justify-center w-12 h-12 rounded-full bg-[#e50914] bg-opacity-70 hover:bg-opacity-90 text-white z-10 transition-all duration-300 transform hover:scale-110"
            aria-label="Scroll left"
            onClick={scrollLeft}
          >
            <ChevronLeft size={28} />
          </button>

          <button
            className="absolute top-1/2 -translate-y-1/2 right-2 md:right-10 flex items-center justify-center w-12 h-12 rounded-full bg-[#e50914] bg-opacity-70 hover:bg-opacity-90 text-white z-10 transition-all duration-300 transform hover:scale-110"
            aria-label="Scroll right"
            onClick={scrollRight}
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}
    </div>
  );
};

export default MovieSlider;
