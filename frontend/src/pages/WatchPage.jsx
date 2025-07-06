import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from "react-player";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMAGE_BASE_URL } from "../utils/constant";
import { formatReleaseDate } from "../utils/date.Function";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";

const WatchPage = () => {
  const { id } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [currentTrailersIdx, setCurrentTrailersIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [similarContent, setSimilarContent] = useState([]);
  const { contentType } = useContentStore();
  const sliderRef = useRef(null);

  useEffect(() => {
    // Scroll to the top of the page when component is mounted
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        setLoading(true);
        const [trailersRes, similarContentRes, contentDetailsRes] =
          await Promise.all([
            axios.get(`/api/v1/${contentType}/${id}/trailers`),
            axios.get(`/api/v1/${contentType}/${id}/similar`),
            axios.get(`/api/v1/${contentType}/${id}/details`),
          ]);

        setTrailers(trailersRes.data.trailers || []);
        setSimilarContent(similarContentRes.data.similar || []);
        setContent(contentDetailsRes.data.content || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setTrailers([]);
        setSimilarContent([]);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contentType, id]);

  const handleNext = () => {
    if (currentTrailersIdx < trailers.length - 1) {
      setCurrentTrailersIdx(currentTrailersIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentTrailersIdx > 0) {
      setCurrentTrailersIdx(currentTrailersIdx - 1);
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#1e1e1e] to-[#121212] p-10">
        <WatchPageSkeleton />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-gradient-to-r from-[#1e1e1e] to-[#121212] text-white h-screen">
        <div className="max-w-6xl mx-auto">
          <Navbar />
          <div className="text-center mx-auto px-4 py-8 h-full mt-40">
            <h2 className="text-3xl sm:text-5xl font-semibold text-balance">
              Content not found 😢{" "}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#1e1e1e] to-[#121212] min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <Navbar />

        {trailers.length > 0 ? (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <button
                className={`bg-gray-600/60 hover:bg-gray-600 text-white py-3 px-5 rounded-lg transition-all duration-300 ${currentTrailersIdx === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={currentTrailersIdx === 0}
                onClick={handlePrev}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className={`bg-gray-600/60 hover:bg-gray-600 text-white py-3 px-5 rounded-lg transition-all duration-300 ${currentTrailersIdx === trailers.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={currentTrailersIdx === trailers.length - 1}
                onClick={handleNext}
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="aspect-video p-2 sm:px-10 md:px-32 rounded-xl shadow-2xl">
              <ReactPlayer
                controls
                width="100%"
                height="70vh"
                className="mx-auto overflow-hidden rounded-lg shadow-lg"
                url={`https://www.youtube.com/watch?v=${trailers[currentTrailersIdx]?.key}`}
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400">No trailers available.</p>
        )}

        <hr className="my-6 border-gray-700" />

        {content ? (
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h2 className="text-6xl font-bold leading-tight">{content?.title || content?.name}</h2>
              <p className="mt-2 text-xl text-gray-300">
                {formatReleaseDate(content?.release_date || content?.first_air_date)} |{" "}
                {content?.adult ? (
                  <span className="text-red-600">18+</span>
                ) : (
                  <span className="text-green-600">PG-13</span>
                )}
              </p>
              <p className="mt-6 text-lg text-gray-400">{content?.overview}</p>
            </div>
            <img
              src={ORIGINAL_IMG_BASE_URL + content?.poster_path}
              alt="Poster"
              className="max-h-[700px] rounded-lg shadow-2xl"
            />
          </div>
        ) : (
          <p className="text-center text-gray-400">⚠️</p>
        )}

        <hr className="my-8 border-gray-700" />

        {similarContent.length > 0 && (
          <div className="mt-12 max-w-6xl mx-auto relative">
            <h3 className="text-4xl font-bold mb-6 text-center">Similar Movies/TV Shows</h3>
            <div className="flex overflow-x-scroll scrollbar-hide gap-6 pb-6 group" ref={sliderRef}>
              {similarContent.map((content) => {
                if (content.poster_path === null) return null;
                return (
                  <Link
                    key={content.id}
                    to={`/watch/${content.id}`}
                    className="w-64 flex-none rounded-lg overflow-hidden shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    <img
                      src={SMALL_IMAGE_BASE_URL + content.poster_path}
                      alt="Poster"
                      className="w-full h-auto rounded-lg"
                    />
                    <h4 className="mt-4 text-lg font-semibold text-center text-gray-100">{content.title || content.name}</h4>
                  </Link>
                );
              })}
              <button
                className="absolute top-1/2 -translate-y-1/2 left-6 md:left-12 flex items-center justify-center w-10 h-10 rounded-full bg-[#e50914] bg-opacity-80 hover:bg-opacity-90 text-white z-10 transition-all duration-300 transform hover:scale-110"
                aria-label="Scroll left"
                onClick={scrollLeft}
              >
                <ChevronLeft size={28} />
              </button>

              <button
                className="absolute top-1/2 -translate-y-1/2 right-6 md:right-12 flex items-center justify-center w-10 h-10 rounded-full bg-[#e50914] bg-opacity-80 hover:bg-opacity-90 text-white z-10 transition-all duration-300 transform hover:scale-110"
                aria-label="Scroll right"
                onClick={scrollRight}
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;

