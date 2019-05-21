// @flow
/**
 * Create a instance of Elections
 *
 */
class ElectionsService {
    getElections = () => {
        return [
            {id: "election1", name: "Realistische Wahl", description: "Diese Wahl ist ein Test mit vielen Fragen und vielen Parteien"},
            {id: "election2", name: "Test Wahl 2", description: "Diese Wahl ist ein Test mit wenigen Fragen und wenigen Parteien"}
        ];
    };

    /**
     * implementation with dummy data
     * @param electionId
     */
    getParties = (electionId: string) => {
        if(electionId === "election1"){
            return require('../assets/data/election1/partys');
        } else {
            return require('../assets/data/election2/partys');
        }
    };

    /**
     * implementation with dummy data
     * @param electionId
     */
    getQuestions = (electionId: string) => {
        if(electionId === "election1"){
            return require('../assets/data/election1/questions');
        } else {
            return require('../assets/data/election2/questions');
        }
    };

    /**
     * Get the Elections via URL
     * @param {String} url the path to the Election JSON
     * @return {JSON} return json or null
     */
    getElectionsByURL = async (url) => {
        try {
            let response = await fetch(url);
            return await response.json();
        } catch (exception) {
            console.error(exception);
            return null;
        }
    };

    /**
     * Get the Elections from local storage
     * @param {String} name the name for storage
     * @return {JSON} return json or null
     */
    getElectionsByStorage = (name) => {
        try {
            let storageData = localStorage.getItem(name);
            return JSON.parse(storageData);
        } catch (exception) {
            console.error(exception);
            return null;
        }
    };

    /**
     * Save the Elections in local Storage
     * @param {String} name the name for storage
     * @param {JSON} data the election json data
     * @return {Boolean} return true or false
     */
    setElectionsToStorage = (name, data) => {
        try {
            localStorage.setItem(name, JSON.stringify(data));
            return true;
        } catch (exception) {
            console.error(exception);
            return false;
        }
    };
}

export default ElectionsService;
