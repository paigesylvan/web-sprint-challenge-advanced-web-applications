import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";
import axiosWithAuth from "../axios/index";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState(); //edit and delete
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate("/");
  };

  const redirectToArticles = () => {
    /* ✨ implement */
    // [x] When would I need to redirect to articles? The only other landing pages is login, right?
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement

    // [x] If a token is in local storage it should be removed,
    localStorage.removeItem("token");
    // [x] and a message saying "Goodbye!" should be set in its proper state.
    setMessage("Goodbye!");
    // [x] In any case, we should redirect the browser back to the login screen, using the helper above.
    redirectToLogin();
  };

  const login = (username, password) => {
    // * args started as {(username, password)}, may need to change it back later
    // [x]  We should flush the message state,
    setMessage("");
    // [x]  turn on the spinner
    setSpinnerOn(true);
    // [x]  and launch a request to the proper endpoint.
    axios
      .post(loginUrl, { username, password })
      .then((res) => {
        // [x]  On success, we should set the token to local storage in a 'token' key,
        localStorage.setItem("token", res.data.token);
        // [x]  put the server success message in its proper state,
        setMessage(res.data.message);
        // [x]  and redirect to the Articles screen. Don't forget to turn off the spinner!
        redirectToArticles();
        // [x] get articles (but maybe do this as a useEffect somewhere else?)
      })

      .catch((err) => {
        setMessage(err.response.data.message);
        console.log(err);
      })
      .finally(() => setSpinnerOn(false));
  };

  const getArticles = () => {
    // [x] We should flush the message state, turn on the spinner
    setMessage("");
    setSpinnerOn(true);
    // [x] and launch an authenticated request to the proper endpoint.
    axiosWithAuth()
      .get(articlesUrl)
      .then((res) => {
        // [x] On success, we should set the articles in their proper state and
        setArticles(res.data.articles);
        // [x] put the server success message in its proper state.
        setMessage(res.data.message);
        // [x] Don't forget to turn off the spinner!
      })
      .catch((err) => {
        // [x] If something goes wrong, check the status of the response:
        // [x] if it's a 401 the token might have gone bad, and we should redirect to login.
        err.response.status === 401 ? redirectToLogin() : console.log(err);
        setMessage(err.response.data.message);
        console.log(err);
      })
      .finally(() => setSpinnerOn(false));
  };

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints to inspect the response from the server.
    // [x] axios.post(url, article/article_id)
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .post(articlesUrl, article)
      .then((res) => {
        setArticles([...articles, res.data.article]);
        setMessage(res.data.message);
        // [x] setArticles accordingly
      })
      .catch((err) => {
        setMessage(err.response.data.message);
        console.log(err);
      })
      .finally(() => setSpinnerOn(false));
  };

  const updateArticle = (article_id, article) => {
    const { title, text, topic } = article;
    setCurrentArticleId(article_id);
    setMessage("");
    setSpinnerOn(true);
    // [x] axios.put(url, article/article_id)
    axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, { title, text, topic })
      .then((res) => {
        // [ ] setArticles accordingly
        // [x] might need to make sure we're loading articles on mount?
        const newArticles = articles.map((article) => {
          if (article.article_id === article_id) {
            return res.data.article;
          }
          return article;
        });
        setArticles(newArticles);
        setMessage(res.data.message);
      })

      .catch((err) => {
        setMessage(err.response.data.message);
        console.log(err.response.data.message);
      })
      .finally(() => setSpinnerOn(false));
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    // [ ] axios.delete()
    // [ ] setArticles accordingly
    //   ? setArticles(articles.filter((article) => article.article_id !== article_id))
    console.log("id inside App.js", article_id);
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .delete(`${articlesUrl}/${article_id}`)
      .then((res) => {
        setArticles(
          articles.filter((article) => article.article_id !== article_id)
        );
        setMessage(res.data.message);
        console.log(res);
      })
      .catch((err) => {
        setMessage(err.response.data.message);
        console.log(err);
      })
      .finally(() => setSpinnerOn(false));
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <LoginForm
                login={login}
                redirectToArticles={redirectToArticles}
              />
            }
          />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  currentArticleId={currentArticleId}
                  setCurrentArticleId={setCurrentArticleId}
                  postArticle={postArticle}
                  articles={articles}
                  updateArticle={updateArticle}
                />
                <Articles
                  getArticles={getArticles}
                  articles={articles}
                  setCurrentArticleId={setCurrentArticleId}
                  deleteArticle={deleteArticle}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}