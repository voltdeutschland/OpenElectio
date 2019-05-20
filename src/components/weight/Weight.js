// @flow
import React from "react";
import "./Weight.css";
import type {QuestionType} from "../../typedefs/QuestionType";

type Props = {
    questionNumber: number,
    question: QuestionType,
    weight: number,
    onWeight: (questionNumber: number, weight: number) => mixed
};

class Weight extends React.Component<Props> {

    onWeight = () => {
        let weight = 1;
        if (this.props.weight === 1) {
            weight = 2;
        }
        this.props.onWeight(this.props.questionNumber, weight);
    };

    render = () => {
        return (
            <div className="weight-container">
                <button onClick={this.onWeight} className="weight-button">
                    <h2>{this.props.question.title}</h2>
                    <p>{this.props.question.text}</p>
                </button>


            </div>
        );
    }
}

export default Weight;
