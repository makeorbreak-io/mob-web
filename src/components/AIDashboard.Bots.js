import React, { Component, Fragment } from "react";
import { compose, setDisplayName, lifecycle } from "recompose";
import { every } from "lodash";
import { Field, reduxForm } from "redux-form";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { parse, distanceInWordsToNow } from "date-fns";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";

import { waitForData } from "enhancers";

import { aiCompetitionBot } from "fragments";

import { handleGraphQLErrors } from "lib/graphql";

import {
  Button,
  ErrorMessage,
  Modal,
} from "components/uikit";

// import fileIcon from "assets/images/icons/file.svg";
import terminalIcon from "assets/images/icons/terminal.svg";

import { composeValidators, validatePresence } from "validators";

const validate = composeValidators(
  validatePresence("title", "Filename"),
  validatePresence("sdk", "SDK"),
  validatePresence("sourceCode", "Source code"),
);

const codeSDKs = [
  { label: "Ruby 2.5.0"           , shortLabel: "Ruby"   , value: "ruby"   , img: require("assets/images/icons/ruby.svg") },
  { label: "Python 3.6.4"         , shortLabel: "Python" , value: "python" , img: require("assets/images/icons/python.svg") },
  { label: "NodeJS 9.5.0"         , shortLabel: "NodeJS" , value: "nodejs" , img: require("assets/images/icons/nodejs.svg") },
  { label: "Bash script"          , shortLabel: "Bash"   , value: "bash"   , img: require("assets/images/icons/bash.svg") },
  { label: "Java (openjdk 8u151)" , shortLabel: "Java"   , value: "java"   , img: require("assets/images/icons/java.svg") },
  { label: "C# (.NET 2)"          , shortLabel: "C#"     , value: "csharp" , img: require("assets/images/icons/java.svg") },
];

const botExamples = [
  { label: "Ruby"   , url: "https://github.com/makeorbreak-io/mob-ai-ruby/blob/master/bot.rb" },
  { label: "Python" , url: "https://github.com/makeorbreak-io/mob-ai-python/blob/master/bot.py" },
  { label: "NodeJS" , url: "https://github.com/makeorbreak-io/mob-ai-nodejs/blob/master/bot.js" },
  { label: "Bash"   , url: "https://github.com/makeorbreak-io/mob-ai-bash/blob/master/bot.sh" },
  { label: "Java"   , url: "https://github.com/makeorbreak-io/mob-ai-java/blob/master/Bot.java" },
  { label: "C#"     , url: "https://github.com/makeorbreak-io/mob-ai-csharp/blob/master/Bot.cs" },
];

const guessSDK = (file) => {
  const extension = file.name.match(/\.([\w\d]+$)/)[1];

  switch (extension) {
    case "rb":
      return "ruby";
    case "js":
    case "es":
      return "nodejs";
    case "sh":
      return "bash";
    case "py":
      return "python";
    case "java":
      return "java";
    case "cs":
      return "csharp";
    case "cpp":
      return "cpp";
    default:
      return null;
  }
};

const BotDetailsModal = compose(
  graphql(
    gql` query bot($id: String!) {
      me {
        id
        bot: aiCompetitionBot(id: $id) {
          id
          title
          revision
          compilationOutput
          sourceCode
        }
      }
    }`,
    {
      skip: props => !props.id,
      options: props => ({
        variables: { id: props.id },
      }),
    },
  ),

  waitForData,
)(({ isOpen, onRequestClose, data: { me: { bot } } }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    title={`${bot.title} (rev. ${bot.revision})`}
    className="BotDetailsModal"
  >
    <h4>Compilation Output</h4>
    <code><pre>{bot.compilationOutput}</pre></code>

    <h4>Source Code</h4>
    <code><pre>{bot.sourceCode}</pre></code>
  </Modal>
));

export class AIDashboardBots extends Component {

