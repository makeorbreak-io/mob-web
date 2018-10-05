import "./emailStyles";
import React from "react";

class EmailTemplate extends React.Component {
  render() {
    const { title, content } = this.props.email;

    return (
    <div id="email-template">
      <table>
        <tr>
          <td className="header">
            <img height="20" src="https://s3.eu-central-1.amazonaws.com/make-or-break-static-assets/email-logo.png" alt="Make or Break logo" />
          </td>
        </tr>
        <tr>
          <td className="title">
            {title}
        </td>
        </tr>
        <tr>
          <td className="body">
            <p>Hello, [Recipient Name]</p>

            <div dangerouslySetInnerHTML={{ __html: content }}/>
          </td>
        </tr>

        <tr className="sponsors">
          <td>
            <h2>Our amazing partners and sponsors</h2>
            <img alt="sponsors" src="https://s3.eu-central-1.amazonaws.com/make-or-break-static-assets/email-sponsors-2018.png" />
        </td>
        </tr>

        <tr>
          <td className="footer">
            <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/makeorbreak.io/">
              <img height="20" src="https://s3.eu-central-1.amazonaws.com/make-or-break-static-assets/email-fb.png" alt="Make or Break Facebook page" />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/makeorbreakio/">
              <img height="20" src="https://s3.eu-central-1.amazonaws.com/make-or-break-static-assets/email-twitter.png"
                alt="Make or Break Twitter account" />
            </a>
          </td>
        </tr>

        <tr>
          <td className="footer">
            © Make or Break 2018
          </td>
        </tr>
      </table>
    </div>
    );
  }
}

export default EmailTemplate;
