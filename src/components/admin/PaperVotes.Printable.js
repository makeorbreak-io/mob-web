import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";
import QRCode from "qrcode";

export class PrintablePaperVote extends Component {

  state = {
    svg: null,
  }

  componentDidMount() {
    QRCode.toString(this.props.id, (err, svg) => {
      this.setState({ svg });
    });

    window.setTimeout(() => {
      window.print();
      window.close();
    }, 1000);
  }

  render() {
    const { svg } = this.state;
    const { category } = this.props;

    return (
      <div className="PrintablePaperVote">
        <h1>{category}</h1>
        <img width="400" src={`data:image/svg+xml;utf8,${svg}`} />;
      </div>
    );
  }
}

export default compose(
  setDisplayName("PrintablePaperVote"),
)(PrintablePaperVote);