  state = {
    onlyCurrent: false,
    onlyLastRevision: true,
    codeRows: 5,
    botDetailsId: null,
    botDetailsOpen: false,
  }

  importCode = (ev) => {
    const { change } = this.props;
    const file = ev.target.files[0];

    if (!file) return;
    if (!/text/.test(file.type)) return;

    const fr = new FileReader();
    fr.onload = (ev) => {
      change("sourceCode", ev.target.result);
      change("title", file.name);
      change("sdk", guessSDK(file));

      this.setState({ codeRows: ev.target.result.split("\n").length });
    };
    fr.readAsText(file);
  }

  onSubmit = (bot) => {
    const { createAiCompetitionBot, reset } = this.props;

    return createAiCompetitionBot({
      variables: { bot },
    })
    .then(() => {
      reset();
      document.querySelector("#code-reader").value = "";
      this.setState({ codeRows: 5 });
      ReactTooltip.rebuild();
    })
    .catch(handleGraphQLErrors);
  }

  toggleOnlyCurrent = (ev) => this.setState({ onlyCurrent: ev.target.checked });
  toggleOnlyLastRevision = (ev) => this.setState({ onlyLastRevision: ev.target.checked });

  filterOldRevisions = (bot, index, arr) => {
    return arr.filter(s => s.title === bot.title).length === bot.revision;
  };

  closeBotDetails = () => this.setState({ botDetailsId: null, botDetailsOpen: false });
  openBotDetails = (botDetailsId) => () => this.setState({ botDetailsId, botDetailsOpen: true });

