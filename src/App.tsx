import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import MovieCard from "./components/MovieCard";
import InfiniteScrollComponent from "./components/InfiniteScrollComponent";
import useDebounce from "./hooks/useDebounce";
import Backdrop from "./Backdrop";
import SelectComponent from "./components/SelectComponent";
import Tabs from "./components/Tabs";
import { customLocalStorage } from "./utility/customLocalStorage";

const options = ["ALL", "FAVOURITES"];

export type MOVIE_TYPE = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type CATEGORY_TYPE = {
  id: number;
  name: string;
};

const App = () => {
  const [movies, setMovies] = useState<MOVIE_TYPE[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<CATEGORY_TYPE[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number | string>("");
  const [activeTab, setActiveTab] = useState("ALL");

  const getAllMovies = async (page: number = 1, id: number | null = null) => {
    const params: any = {};
    params["api_key"] = import.meta.env.VITE_API_KEY;
    params["page"] = page;
    if (id) {
      params["with_genres"] = id;
    }
    const result = await axios.get(import.meta.env.VITE_MAIN_URL, {
      params,
    });
    setCurrentPage(result.data.page);
    setTotalData(result.data.total_results);
    if (result.data.results.length) {
      if (page > 1) {
        setMovies((prevState) => [...prevState, ...result.data.results]);
      } else {
        setMovies(result.data.results);
      }
    }
  };

  const getSearchResults = async (query: string, page: number = 1) => {
    const result = await axios.get(import.meta.env.VITE_SEARCH_URL, {
      params: {
        api_key: import.meta.env.VITE_API_KEY,
        query,
        page,
      },
    });
    setCurrentPage(result.data.page);
    setTotalData(result.data.total_results);
    if (result.data.results.length) {
      if (page > 1) {
        setMovies((prevState) => [...prevState, ...result.data.results]);
      } else {
        setMovies(result.data.results);
      }
    }
  };

  const searchMovie = async (value: string) => {
    setLoading(true);
    try {
      if (value.trim() === "") {
        await getAllMovies();
      } else {
        await getSearchResults(value);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error ", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const debounceSearchMovie = useDebounce(searchMovie);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (value === searchQuery.trim()) {
      return;
    }
    debounceSearchMovie(value.trim());
  };

  const getAllCategories = async () => {
    const result = await axios.get(import.meta.env.VITE_CATEGORY_URL, {
      params: {
        api_key: import.meta.env.VITE_API_KEY,
      },
    });
    setCategories(result.data.genres);
  };

  const onLoad = async () => {
    setLoading(true);
    try {
      await getAllMovies(1);
      await getAllCategories();
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error ", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = async () => {
    setCurrentPage(currentPage + 1);
    if (searchQuery === "") {
      await getAllMovies(currentPage + 1);
    } else {
      await getSearchResults(searchQuery, currentPage + 1);
    }
  };

  const handleActiveTab = (value: string) => {
    if (value === activeTab) {
      return;
    }
    setActiveTab(value);
    setCurrentPage(1);
    if (value === "FAVOURITES") {
      const movies = customLocalStorage.getData("favMovies") ?? [];
      setMovies(movies);
    } else {
      getAllMovies(1);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div id="app">
      <Backdrop isLoading={loading} />
      <div className="header-section">
        <input
          placeholder="search movie..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
        <div>
          <SelectComponent
            options={categories}
            selectedCategory={selectedCategory}
            placeholder="Select a Category"
            onChange={(value) => {
              getAllMovies(1, Number(value));
              setSelectedCategory(Number(value));
            }}
          />
        </div>
      </div>
      <div className="tabs-section">
        <Tabs
          options={options}
          activeTab={activeTab}
          handleClick={handleActiveTab}
        />
      </div>
      <div id="movies-section">
        {activeTab === "ALL" ? (
          <InfiniteScrollComponent
            currentCount={movies.length}
            loadFetchMoreData={loadMoreMovies}
            targetId="movies-section"
            totalData={totalData}
          >
            {movies.map((movie) => (
              <div key={movie.id}>
                <MovieCard
                  imageUrl={movie.poster_path}
                  title={movie.title}
                  rating={movie.vote_average}
                  ratingCount={movie.vote_count}
                  description={movie.overview}
                  data={movie}
                />
              </div>
            ))}
          </InfiniteScrollComponent>
        ) : (
          <div className="fav-movie-container">
            {movies.map((movie) => (
              <div key={movie.id}>
                <MovieCard
                  imageUrl={movie.poster_path}
                  title={movie.title}
                  rating={movie.vote_average}
                  ratingCount={movie.vote_count}
                  description={movie.overview}
                  data={movie}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
