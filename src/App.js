import React from 'react';
import './App.css';
import ElectionsService from './services/ElectionsService';

const STEPS = {
    ELECTIONS: 0,
    QUESTIONS: 1,
    WEIGHTING: 2,
    EVALUATION: 3,
};

class App extends React.Component {

    state = {
        /**
         * Elections available
         *
         * Array<{id: string, name: string, description: string}>
         */
        elections: [],

        /**
         * Questions
         *
         * ?Array<{title: string, text: string}>
         */
        questions: null,

        /**
         * Answers
         *
         * ?Array<{value: -1 | 0 | 1, weighted: 0 | 1}>
         */
        answers: null,

        /**
         * Application state
         *
         * number
         */
        step: STEPS.ELECTIONS,
    };

    /**
     * Election data
     */

    /**
     * List of competing parties in selected election
     *
     * -> logoPath must be valid url
     *
     * ?Array<{name: string, description: string, logoPath: string, answers: Array<{value: -1 | 0 | 1}>>
     */
    parties = null;

    componentWillMount = async () => {
        let electionsService = new ElectionsService();
        let elections = electionsService.getElections();
        await this.setState(
            {
                elections: elections
            }
        );
    };

    renderElections = () => {
        return (
            <div>
                <p>Elections</p>
            </div>
        )
    };

    renderQuestions = () => {
        return (
            <div>
                <p>Questions</p>
            </div>
        )
    };

    renderWeighting = () => {
        return (
            <div>
                <p>Weighting</p>
            </div>
        )
    };

    renderEvaluation = () => {
        return (
            <div>
                <p>Evaluation</p>
            </div>
        )
    };

    render = () => {
        switch(this.state.step){
            case STEPS.ELECTIONS:
                return this.renderElections();
            case STEPS.QUESTIONS:
                return this.renderQuestions();
            case STEPS.WEIGHTING:
                return this.renderWeighting();
            case STEPS.EVALUATION:
                return this.renderEvaluation();
            default:
                return this.renderElections();
        }
    }
}

export default App;
