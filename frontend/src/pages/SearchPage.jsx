import { useState } from "react";
import { useContentStore } from "../store/content";
import Navbar from "../components/Navbar";
import { Search } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constant";

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState("movie");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const { setContentType } = useContentStore();

  // Handles tab selection
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setContentType(tab);
    setResults([]); // Clear results when switching tabs
  };

  // Handles search form submission
  const handleSearch = async (e) => {
    e.preventDefault();

    // Validate search term
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term.");
      return;
    }

    try {
      const res = await axios.get(
        `/api/v1/search/${activeTab}/${encodeURIComponent(searchTerm.trim())}`
      );
      const content = res.data.content;

      if (content && content.length > 0) {
        setResults(content);
        toast.success("Search results updated!");
      } else {
        setResults([]);
        toast.error("No results found for your search.");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error(
          "Nothing found, make sure you are searching under the right category."
        );
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Tabs for switching categories */}
        <div className="flex justify-center gap-3 mb-4">
          {["movie", "tv", "person"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 rounded ${
                activeTab === tab ? "bg-red-600" : "bg-gray-800"
              } hover:bg-red-700`}
              onClick={() => handleTabClick(tab)}
            >
              {tab === "movie"
                ? "Movies"
                : tab === "tv"
                ? "TV Shows"
                : "Person"}
            </button>
          ))}
        </div>

        {/* Search Form */}
        <form
          className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search for a ${activeTab}`}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
            <Search className="size-6" />
          </button>
        </form>

        {/* Search Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((result) => {
            // Skip results without valid image paths
            if (!result.poster_path && !result.profile_path) return null;

            return (
              <div key={result.id} className="bg-gray-800 p-4 rounded">
                {activeTab === "person" ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={ORIGINAL_IMG_BASE_URL + result.profile_path}
                      alt={result.name}
                      className="max-h-96 rounded mx-auto"
                    />
                    <h2 className="mt-2 text-xl font-bold">{result.name}</h2>
                  </div>
                ) : (
                  <Link
                    to={`/watch/${result.id}`}
                    onClick={() => {
                      setContentType(activeTab);
                    }}
                  >
                    <img
                      src={ORIGINAL_IMG_BASE_URL + result.poster_path}
                      alt={result.title || result.name}
                      className="w-full h-auto rounded"
                    />
                    <h2 className="mt-2 text-xl font-bold">
                      {result.title || result.name}
                    </h2>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
