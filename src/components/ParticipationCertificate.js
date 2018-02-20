import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose, setDisplayName, setPropTypes, getContext } from "recompose";
import { connect } from "react-redux";
import { format } from "date-fns";
import pt from "date-fns/locale/pt";
import JsBarcode from "jsbarcode";

//
// assets
import alumniLogo from "assets/images/participation-certificate-alumniei-logo.svg";
import mobLogo from "assets/images/participation-certificate-mob-logo-purple.svg";
import pscLogo from "assets/images/participation-certificate-psc-logo-black.svg";

export class ParticipationCertificate extends Component {

  //----------------------------------------------------------------------------
  // Lifecycle
  //----------------------------------------------------------------------------
  componentWillMount() {
  }

  componentDidMount() {
    const { currentUser, router } = this.props;

    if (!currentUser) {
      router.push("/");
      return;
    }

    JsBarcode("#barcode", currentUser.id, {
      displayValue: false,
    });

    window.setTimeout(window.print, 1000);

  }


  //----------------------------------------------------------------------------
  // Render
  //----------------------------------------------------------------------------
  render() {
    const { currentUser, idNumber } = this.props;

    if (!currentUser) return <div>Loading...</div>;

    return (
      <div className="ParticipationCertificate">
        <div className="logo">
          <img src={mobLogo} />
        </div>

        <h1>Comprovativo de participação</h1>

        <p>Certifica-se a participação no evento Make or Break (8, 9 e 10 de Setembro de 2017) de:</p>

        <ul>
          <li>Nome: {currentUser.display_name}</li>
          <li>BI: {idNumber}</li>
        </ul>

        <p>
          Evento organizado por

          <img src={pscLogo} height="90" />

          <img src={alumniLogo} height="50" />
        </p>

        <p>
          AlumniLeic - Associação de Antigos Alunos de Engenharia Informática da FEUP
          <br />
          Rua Dr. Roberto Frias
          <br />
          4200-465
          <br />
          Porto, Portugal
        </p>

        <p className="date">Porto, {format(new Date(), "D MMM YYYY", { locale: pt })}</p>

        <svg id="barcode" />
      </div>
    );
  }

}

export default compose(
  setDisplayName("ParticipationCertificate"),

  setPropTypes({
    idNumber: PropTypes.string,
  }),

  getContext({
    router: PropTypes.object.isRequired,
  }),

  connect(({ currentUser }) => ({ currentUser })),
)(ParticipationCertificate);
