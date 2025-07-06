import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function searchPerson(req, res) {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    const person = response.results[0];
    const existingEntry = req.user.searchHistory.find(
      (entry) => entry.id === person.id && entry.searchType === "person"
    );

    if (!existingEntry) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          searchHistory: {
            id: person.id,
            image: person.profile_path,
            title: person.name,
            searchType: "person",
            createdAt: new Date(),
          },
        },
      });
    }

    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.log("Error in searchPerson controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function searchMovie(req, res) {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    const movie = response.results[0];
    const existingEntry = req.user.searchHistory.find(
      (entry) => entry.id === movie.id && entry.searchType === "movie"
    );

    if (!existingEntry) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          searchHistory: {
            id: movie.id,
            image: movie.poster_path,
            title: movie.title,
            searchType: "movie",
            createdAt: new Date(),
          },
        },
      });
    }

    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.log("Error in searchMovie controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function searchTv(req, res) {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    const tvShow = response.results[0];
    const existingEntry = req.user.searchHistory.find(
      (entry) => entry.id === tvShow.id && entry.searchType === "tv"
    );

    if (!existingEntry) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          searchHistory: {
            id: tvShow.id,
            image: tvShow.poster_path,
            title: tvShow.name,
            searchType: "tv",
            createdAt: new Date(),
          },
        },
      });
    }

    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.log("Error in searchTv controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getSearchHistory(req, res) {
  try {
    res.status(200).json({ success: true, content: req.user.searchHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function removeItemFromSearchHistory(req, res) {
  let { id } = req.params;

  id = parseInt(id);

  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        searchHistory: { id: id },
      },
    });
    res
      .status(200)
      .json({ success: true, message: "Item removed from search history" });
  } catch (error) {
    console.log(
      "Error in removeItemFromSearchHistory Controller: ",
      error.message
    );
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
