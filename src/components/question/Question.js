// @flow
import React from 'react';
import './Question.css';
import type {QuestionType} from "../../typedefs/QuestionType";

type Props = {
    question: QuestionType,
    onAnswer: (answer: -1 | 0 | 1 | null) => mixed
};

class Question extends React.Component<Props> {

    render = () => {
        return (
            <div className="question-outer-container">
                <div className="question-container">
                <h2>{this.props.question.title}</h2>
                <p>{this.props.question.text}</p>
                </div>
                <div className="answers-container">
                    <button onClick={() => this.props.onAnswer(-1)}>nein</button>
                    <button onClick={() => this.props.onAnswer(0)}>neutral</button>
                    <button onClick={() => this.props.onAnswer(1)}>ja</button>
                    <button onClick={() => this.props.onAnswer(null)}>überspringen</button>
                </div>
            </div>
        );
    }
}

export default Question;
