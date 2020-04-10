import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
// import {, reduxForm } from "redux-form";
// import { omit } from "lodash";
// import classnames from "classnames";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

//
// Enhancers
import { withCurrentUser, waitForData } from "enhancers";

import { fullUser } from "fragments";

//
// Components
// import {
//   Button,
//   buttonPropsFromReduxForm,
//   ErrorMessage,
// } from "components/uikit";

import {
  Heading,
  Link,
  Field,
  Form,
  Section,
} from "components/2020/uikit";

//
// Constants
import { TSHIRT_SIZES } from "constants/user";

//
// Util
import { handleGraphQLErrors } from "lib/graphql";

//
// Validation
import {
  composeValidators,
  validatePresence,
  validateEmail,
} from "validators";

const validate = composeValidators(
  validatePresence("name", "Name"),
  validateEmail("email", "Email"),
  validatePresence("tshirtSize", "T-Shirt size"),
);

export class AccountSettings extends Component {

  state = {
    editing: false,
  }

  handleToggle = () => {
    const { editing } = this.state;

    if (editing) {
      this.submitButton.click();
    }
    else {
      this.setState({ editing: true });
    }

  }

  onSubmit = (user) => {
    return this.props.updateMe({
      variables: { user },
    })
    .then(() => this.setState({ editing: false }))
    .catch(handleGraphQLErrors);
  }

  get initialValues() {
    const { name, email, tshirtSize, githubHandle } = this.props.data.me;

    return {
      name,
      email,
      tshirtSize,
      githubHandle,
    };
  }

  render() {
    // const { data: { me } } = this.props;
    // const { editing } = this.state;

    // const formCx = classnames({ editing });

    return (
      <Section center>
        <Heading size="xl" color="green" centered>Your Account</Heading>

        <Form
          onSubmit={this.onSubmit}
          initialValues={this.initialValues}
          validate={validate}
        >
          <Field
            label="Name"
            name="name"
            placeholder="Name"
            type="text"
          />

          <Field
            label="Email"
            name="email"
            placeholder="Email"
            type="email"
          />

          <Field
            label="T-Shirt size"
            name="tshirtSize"
            component="select"
          >
            {TSHIRT_SIZES.map(size =>
              <option key={size} value={size}>{size}</option>
            )}
          </Field>

          <Field
            label="GitHub username"
            name="githubHandle"
            placeholder="GitHub username"
            type="text"
          />
        </Form>

        <Link to="/dashboard">Back to dashboard</Link>

      </Section>
    );

    // return (
    //   <div className="AccountSettings">
    //     <h2>
    //       <span>You</span>

    //       {editing &&
    //         <Button
    //           small
    //           onClick={() => this.setState({ editing: false })}
    //         >
    //           Cancel
    //         </Button>
    //       }

    //       <Button
    //         {...buttonPropsFromReduxForm(this.props)}
    //         primary
    //         small
    //         feedbackSuccessLabel="Updated!"
    //         feedbackFailureLabel="Error updating"
    //         onClick={this.handleToggle}
    //       >
    //         {editing ? "Update" : "Edit"}
    //       </Button>
    //     </h2>

    //     {editing &&
    //       <form onSubmit={handleSubmit(this.onSubmit)} className={formCx}>
    //         {/* Personal Info */}
    //         <div className="form-row">
    //           <label htmlFor="name">Name</label>
    //           <Field id="name" name="name" component="input" type="text" placeholder="Name" className="fullwidth" disabled={!editing}/>
    //           <ErrorMessage form="account-settings" field="name" />
    //         </div>

    //         <div className="form-row">
    //           <label htmlFor="email">Email</label>
    //           <Field id="email" name="email" component="input" type="text" placeholder="Email" className="fullwidth" disabled={!editing} />
    //           <ErrorMessage form="account-settings" field="email" />
    //         </div>

    //         <div className="form-row">
    //           <label htmlFor="tshirtSize">T-Shirt Size</label>
    //           <Field id="tshirtSize" name="tshirtSize" component="select" className="fullwidth" disabled={!editing}>
    //             <option value="" disabled>Choose your t-shirt size</option>
    //             {TSHIRT_SIZES.map(size =>
    //               <option key={size} value={size}>{size}</option>
    //             )}
    //           </Field>
    //           <ErrorMessage form="account-settings" field="tshirtSize" />
    //         </div>

    //         {/* Social Media */}
    //         <div className="form-row">
    //           <label htmlFor="githubHandle">GitHub</label>
    //           <Field id="githubHandle" name="githubHandle" component="input" type="text" placeholder="Github handle" className="fullwidth icon github" disabled={!editing} />
    //           <ErrorMessage form="account-settings" field="githubHandle" />
    //         </div>

    //         {editing &&
    //           <Button
    //             {...buttonPropsFromReduxForm(this.props)}
    //             type="submit"
    //             primary
    //             form
    //             centered
    //             fullwidth
    //             buttonRef={ref => this.submitButton = ref}
    //           >
    //             Update
    //           </Button>
    //         }
    //       </form>
    //     }

    //     {!editing &&
    //       <div>
    //         <label>Name</label>
    //         <p>{me.name}</p>

    //         <label>Email</label>
    //         <p>{me.email}</p>

    //         {me.tshirtSize &&
    //           <Fragment>
    //             <label>T-shirt size</label>
    //             <p>{me.tshirtSize}</p>
    //           </Fragment>
    //         }

    //         {me.githubHandle &&
    //           <Fragment>
    //             <label>GitHub</label>
    //             <p className="github">{me.githubHandle}</p>
    //           </Fragment>
    //         }
    //       </div>
    //     }

    //   </div>
    // );
  }

}

export default compose(
  setDisplayName("AccountSettings"),

  withCurrentUser,

  waitForData,

  // mapProps(props => ({
  //   ...props,
  //   initialValues: omit(
  //     props.data.me,
  //     "__typename",
  //     "id",
  //     "invitations",
  //     "teams",
  //     "displayName",
  //     "gravatarHash",
  //     "currentAttendance",
  //     "currentBot",
  //     "currentTeam",
  //     "workshops",
  //     "favorites",
  //   ),
  // })),

  graphql(
    gql`mutation updateMe($user: UserInput!) {
      updateMe(user: $user) { ...fullUser }
    } ${fullUser}`,
    { name: "updateMe" },
  ),
)(AccountSettings);
