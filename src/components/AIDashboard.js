import React, { Component } from "react";

import { Tabs, Tab, Panel } from "components/uikit/tabs";

import AIDashboardBots from "components/AIDashboard.Bots";
import AIDashboardGames from "components/AIDashboard.Games";

export class AIDashboard extends Component {
  render() {
    return (
      <div className="AIDashboard">
        <Tabs>
          <Tab><span>Games</span></Tab>
          <Tab><span>Bots</span></Tab>

          <Panel>
            <AIDashboardGames />
          </Panel>
          <Panel>
            <AIDashboardBots />
          </Panel>
        </Tabs>
      </div>
    );
  }
}

export default AIDashboard;
