import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import login from "../src/components/auth/login";
import register from "../src/components/auth/register";

class App extends Component {
  render() {
    return(
      <Router>
        <div>
          <Navbar/>
          <Route exact path="/" component={Landing} />
          <div>
            <Route exact path="/register" component={register}/>
            <Route exact path="/login" component={login}/>
          </div>
          <Footer/>
        </div>
      </Router>
    );
  }
}

export default App;
