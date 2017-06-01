import "./styles";

import React from "react";
import { Link } from "react-router";
import { compose, setDisplayName, withState } from "recompose";
import { connect } from "react-redux";
import classnames from "classnames";

//
// Components
import Button from "uikit/button";
import Login from "components/login";
import Signup from "components/signup";

//
// Redux
import { logout } from "actions/authentication";

export const AccountMenu = ({
  isOpen,
  currentUser,
  signup,
  setSignup,
  dispatch,
}) => {
  const cx = classnames("AccountMenu", {
    visible: isOpen,
  });

  return (
    <div className={cx}>
      <div className="content">
        {!currentUser &&
          <div>
            {signup ? <h3>Register</h3> : <h3>Login</h3>}
            {signup ? <Signup /> : <Login />}

            <Button
              fakelink
              fullwidth
              small
              onClick={() => setSignup(!signup)}
            >
              {signup
                ? "Already have an account? Login!"
                : "Don't have an account yet? Signup!"
              }
            </Button>
          </div>
        }

        {currentUser &&
          <div>
            <Link to="/account/settings">Account Settings</Link>
            <Link to="/account/team">Team</Link>
            <Button fakelink fullwidth small onClick={() => dispatch(logout())}>
              Logout
            </Button>
          </div>
        }
      </div>
    </div>
  );
};

export default compose(
  setDisplayName("AccountMenu"),

  connect(({ currentUser }) => ({ currentUser })),

  withState("signup", "setSignup", false),
)(AccountMenu);
