import { Link } from "react-router-dom";
import { Play, Info } from "lucide-react";
import Navbar from "../../components/Navbar";
import useGetTrendingContent from "../../hooks/useGetTrendingContent";
import {
  MOVIE_CATEGORIES,
  ORIGINAL_IMG_BASE_URL,
  TV_CATEGORIES,
} from "../../utils/constant";
import { useContentStore } from "../../store/content";
import MovieSlider from "../../components/MovieSlider";
import { useState } from "react";

const HomeScreen = () => {
  const { trendingContent } = useGetTrendingContent();
  const { contentType } = useContentStore();
  const [imgLoading, setImageLoading] = useState(true);

  console.log("Content Type:", contentType); // Debug contentType
  console.log(
    contentType === "movie" ? "Movie Categories:" : "TV Categories:",
    contentType === "movie" ? MOVIE_CATEGORIES : TV_CATEGORIES
  );

  if (!trendingContent)
    return (
      <div className="h-screen text-white relative">
        <Navbar />
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer -z-10"></div>
      </div>
    );

  return (
    <>
      <div className="relative h-screen text-white">
        <Navbar />

        {imgLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer -z-10" />
        )}
        <img
          src={ORIGINAL_IMG_BASE_URL + trendingContent?.backdrop_path}
          alt="Hero"
          className="absolute top-0 left-0 w-full h-full object-cover -z-50"
          onLoad={() => {
            setImageLoading(false);
          }}
        />
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black -z-40"
          aria-hidden="true"
        />

        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32">
          <div className="max-w-2xl">
            <h1 className="mt-4 text-5xl md:text-6xl font-extrabold drop-shadow-md">
              {trendingContent?.title || trendingContent?.name}
            </h1>
            <p className="mt-2 text-lg opacity-90">
              {trendingContent?.release_date?.split("-")[0] ||
                trendingContent?.first_air_date.split("-")[0]}{" "}
              | {trendingContent?.adult ? "18+" : "PG-13"}
            </p>
            <p className="mt-4 text-lg opacity-90">
              {trendingContent?.overview.length > 200
                ? trendingContent?.overview.slice(0, 200) + "..."
                : trendingContent?.overview}
            </p>
          </div>
          <div className="flex mt-8 gap-4">
            <Link
              to={`/watch/${trendingContent?.id}`}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md flex items-center"
            >
              <Play className="mr-2" />
              Play
            </Link>
            <Link
              to={`/details/${trendingContent?.id}`}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-md flex items-center"
            >
              <Info className="mr-2" />
              More Info
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 bg-black py-10">
        {contentType === "movie"
          ? MOVIE_CATEGORIES.map((category) => (
              <MovieSlider key={category} category={category} />
            ))
          : TV_CATEGORIES.map((category) => (
              <MovieSlider key={category} category={category} />
            ))}
      </div>
    </>
  );
};

export default HomeScreen;
