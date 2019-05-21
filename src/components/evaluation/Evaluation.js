// @flow
import React from "react";
import "./Evaluation.css";
import type {PartyType} from "../../typedefs/PartyType";
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

type Props = {
    party: PartyType,
    position: number,
};

class Evaluation extends React.Component<Props> {

    render = () => {
        return (
            <section className="evaluation-container" key={"party_" + this.props.position}>
                <div className="evaluation-data">
                    <h2>{this.props.party.name}</h2>
                </div>
                <div className="evaluation-progress">
                    <Progress percent={(this.props.party.concordance * 100).toFixed(1)} status="active"/>
                </div>
            </section>
        );
    }
}

export default Evaluation;
