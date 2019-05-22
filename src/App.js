// @flow
import React from "react";
import "./App.css";
import SharedConstants from "./constants/SharedConstants";
import ElectionsService from "./services/ElectionsService";
import Question from "./components/question/Question";
import Weight from "./components/weight/Weight";
import Evaluation from "./components/evaluation/Evaluation";

import type {QuestionType} from "./typedefs/QuestionType";
import type {AnswerType} from "./typedefs/AnswerType";
import type {PartyType} from "./typedefs/PartyType";
import type {ElectionType} from "./typedefs/ElectionType";
import EvaluationHelper from "./helpers/EvaluationHelper";

import {Progress} from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";

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


/**
 * The Basic App
 */
class App extends React.Component<Props, State> {

    state = {
        elections: [],
        questions: null,
        answers: null,
        parties: null,
        step: STEPS.ELECTIONS,
        activeQuestion: 0
    };


    /**
     * componentWillMount - Called whenever an App component will be mounted
     */
    componentWillMount = async () => {
        let state: ?string = localStorage.getItem(SharedConstants.STORAGE_PATH);
        if (state) {
            try {
                let parsedState: State = JSON.parse(state);
                await this.persistedSetState(parsedState);
            } catch (e) {
                console.error(e);
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

    /**
     * onAnswer - evaluate answer
     * @param {Integer} answer - -1 = no, 0 = neutral, 1 = yes and null = do not calculate the answer
     */
    onAnswer = (answer: -1 | 0 | 1 | null) => {
        let answers = this.state.answers;
        answers[this.state.activeQuestion] = {value: answer, weight: 1};
        if (this.state.activeQuestion < this.state.questions.length - 1) {
            this.persistedSetState({answers: answers, activeQuestion: this.state.activeQuestion + 1});
        } else {
            this.persistedSetState({answers: answers, activeQuestion: 0, step: STEPS.WEIGHTING});
        }
    };


    /**
     * onWeight - set question weight
     * @param {Number} questionNumber - The question id to set the weight
     * @param {Number} weight - the weight to set
     */
    onWeight = (questionNumber: number, weight: number) => {
        let answers = this.state.answers;
        answers[questionNumber].weight = weight;
        this.persistedSetState({answers: answers});
    };


    /**
     * onElection - load evaluation data and jump to questions
     * @param {String} electionId - the id from the election to evaluate
     */
    onElection = async (electionId: string) => {
        let electionsService = new ElectionsService();
        this.persistedSetState({
            answers: [],
            parties: await electionsService.getParties(electionId),
            questions: await electionsService.getQuestions(electionId),
            activeQuestion: 0,
            step: STEPS.QUESTIONS
        });
    };


    /**
     * onWeightingCompleted - calculate the answers and weight data
     */
    onWeightingCompleted = async () => {
        await this.persistedSetState({
            step: STEPS.EVALUATION,
            parties: EvaluationHelper.evaluateAnswers(this.state.answers, this.state.parties)
        });
    };


    /**
     * renderElections - render all elections
     * @return {HTML}
     */
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
            <section className="app-inner-container">
                <h1 className="no-margin margin-bot-16 text-center">OpenElectio</h1>
                <p className="no-margin margin-bot-16 text-center">Herzlich Willkommen bei OpenElectio. Hier können Sie
                    alle Parteien für die anstehenden Wahlen vergleichen.<br/>
                    Wählen Sie die gewünschte Wahl aus der folgenden Liste:</p>
                <div className="elections-container">
                    {
                        elections ? elections : (<p>no elections found</p>)
                    }
                </div>
                <p className="text-center">Made with &hearts; in Germany. <a
                    href="https://github.com/voltdeutschland/OpenElectio" target="_blank">Get Open Source
                    Code here</a></p>
                <p className="text-center disclaimer-text">Das ist eine Demo.</p>
            </section>
        )
    };


    /**
     * renderQuestions - render a question
     * @return {HTML}
     */
    renderQuestions = () => {
        return (
            <section className="app-inner-container">
                <Progress percent={Math.round(this.state.activeQuestion / this.state.questions.length * 100)}
                          status="active"/>
                <Question onAnswer={this.onAnswer} question={this.state.questions[this.state.activeQuestion]}/>
            </section>
        )
    };


    /**
     * renderWeighting - render all weightings
     */
    renderWeighting = () => {
        let weights = [];
        for (let i = 0; i < this.state.questions.length; i++) {
            weights.push(<Weight questionNumber={i}
                                 question={this.state.questions[i]}
                                 key={"weighting" + i}
                                 weight={this.state.answers[i].weight} onWeight={this.onWeight}/>);
        }
        return (
            <section className="app-inner-container">
                <h1 className="text-center">Gewichtung</h1>
                <p className="text-center">Klicke hier die Fragen an, die dir besonders wichtig sind, um sie in der
                    Auswertung doppelt zu gewichten.</p>
                {
                    weights
                }
                <div className="button-container">
                    <button className="pure-button" onClick={this.onWeightingCompleted}>weiter</button>
                </div>
            </section>
        )
    };


    /**
     * renderEvaluation - render the evaluation
     * @return {HTML}
     */
    renderEvaluation = () => {
        // expect parties to be sorted descending by concordance
        let parties = [];
        for (let i = 0; i < this.state.parties.length; i++) {
            parties.push(<Evaluation party={this.state.parties[i]}
                                     questions={this.state.questions}
                                     answers={this.state.answers}
                                     position={i + 1}
                                     key={"evaluation" + i}/>)
        }
        return (
            <section className="app-inner-container">
                <h1 className="text-center">Auswertung</h1>
                <article className="parties-container">
                    {
                        parties
                    }
                </article>
                <div className="button-container">
                    <button className="pure-button" onClick={() => {
                        this.setState({step: STEPS.ELECTIONS, questions: null, answers: null})
                    }}>
                        Neustart
                    </button>
                </div>
            </section>
        )
    };


    /**
     * render - Render the app content
     * @return {HTML}
     */
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
            <article className="app-container">
                {
                    content
                }
            </article>
        )
    };


    /**
     * persistedSetState - set a new persisted state
     * @param {STATE} newState - the new state
     */
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
