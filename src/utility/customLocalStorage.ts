import { MOVIE_TYPE } from "../App";

type CustomLocalStorageType = {
  getData: (name: string) => MOVIE_TYPE[] | null;
  setData: (name: string, value: MOVIE_TYPE[]) => void;
  deleteData: (name: string) => void;
  deleteAllData: () => void;
};

export const customLocalStorage: CustomLocalStorageType = {
  getData: (name: string) => {
    if (!name.trim()) return null;
    const val = localStorage.getItem(name);
    return val !== null ? JSON.parse(val) : val;
  },
  setData: (name: string, value: MOVIE_TYPE[]) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  deleteData: (name: string) => {
    localStorage.removeItem(name);
  },
  deleteAllData: () => {
    localStorage.clear();
  },
};
