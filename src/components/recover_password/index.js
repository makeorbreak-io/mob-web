import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";

//
// components
import {
  Button,
  buttonPropsFromReduxForm,
  ErrorMessage,
} from "uikit";
import { Tabs, Tab, Panel } from "uikit/tabs";

//
// api
import { getPasswordRecoveryToken } from "api/users";

//
// validation
import { composeValidators, validateEmail } from "validators";

const validate = (values) => {
  return composeValidators(
    validateEmail("email", "Email"),
  )(values);
};

export class RecoverPassword extends Component {

  onSubmit = (values) => {
    return getPasswordRecoveryToken(values.email.trim().toLowerCase());
  }

  render() {
    const { handleSubmit, submitSucceeded, formValues } = this.props;

    return (
      <div className="content white">
        <div className="RecoverPassword narrow-container">
          <Tabs>
            <Tab><span>Recover Password</span></Tab>
            <Panel>
              {!submitSucceeded &&
                <form onSubmit={handleSubmit(this.onSubmit)}>
                  <Field name="email" type="text" component="input" placeholder="Email address" className="fullwidth" />
                  <ErrorMessage form="recover-password" field="email" />

                  <div className="actions">
                    <Button
                      {...buttonPropsFromReduxForm(this.props)}
                      form
                      centered
                      primary
                      type="submit"
                    >
                      Recover password
                    </Button>
                  </div>
                </form>
              }

              {submitSucceeded &&
                <div>
                  A recovery email was sent to {formValues.email}. Please check your inbox for further instructions.
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
  setDisplayName("RecoverPassword"),

  reduxForm({
    form: "recover-password",
    validate,
  }),

  connect(({ form }) => ({
    formValues: form["recover-password"].values || {},
  })),
)(RecoverPassword);
