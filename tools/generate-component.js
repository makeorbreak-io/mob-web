const fs = require("fs");
const program = require("commander");
const { last, slice, snakeCase } = require("lodash");

const stylusTemplate = 
`@import "~components/variables"

.:name:
  position: relative
`

const jsTemplate =
`import "./styles";

import React, { Component } from "react";
import { compose, setDisplayName } from "recompose";

export class :name: extends Component {

  render() {
    return (
      <div className=":name:">
      </div>
    );
  }

}

export default compose(
  setDisplayName(":name:"),
)(:name:);
`
program
  .arguments("<name>")
  .action((name) => {
    const paths = name.split("/");
    const pathPrefix = slice(paths, 0, paths.length - 1).join("/");
    const componentName = last(paths);

    const mode = "wx";
    const path = `src/components/${pathPrefix}/${snakeCase(componentName)}`;

    try {
      fs.mkdirSync(path) //, (a, b, c) => console.log(a, b, c));
    } catch(e) {
      console.warn(e.message, "\n")
    }

    const stylesFilename = `${path}/styles.styl`;
    try {
      const styles = fs.openSync(stylesFilename, mode);
      fs.writeSync(styles, stylusTemplate.replace(/:name:/g, componentName));
      console.log(`Wrote ${stylesFilename}`);
    } catch(e) {
      console.log(`${stylesFilename} exists, skipping`);
    }

    const jsFilename = `${path}/index.js`
    try {
      const js = fs.openSync(jsFilename, mode);
      fs.writeSync(js, jsTemplate.replace(/:name:/g, componentName));
      console.log(`Wrote ${jsFilename}`);
    } catch(e) {
      console.log(`${jsFilename} exists, skipping`);
    }
  })
  .parse(process.argv);
