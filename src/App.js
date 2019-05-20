// @flow
import React from 'react';
import './App.css';
import Question from './components/question/Question';
import SharedConstants from './constants/SharedConstants';

type Props = {};
type State = {};

class App extends React.Component<Props, State>{

    componentWillMount = async () => {
        let state = localStorage.getItem(SharedConstants.STORAGE_PATH);
        if(state){
            try {
                await this.persistedSetState(JSON.parse(state));
            } catch (e) {
                console.log(e);
            }
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

    render = () => {
        return (
            <div className="App">
                <header className="App-header">
                    <Question/>
                </header>
            </div>
        );
    }
}

export default App;
