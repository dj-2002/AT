import "./App.scss";
import HomePage from "./Components/HomePage/HomePage";
import VideoStream from "./Components/VideoStream/VideoStream";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const NoMatch = () => {
      return(<h1>OOPs Guess What You Are On Wrong Side !!</h1>);
  }
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/:id">
            <VideoStream />
          </Route>
          <Route component={NoMatch}>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
