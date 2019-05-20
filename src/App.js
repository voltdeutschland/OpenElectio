// @flow
import React from 'react';
import './App.css';
import Question from './components/question/Question';
import SharedConstants from './constants/SharedConstants';
import ElectionsService from './services/ElectionsService';

type Props = {};
type State = {
    elections: Array<{id: string, name: string, description: string}>,
    questions: ?Array<{title: string, text: string}>,
    answers: ?Array<{value: -1 | 0 | 1 | null, weight: number}>,
    parties: ?Array<{name: string, description: string, logoPath: string, answers: Array<{value: -1 | 0 | 1}>}>,
    step: string,
    activeQuestion: number
};

const STEPS = {
    ELECTIONS: 0,
    QUESTIONS: 1,
    WEIGHTING: 2,
    EVALUATION: 3,
};

class App extends React.Component<Props, State>{

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
        if(state){
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

    persistedSetState = (newState) => {
        return new Promise((resolve) => {
            this.setState(newState, () => {
                localStorage.setItem(SharedConstants.STORAGE_PATH, JSON.stringify(newState));
                resolve()
            });
        });
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
                <Question/>
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
        switch (this.state.step) {
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
