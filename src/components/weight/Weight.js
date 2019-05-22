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


/**
 * Representate a Weight Component
 */
class Weight extends React.Component<Props> {


    /**
     * onWeight - set the weight
     */
    onWeight = () => {
        let weight = 1;
        if (this.props.weight === 1) {
            weight = 2;
        }
        this.props.onWeight(this.props.questionNumber, weight);
    };


    /**
     * render - render the weight element
     * @return {HTML}
     */
    render = () => {
        console.log(this.props.weight)
        return (
            <section className="weight-container">
                <button onClick={this.onWeight} className={ this.props.weight === 1 ? "weight-button" : "weighted-button"}>
                    <h2>{this.props.question.title}</h2>
                    <p>{this.props.question.text}</p>
                </button>
            </section>
        );
    }
}

export default Weight;
