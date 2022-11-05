import { createContext, useReducer } from "react";
import GithubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = "https://api.github.com";

export const GihubProvider = ({ children }) => {
  const initialState = {
    users: [],
    repos: [],
    user: {},
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  const clearUsers = () => {
    dispatch({ type: "CLEAR_USERS" });
  };

  const searchUsers = async (text) => {
    setLoading();

    const params = new URLSearchParams({
      q: text,
    });
    const resp = await fetch(`${GITHUB_URL}/search/users?${params}`);
    const { items } = await resp.json();
    dispatch({
      type: "GET_USERS",
      payload: items,
    });
  };

  const getUser = async (login) => {
    setLoading();

    const resp = await fetch(`${GITHUB_URL}/users/${login}`);

    if (resp.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await resp.json();
      dispatch({
        type: "GET_USER",
        payload: data,
      });
    }
  };

  const getUserRepos = async (login) => {
    setLoading();
    const resp = await fetch(`${GITHUB_URL}/users/${login}/repos`);

    if (resp.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await resp.json();
      dispatch({
        type: "GET_REPOS",
        payload: data,
      });
    }
  };

  const setLoading = () => {
    dispatch({ type: "SET_LOADING" });
  };

  return (
    <GithubContext.Provider
      value={{
        ...state,
        dispatch,
        searchUsers,
        getUser,
        clearUsers,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
