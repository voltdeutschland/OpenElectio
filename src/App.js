// @flow
import React from "react";
import "./App.css";
import SharedConstants from "./constants/SharedConstants";
import ElectionsService from "./services/ElectionsService";
import Question from "./components/question/Question";
import Weight from "./components/weight/Weight";

import type {QuestionType} from "./typedefs/QuestionType";
import type {AnswerType} from "./typedefs/AnswerType";
import type {PartyType} from "./typedefs/PartyType";
import type {ElectionType} from "./typedefs/ElectionType";

type Props = {};
type State = {
    elections: Array<ElectionType>,
    questions: ?Array<QuestionType>,
    answers: ?Array<AnswerType>,
    parties: ?Array<PartyType>,
    step: string,
    activeQuestion: number
};

const STEPS = {
    ELECTIONS: 0,
    QUESTIONS: 1,
    WEIGHTING: 2,
    EVALUATION: 3,
};

class App extends React.Component<Props, State> {

    state = {
        elections: [],
        questions: null,
        answers: null,
        parties: null,
        step: STEPS.ELECTIONS,
        activeQuestion: 0
    };

    componentWillMount = async () => {
        let state: ?string = localStorage.getItem(SharedConstants.STORAGE_PATH);
        if (state) {
            try {
                let parsedState: State = JSON.parse(state);
                await this.persistedSetState(parsedState);
            } catch (e) {
                console.log(e);
            }
        } else {
            let electionsService = new ElectionsService();
            let elections = electionsService.getElections();
            await this.setState(
                {
                    elections: elections
                }
            );
        }
    };

    onAnswer = (answer: -1 | 0 | 1 | null) => {
        let answers = this.state.answers;
        answers[this.state.activeQuestion] = {value: answer, weight: 1};
        if (this.state.activeQuestion < this.state.questions.length - 1) {
            console.log("next question");
            this.persistedSetState({answers: answers, activeQuestion: this.state.activeQuestion + 1});
        } else {
            console.log("go to weighting");
            this.persistedSetState({answers: answers, activeQuestion: 0, step: STEPS.WEIGHTING});
        }
    };

    onWeight = (questionNumber: number, weight: number) => {
        let answers = this.state.answers;
        answers[questionNumber].weight = weight;
        this.persistedSetState({answers: answers});
    };

    onElection = async (electionId: string) => {
        let electionsService = new ElectionsService();
        this.persistedSetState({answers: [], parties: await electionsService.getParties(electionId), questions: await electionsService.getQuestions(), activeQuestion: 0, step: STEPS.QUESTIONS});
    };

    onWeightingCompleted = async () => {
        // todo: calculate result here
        await this.persistedSetState({step: STEPS.EVALUATION});
    };

    renderElections = () => {
        let elections = [];
        for (let i = 0; i < this.state.elections.length; i++) {
            elections.push(
                <button key={"election" + i} className="pure-button big-button"
                        onClick={() => this.onElection(this.state.elections[i].id)}>
                    {
                        this.state.elections[i].name
                    }
                </button>
            );
        }
        return (
            <div className="app-inner-container">
                <h1 className="no-margin margin-bot-16">OpenElectio</h1>
                <p className="no-margin margin-bot-16 text-center">Herzlich Willkommen bei OpenElectio. Hier können Sie
                    alle Parteien für die anstehenden Wahlen vergleichen.<br/>
                    Wählen Sie die gewünschte Wahl aus der folgenden Liste:</p>
                <div className="elections-container">
                    {
                        elections ? elections : (<p>no elections found</p>)
                    }
                </div>
                <p>Made with 💜 in Germany. <a href="https://github.com/voltdeutschland/OpenElectio">Get Open Source
                    Code here</a></p>
            </div>
        )
    };

    renderQuestions = () => {
        return (
            <div className="app-inner-container">
                <p>Questions</p>
                <Question onAnswer={this.onAnswer} question={this.state.questions[this.state.activeQuestion]}/>
            </div>
        )
    };

    renderWeighting = () => {
        let weights = [];
        for (let i = 0; i < this.state.questions.length; i++) {
            weights.push(<Weight questionNumber={i} question={this.state.questions[i]}
                                 weight={this.state.questions[i].weight} onWeight={this.onWeight}/>);
        }
        return (
            <div className="app-inner-container">
                <h1>Weighting</h1>
                {
                    weights
                }
                <button className="pure-button" onClick={this.onWeightingCompleted}>weiter</button>
            </div>
        )
    };

    renderEvaluation = () => {
        return (
            <div className="app-inner-container">
                <p>Evaluation</p>
            </div>
        )
    };

    render = () => {
        let content = this.renderElections();
        switch (this.state.step) {
            case STEPS.ELECTIONS:
                content = this.renderElections();
                break;
            case STEPS.QUESTIONS:
                content = this.renderQuestions();
                break;
            case STEPS.WEIGHTING:
                content = this.renderWeighting();
                break;
            case STEPS.EVALUATION:
                content = this.renderEvaluation();
                break;
            default:
                content = this.renderElections();
        }
        return (
            <div className="app-container">
                {
                    content
                }
            </div>
        )
    };

    persistedSetState = (newState) => {
        return new Promise((resolve) => {
            this.setState(newState, () => {
                //localStorage.setItem(SharedConstants.STORAGE_PATH, JSON.stringify(newState));
                resolve()
            });
        });
    };
}

export default App;
