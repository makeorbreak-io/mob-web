import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { times, capitalize, reject, orderBy, isString } from "lodash";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { vote, suffrage, fullUser } from "fragments";
import { waitForData } from "enhancers";

//
// components
import { Tabs, Tab, Panel } from "components/uikit/tabs";
import { Button, buttonPropsFromReduxForm, ErrorMessage } from "components/uikit";
import { Select } from "components/fields";

//
// validation
import { composeValidators, validatePresence } from "validators";

//
// util
import { ordinal } from "lib/number";

//
// constants
import { CREATIVE, FUN, USEFUL, ORDER_CHOICES } from "constants/prizes";

const categories = [ USEFUL, FUN, CREATIVE ];

const validate = (values) => {
  return composeValidators(
    validatePresence(`${USEFUL}-pos-0`, "1st place - Useful"),
    validatePresence(`${FUN}-pos-0`, "1st place - Funny"),
    validatePresence(`${CREATIVE}-pos-0`, "1st place - Creative"),
  )(values);
};

export class VotingBooth extends Component {

  componentDidMount() {
    const { initialize, data: { suffrages, votes } } = this.props;

    const formValues =
    votes
    .flatMap(({ suffrageId, ballot }) => {
      const category = suffrages.find(s => s.id === suffrageId).slug;

      return ballot.map((teamId, index) => ({
        [`${category}-pos-${index}`]: teamId,
      }));
    })
    .reduce((acc, obj) => ({ ...acc, ...obj}), {});

    initialize(formValues);
  }

  submitVotes = (values) => {
    const { data, castVotes } = this.props;

    const votes = {};
    categories.map(category => {
      const suffrageId = data.suffrages.find(s => s.slug === category).id;

      votes[suffrageId] = times(ORDER_CHOICES).reduce((choices, position) => {
        const option = values[`${category}-pos-${position}`];

        if (option) {
          isString(option) ? choices.push(option) : choices.push(option.value);
        }

        return choices;
      }, []);
    });

    return castVotes({ variables: { votes: JSON.stringify(votes) } })
    .then(() => data.refetch());
  }

  filterOptions = ({ category, position, options, formValues }) => {
    const { data: { me } } = this.props;

    if (position === 0) {
      return orderBy(
        reject(options, option => option.value === (me.currentTeam && me.currentTeam.id)),
        [ "label" ],
        [ "asc" ]
      );
    }

    const filtered = reject(options, option => {
      if (me.currentTeam && me.currentTeam.id === option.value) return true;

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
    const { data: { suffrages } , handleSubmit, valid, formValues } = this.props;

    const options = (slug) => (
      suffrages
      .find(s => s.slug === slug)
      .teams
      .map(team => ({
        label: `${team.name}`,
        value: team.id,
      }))
    );

    return (
      <div className="VotingBooth">

        <form onSubmit={handleSubmit(this.submitVotes)}>
          <table className="desktop">
            <thead>
              <tr>
                <td></td>
                <td>Useful</td>
                <td>Funny</td>
                <td>Creative</td>
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
                        options={this.filterOptions({ category, position, options: options(category), formValues })}
                        //disabled={position != 0 && !formValues[`${category}-pos-${position - 1}`]}
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
            <Tab><span>Creative</span></Tab>

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
                          options={this.filterOptions({ category, position, options: options(category), formValues })}
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
            {...buttonPropsFromReduxForm(this.props)}
            type="submit"
            primary
            large
            feedbackSuccessLabel="Voted!"
            feedbackFailureLabel="Voting failed"
            disabled={!valid}
          >
            Cast Votes!
          </Button>

          <ErrorMessage form="voting-booth" field="error" />
        </form>

      </div>
    );
  }

}

export default compose(
  setDisplayName("VotingBooth"),

  reduxForm({
    form: "voting-booth",
    validate,
  }),

  connect(({ form }) => ({
    formValues: (form["voting-booth"] || {}).values || {},
  })),

  graphql(gql`{
    me { id currentTeam { id } role }

    suffrages { ...suffrage }
    votes { ...vote }
  } ${vote} ${suffrage}`),

  waitForData,

  graphql(
    gql`mutation castVotes($votes: String!) {
      castVotes(votes: $votes) { ...fullUser }
    } ${fullUser}`,
    { name: "castVotes" },
  )
)(VotingBooth);
