import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import MovieCard, { isFavMovie } from "./components/MovieCard";
import InfiniteScrollComponent from "./components/InfiniteScrollComponent";
import useDebounce from "./hooks/useDebounce";
import Backdrop from "./Backdrop";
import SelectComponent from "./components/SelectComponent";
import Tabs from "./components/Tabs";
import { customLocalStorage } from "./utility/customLocalStorage";
import SeachIcon from "react-useanimations/lib/searchToX";
import UseAnimations from "react-useanimations";
import "./App.css";

const options = ["ALL", "FAVOURITES"];
const sortOptions = [
  { label: "Popularity (asc)", value: "popularity.asc" },
  { label: "Popularity (desc)", value: "popularity.desc" },
  { label: "Release Date (asc)", value: "primary_release_date.asc" },
  { label: "Release Date (desc)", value: "primary_release_date.desc" },
  { label: "Most Voted (asc)", value: "vote_average.asc" },
  { label: "Most Voted (desc)", value: "vote_average.desc" },
];

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
  label: string;
  value: string;
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
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const getAllMovies = async (
    page: number = 1,
    id: number | null = null,
    sort_by: string = ""
  ) => {
    const params: any = {};
    params["api_key"] = import.meta.env.VITE_API_KEY;
    params["page"] = page;
    if (id) {
      params["with_genres"] = id;
    }
    if (sort_by.trim()) {
      params["sort_by"] = sort_by;
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
    const modifiedData = result.data.genres.map((data: any) => {
      return { label: data.name, value: String(data.id) };
    });
    setCategories(modifiedData);
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

  const handleClick = (data: MOVIE_TYPE) => {
    const movies: MOVIE_TYPE[] | null = customLocalStorage.getData("favMovies");
    if (!movies) {
      customLocalStorage.setData("favMovies", [data]);
      return;
    }
    if (isFavMovie(data.id)) {
      const filteredData = movies?.filter((movie) => movie.id !== data.id);
      customLocalStorage.setData("favMovies", filteredData);
    } else {
      customLocalStorage.setData("favMovies", [...movies, data]);
    }
    if (activeTab === "FAVOURITES") {
      setMovies((prevState) =>
        prevState.filter((movie) => movie.id !== data.id)
      );
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div id="app">
      <Backdrop isLoading={loading} />
      <div className="header-section">
        <div
          className="search-input-container"
          style={{ width: isFocused ? "95%" : "85%" }}
        >
          <input
            placeholder="search movie..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={activeTab === "FAVOURITES"}
          />
          <UseAnimations animation={SeachIcon} strokeColor="#FFF" />
        </div>
        <div>
          <SelectComponent
            options={categories}
            selectedOption={selectedCategory}
            placeholder="Select a Category"
            onChange={(value) => {
              getAllMovies(1, Number(value));
              setSelectedCategory(Number(value));
            }}
            isDisabled={activeTab === "FAVOURITES"}
          />
        </div>
        <div className="sorting-container">
          <h3 className="sorting-title">Sort by: </h3>
          <SelectComponent
            options={sortOptions}
            selectedOption={selectedSortOption}
            placeholder="Select a Option"
            onChange={(value) => {
              getAllMovies(1, Number(selectedCategory), value);
              setSelectedSortOption(value);
            }}
            isDisabled={activeTab === "FAVOURITES"}
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
        {!movies.length ? (
          <div className="no-data-found">No Data Found!</div>
        ) : activeTab === "ALL" ? (
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
                  handleClick={handleClick}
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
                  handleClick={handleClick}
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
