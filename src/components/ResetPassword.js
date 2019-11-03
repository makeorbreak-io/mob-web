import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { reduxForm, Field } from "redux-form";
import { Link } from "react-router-dom";

//
// components
import {
  Button,
  buttonPropsFromReduxForm,
  ErrorMessage,
} from "components/uikit";
import { Tabs, Tab, Panel } from "components/uikit/tabs";

//
// api
import { recoverPassword } from "api/users";

//
// validation
import { composeValidators, validatePresence } from "validators";

const validate = (values) => {
  return composeValidators(
    validatePresence("password", "New password"),
  )(values);
};

export class ResetPassword extends Component {

  componentWillMount() {
    this.props.initialize({
      token: this.props.routeParams.token,
    });
  }

  onSubmit = ({ token, password }) => {
    return recoverPassword(token, password);
  }

  render() {
    const { handleSubmit, submitSucceeded } = this.props;

    return (
      <div className="content white">
        <div className="ResetPassword narrow-container">
          <Tabs>
            <Tab><span>Reset Password</span></Tab>
            <Panel>
              {!submitSucceeded &&
                <form onSubmit={handleSubmit(this.onSubmit)}>
                  <Field name="token" type="hidden" component="input" />
                  <Field name="password" type="password" component="input" placeholder="New password" className="fullwidth" />
                  <ErrorMessage form="reset-password" field="password" />
                  <ErrorMessage form="reset-password" field="token" />

                  <div className="actions">
                    <Button
                      {...buttonPropsFromReduxForm}
                      form
                      centered
                      primary
                      type="submit"
                      feedbackLabel="Password recovered!"
                    >
                      Reset password
                    </Button>
                  </div>
                </form>
              }

              {submitSucceeded &&
                <div>
                  Your password was successfuly reset! You can now <Link to="/signin">sign in</Link> using your newly set password.
                </div>
              }
            </Panel>
          </Tabs>
        </div>
      </div>
    );
  }

}

export default compose(
  setDisplayName("ResetPassword"),

  reduxForm({
    form: "reset-password",
    validate,
  }),
)(ResetPassword);
