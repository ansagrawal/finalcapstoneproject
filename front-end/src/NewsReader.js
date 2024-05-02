import { LoginForm } from './LoginForm';
import { SavedQueries } from './SavedQueries';
import { QueryForm } from './QueryForm';
import { Articles } from './Articles';
import { useState, useEffect } from 'react';
import { exampleQuery, exampleData } from './data';

export function NewsReader() {
  const [query, setQuery] = useState(exampleQuery); // latest query send to newsapi
  const [data, setData] = useState(exampleData);   // current data returned from newsapi
  const [currentUser, setCurrentUser] = useState(null);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [queryFormObject, setQueryFormObject] = useState({ ...exampleQuery });
  const urlNews = "/news";
  const urlQueries = "/queries";
  const urlUsersAuth = "/users/authenticate";
  const [savedQueries, setSavedQueries] = useState([{ ...exampleQuery }]);
  const [showQueryDetails, setShowQueryDetails] = useState(true);

  useEffect(() => {
    getNews(query);
  }, [query]);

  useEffect(() => { getQueryList(); }, []);

  async function getQueryList() {
    try {
      const response = await fetch(urlQueries);
      if (response.ok) {
        const data = await response.json();
        setSavedQueries(data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }

  function createAuthHeader() {
    const storedToken = localStorage.getItem(currentUser.username);
    const authHeader = storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {};
    return authHeader;
  }

  async function login() {
    if (currentUser !== null) {
      // logout
      localStorage.removeItem(currentUser.username);
      setCurrentUser(null);
    } else {
      // login
      try {
        let authHeader;
        if (currentUser !== null) {
          authHeader = createAuthHeader();
        }
        const response = await fetch(urlUsersAuth, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeader },
          body: JSON.stringify(credentials),
        })
        if (response.status === 200) {
          const data = await response.json();
          const token = data.token.token;
          localStorage.setItem(credentials.username, token);
          setCurrentUser({ ...credentials });
          setCredentials({ username: "", password: "" });
        } else {
          setCurrentUser(null);
          const data = await response.json();
          alert('Error! ' + data.message);
        }
      } catch (error) {
        console.error('Error authenticating user: ', error);
        setCurrentUser(null);
        alert('Login failed!');
      }
    }
  }

  async function saveQueryList(savedQueries) {
    try {
      let authHeader;
      if (currentUser !== null) {
        authHeader = createAuthHeader();
      }
      const response = await fetch(urlQueries, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify(savedQueries),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }

  function onSavedQuerySelect(selectedQuery) {
    setQueryFormObject(selectedQuery);
    setQuery(selectedQuery);
  }


  function onFormSubmit(queryObject) {
    if (currentUser === null) {
      alert("Log in if you want to create new queries!")
      return;
    }
    if (savedQueries.length >= 3 && !localStorage.getItem(currentUser.username)) {
      alert("guest users cannot submit new queries once saved query count is 3 or greater!")
      return;
    }
    let newSavedQueries = [];
    newSavedQueries.push(queryObject);
    for (let query of savedQueries) {
      if (query.queryName !== queryObject.queryName) {
        newSavedQueries.push(query);
      }
    }
    saveQueryList(newSavedQueries);
    setSavedQueries(newSavedQueries);
    setQuery(queryObject);
  }

  async function getNews(queryObject) {
    if (queryObject.q) {
      try {
        let authHeader;
        if (currentUser !== null) {
          authHeader = createAuthHeader();
        }
        const response = await fetch(urlNews, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeader },
          body: JSON.stringify(queryObject),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    } else {
      setData({});
    }
  }

  function formatQueryDetails(query) {
    return (
      <div className="query-details">
        <h2>Query Details</h2>
        <ul>
          <li><strong>Query Name:</strong> {query.queryName}</li>
          <li><strong>Category:</strong> {query.q}</li>
          <li><strong>Language:</strong> {query.language}</li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <LoginForm login={login}
        credentials={credentials}
        currentUser={currentUser}
        setCredentials={setCredentials} />
      <div >
        <section className="parent" >
          <div className="box">
            <span className='title'>Query Form</span>
            <QueryForm
              currentUser={currentUser}
              setFormObject={setQueryFormObject}
              formObject={queryFormObject}
              submitToParent={onFormSubmit} />
          </div>
          <div className="box">
            <span className='title'>Saved Queries</span>
            <SavedQueries savedQueries={savedQueries}
              selectedQueryName={query.queryName}
              onQuerySelect={onSavedQuerySelect}
              setSavedQueries={setSavedQueries}
              currentUser={currentUser}
              saveQueryList={saveQueryList}
            />
          </div>
          <div className="box">
            {showQueryDetails && formatQueryDetails(query)}
            <span className='title'>Articles List</span>
            <Articles query={query} data={data} />
            <button onClick={() => setShowQueryDetails(!showQueryDetails)}>
              {showQueryDetails ? "Hide Query Details" : "Show Query Details"}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}