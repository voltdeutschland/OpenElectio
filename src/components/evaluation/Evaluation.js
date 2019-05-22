// @flow
import React from "react";
import "./Evaluation.css";
import type {PartyType} from "../../typedefs/PartyType";
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import type {QuestionType} from "../../typedefs/QuestionType";
import type {AnswerType} from "../../typedefs/AnswerType";

type Props = {
    party: PartyType,
    questions: Array<QuestionType>,
    answers: Array<AnswerType>,
    position: number,
};

type State = {
    open: boolean
}


/**
 * Evaluate object
 */
class Evaluation extends React.Component<Props, State> {

    state = {
        open: false
    };


    /**
     * render with the position from evaluate
     * @param {Number} position - the position from the Evaluation
     * @return {HTML}
     */
    renderPositions = (position: number) => {
        let you = "";
        if(this.props.answers[position].value === -1){
            you = "x";
        } else if(this.props.answers[position].value === 0){
            you = "-";
        } else if(this.props.answers[position].value === 1){
            you = "✓";
        }
        let party = "";
        if(this.props.party.answers[position].value === -1){
            party = "x";
        } else if(this.props.party.answers[position].value === 0){
            party = "-";
        } else if(this.props.party.answers[position].value === 1){
            party = "✓";
        }
        return (
            <div className="evaluation-answer-compare">
                <p>{ "Du: " +  you + ", Partei: " + party }</p>
            </div>
        )
    };


    /**
     * renderDescription - render the evaluation description
     * @return {HTML}
     */
    renderDescription = () => {
        if(this.state.open){
            let questions = [];
            for(let i = 0; i < this.props.questions.length; i++){
                questions.push(
                    <div className="evaluation-answer-container">
                        <div className="evaluation-question-container">
                            <p className="evaluation-question">{this.props.questions[i].title}</p>
                            {
                                this.renderPositions(i)
                            }
                        </div>
                        <p className="evaluation-answer">{this.props.party.answers[i].comment}</p>
                    </div>
                )
            }
            return (
                <div className="evaluation-details">
                    <p>{this.props.party.description}</p>
                    {
                        questions
                    }
                </div>
            )
        }
    };


    /**
     * render - render the element
     * @return {HTML}
     */
    render = () => {
        return (
            <section className="evaluation-container" key={"party_" + this.props.position}>
                <div className="evaluation-info">
                    <div className="evaluation-data">
                        <h2>{this.props.party.name}</h2>
                    </div>
                    <div className="evaluation-progress">
                        <Progress percent={(this.props.party.concordance * 100).toFixed(1)} status="active"/>
                    </div>
                    <button onClick={() => this.setState({open: !this.state.open})} className="pure-button">Details</button>
                </div>
                {
                    this.renderDescription()
                }
            </section>
        );
    }
}

export default Evaluation;
