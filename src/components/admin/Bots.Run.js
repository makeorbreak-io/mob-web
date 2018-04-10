import { compose, setDisplayName, mapProps } from "recompose";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { aiCompetitionBot } from "fragments";
import { waitForData } from "enhancers";

import { AdminBots } from "components/admin/Bots";

export default compose(
  setDisplayName("AdminBots by run"),


  graphql(
    gql`query runBots($runName: String!) {
      runBots(runName: $runName){ ...aiCompetitionBot sourceCode }
    } ${aiCompetitionBot}`,
    {
      options: props => ({
        variables: { runName: `day ${props.params.day}` },
      }),
    }
  ),

  waitForData,

  mapProps(props => ({ data: { bots: props.data.runBots }})),

)(AdminBots);
