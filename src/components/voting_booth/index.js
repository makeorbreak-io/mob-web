import "./styles";
import "./styles.responsive";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { map, times, capitalize, reject, orderBy, reduce, isString } from "lodash";

//
// components
import { Tabs, Tab, Panel } from "uikit/tabs";
import { Button } from "uikit";
import { Select } from "components/fields";

//
// validation
import { composeValidators, validatePresence } from "validators";

//
// redux
import { fetchTeams } from "actions/teams";
import { getVotes, vote } from "actions/current_user";

//
// util
import { ordinal } from "util/number";

//
// constants
import { HARDCORE, FUNNY, USEFUL, ORDER_CHOICES } from "constants/prizes";

const categories = [ USEFUL, FUNNY, HARDCORE ];

const validate = (values) => {
  return composeValidators(
    validatePresence("useful-pos-0", "1st place - Useful"),
    validatePresence("funny-pos-0", "1st place - Funny"),
    validatePresence("hardcore-pos-0", "1st place - Hardcore"),
  )(values);
};

export class VotingBooth extends Component {

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentDidMount() {
    const { dispatch, initialize } = this.props;

    dispatch(fetchTeams());
    dispatch(getVotes()).then(({ hardcore, funny, useful }) => {

      const formValues = {};
      map(hardcore, (teamId, index) => formValues[`hardcore-pos-${index}`] = teamId);
      map(funny, (teamId, index) => formValues[`funny-pos-${index}`] = teamId);
      map(useful, (teamId, index) => formValues[`useful-pos-${index}`] = teamId);

      initialize(formValues); // TODO
    });
  }

  //----------------------------------------------------------------------------
  // Event Handlers
  //----------------------------------------------------------------------------
  submitVotes = (values) => {
    const votes = {};
    categories.map(category => {
      votes[category] = reduce(times(ORDER_CHOICES), (choices, position) => {
        const option = values[`${category}-pos-${position}`];

        if (option) {
          isString(option) ? choices.push(option) : choices.push(option.value);
        }

        return choices;
      }, []);
    });

    this.props.dispatch(vote(votes));
  }

  //----------------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------------
  filterOptions = ({ category, position, options, formValues }) => {
    const { currentUser } = this.props;

    if (position === 0) {
      return orderBy(
        reject(options, option => option.value === currentUser.team.id),
        [ "label" ],
        [ "asc" ]
      );
    }

    const filtered = reject(options, option => {
      if (currentUser.team.id === option.value) return true;

      let shouldReject = false;

      times(position + 1, pos => {
        if ((formValues[`${category}-pos-${pos - 1}`] || {}).value === option.value) {
          shouldReject = true;
        }
      });

      return shouldReject;
    });

    return orderBy(filtered, [ "label" ], [ "asc" ]);
  }

  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { teams, handleSubmit, submitting, valid, formValues } = this.props;
    const options = map(teams, team => ({
      label: `${team.name}`,
      value: team.id,
    }));

    return (
      <div className="VotingBooth">

        <form onSubmit={handleSubmit(this.submitVotes)}>
          <table className="desktop">
            <thead>
              <tr>
                <td></td>
                <td>Useful</td>
                <td>Funny</td>
                <td>Hardcore</td>
              </tr>
            </thead>
            <tbody>
              {times(ORDER_CHOICES, position => (
                <tr key={position}>
                  <td className="position">{ordinal(position + 1)}</td>
                  {categories.map(category => (
                    <td key={category} className="select">
                      <Field
                        component={Select}
                        placeholder={`${ordinal(position + 1)} place - ${capitalize(category)}`}
                        name={`${category}-pos-${position}`}
                        options={this.filterOptions({ category, position, options, formValues })}
                        disabled={position != 0 && !formValues[`${category}-pos-${position - 1}`]}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <Tabs className="mobile">
            <Tab><span>Useful</span></Tab>
            <Tab><span>Funny</span></Tab>
            <Tab><span>Hardcore</span></Tab>


            {categories.map(category => (
              <Panel key={category}>
                <ol>
                  {times(ORDER_CHOICES, position => (
                    <li key={position}>
                      <div className="position">{ordinal(position + 1)}</div>
                      <div className="select">
                        <Field
                          component={Select}
                          placeholder={`${ordinal(position + 1)} place - ${capitalize(category)}`}
                          name={`${category}-pos-${position}`}
                          options={this.filterOptions({ category, position, options, formValues })}
                          disabled={position != 0 && !formValues[`${category}-pos-${position - 1}`]}
                        />
                      </div>
                    </li>
                  ))}
                </ol>
              </Panel>
            ))}
          </Tabs>

          <Button
            type="submit"
            primary
            large
            loading={submitting}
            disabled={!valid}
          >
            Cast Votes!
          </Button>
        </form>

      </div>
    );
  }

}

export default compose(
  setDisplayName("VotingBooth"),

  connect(({ teams, form, currentUser }) => ({
    teams: reject(teams, team => !team.eligible || !team.applied),
    currentUser,
    formValues: (form["voting-booth"] || {}).values || {},
  })),

  reduxForm({
    form: "voting-booth",
    validate,
  }),
)(VotingBooth);
