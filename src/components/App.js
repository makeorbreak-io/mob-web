import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, getContext } from "recompose";
import classnames from "classnames";

//
// Components
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { Toaster } from "components/uikit";

// Constants
// import { PAGE_TRANSITION_MS } from "constants/globals";

export class App extends Component {
  state = {
    routeChanging: false,
    lastPathname: window.location.pathname,
  }

  componentDidMount() {
    // this.props.router.listen((location) => {
    //   const { lastPathname } = this.state;
    //   if (lastPathname !== location.pathname) {
    //     this.setState({ routeChanging: true });
    //     setTimeout(() => this.setState({ routeChanging: false }), PAGE_TRANSITION_MS);
    //   }
    //   this.setState({ lastPathname: location.pathname });
    // });
  }

  render() {
    const { children, location: { pathname } } = this.props;
    const { routeChanging } = this.state;

    const contentCx = classnames("AppContent", {
      "fade-out": routeChanging,
    });

    return (
      <div className="App">
        <Navbar landing={pathname === "/"} fly={pathname === "/fly"} />

        <div className={contentCx}>
          {children}
        </div>

        <Toaster />

        <Footer />
      </div>
    );
  }
}

export default compose(
  getContext({
    router: PropTypes.object.isRequired,
  }),
)(App);
