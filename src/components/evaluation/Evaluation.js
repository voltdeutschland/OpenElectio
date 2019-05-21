// @flow
import React from "react";
import "./Evaluation.css";
import type {PartyType} from "../../typedefs/PartyType";

type Props = {
    party: PartyType,
    position: number,
};

class Evaluation extends React.Component<Props> {

    openDetails = () => {
        //trigger some state to show some details
    };

    render = () => {
        return (
            <section className="evaluation-container" key={"party_" + this.props.position}>
                <img src={this.props.party.logoPath} className="evaluation-logo" alt={this.props.party.name + " Logo"}/>
                <div className="evaluation-data">
                    <h2>{this.props.party.name}</h2>
                    <span>Übereinstimmung: {(this.props.party.concordance * 100).toFixed(1)}%</span>
                </div>
                <button onClick={this.openDetails} className="evaluation-button">
                    <span>Details</span>
                </button>
            </section>
        );
    }
}

export default Evaluation;