  render() {
    const { handleSubmit, data: { me } } = this.props;
    const { onlyCurrent, onlyLastRevision, codeRows, botDetailsId, botDetailsOpen } = this.state;

    let activeBot = me.bots.length === 0
      ? []
      : me
        .bots
        .filter(s => s.status === "processed")
        .sort((a,b) => b.revision === a.revision ? 0 : b.revision < a.revision ? 1 : -1)
        .sort((a,b) => b.insertedAt === a.insertedAt ? 0 : b.insertedAt > a.insertedAt ? 1 : -1);

    activeBot = activeBot[0] || {};

    return (
      <div className="AIDashboardBots">
        <ReactTooltip
          effect="solid"
          className="tooltip"
          html
        />

        <BotDetailsModal
          id={botDetailsId}
          isOpen={botDetailsOpen}
          onRequestClose={this.closeBotDetails}
        />

        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className="title">
            <Field component="input" name="title" type="text" placeholder="Filename" />

            <Field component="select" name="sdk">
              <option value="" disabled>Choose SDK</option>
              {codeSDKs.map(({ label, value, disabled }) => (
                <option key={value} value={value} disabled={disabled}>{label}</option>
              ))}
            </Field>
          </div>
          <div className="code">
            <Field
              component="textarea"
              id="sourceCode"
              name="sourceCode"
              rows={codeRows}
              placeholder="Paste your bot's code here"
              onChange={ev => {
                let codeRows = ev.target.value.split("\n").length;
                codeRows = codeRows < 5 ? 5 : codeRows;

                this.setState({ codeRows });
              }}
            />
            <label htmlFor="code-reader">Import file</label>
            <input type="file" id="code-reader" name="code-reader" onChange={this.importCode} />

            <Button primary type="submit">
              Submit Bot
            </Button>
          </div>

          <div className="code-examples">
            <label>
              Examples:
            </label>
            {botExamples.map(({ label, url }) => (
              <label key={label}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              </label>
            ))}
          </div>

          <div className="submission-notes">
            <h5>Important notes:</h5>

            <ul>
              <li className="bold">By submitting this code, you agree to its release under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">MIT license</a>. All submissions will be published on a Make or Break repository at the end of the competition, with credit to their authors.</li>
              <li>You can consult the rules of the competition in <a href="https://github.com/makeorbreak-io/mob-ai/blob/master/RULES.md" target="_blank" rel="noopener noreferrer">https://github.com/makeorbreak-io/mob-ai/blob/master/RULES.md</a></li>
              <li>Only the latest successfully processed bot will be considered for the next round of matches</li>
              <li>Bot revisions are automatically incremented for submissions with the same filename</li>
              <li>Questions? Need help? Support for new languages or libraries? Join <a href="https://makeorbreak-io.slack.com/messages/C9MTPV7C5/" target="_blank" rel="noopener noreferrer">#ai-competition on slack</a> (you can get an invite on the <Link to="/dashboard">dashboard</Link>)</li>
            </ul>
          </div>

          <ErrorMessage form="new-ai-competition-bot" field="title" />
          <ErrorMessage form="new-ai-competition-bot" field="sdk" />
          <ErrorMessage form="new-ai-competition-bot" field="sourceCode" />
        </form>

        {me.bots.length > 0 &&
          <Fragment>
            <h3>Previous submissions</h3>

            <label className="no-select">
              <input
                type="checkbox"
                checked={onlyCurrent}
                onChange={this.toggleOnlyCurrent}
              /> Show only current bot
            </label>

            <label className="no-select">
              <input
                type="checkbox"
                checked={onlyLastRevision}
                onChange={this.toggleOnlyLastRevision}
              /> Show only latest revisions
            </label>

            <table>
              <thead>
                <tr>
                  <td>Filename</td>
                  <td>Rev</td>
                  <td>SDK</td>
                  <td>Status</td>
                  <td>Submitted</td>
                  <td />
                </tr>
              </thead>
              <tbody>
                {me
                  .bots
                  .filter(onlyLastRevision ? this.filterOldRevisions : f => f)
                  .filter(onlyCurrent ? b => b.id === activeBot.id : f => f)
                  .map(bot => {
                    const sdk = codeSDKs.find(({ value }) => value === bot.sdk);

                    return (
                      <tr key={bot.id} className={bot.status}>
                        <td>{bot.id === activeBot.id ? "★" : ""} {bot.title}</td>
                        <td>{bot.revision}</td>
                        <td className={`sdk ${bot.sdk}`}>
                          <div>
                            <img src={sdk.img} alt={sdk.shortLabel} width="18" />
                            <span>{sdk.shortLabel}</span>
                          </div>
                        </td>
                        <td className={bot.status}>{bot.status}</td>
                        <td>{distanceInWordsToNow(parse(bot.insertedAt))} ago</td>
                        <td className="center">
                          <Button small primary onClick={this.openBotDetails(bot.id)}>
                            <span data-tip="Compilation output / source code">
                              <img height="13" src={terminalIcon} alt="Compilation output / source code" />
                            </span>
                          </Button>
                          {/*
                          <Button small primary>
                            <span data-tip="Source code"><img height="13" src={fileIcon} alt="Source code" /></span>
                          </Button>
                          */}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <label className="no-select">★ = active bot</label>
          </Fragment>
        }
      </div>
    );
  }
}

export default compose(
  setDisplayName("AIDashboardBots"),

  graphql(
    gql`{ me {
      id
      bots: aiCompetitionBots {
        ...aiCompetitionBot
      }
    }} ${aiCompetitionBot}`,
    {
      options: {
        pollInterval: 10000,
      },
    },
  ),

  waitForData,

  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { data } = nextProps;

      if (!data.aiGames) return;

      const nodes = data.aiGames.edges.map(e => e.node);

      if (every(nodes, n => n.status === "processed"))
        data.stopPolling();
      else
        data.startPolling();
    },
  }),

  reduxForm({
    form: "new-ai-competition-bot",
    validate,
  }),

  graphql(
    gql`mutation createAiCompetitionBot($bot: AiCompetitionBotInput!) {
      createAiCompetitionBot(bot: $bot) {
        id,
        aiCompetitionBots { ...aiCompetitionBot }
      }
    } ${aiCompetitionBot}`,
    { name: "createAiCompetitionBot" }
  )
)(AIDashboardBots);
