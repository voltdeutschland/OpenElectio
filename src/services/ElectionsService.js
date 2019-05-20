/**
 * Create a instance of Elections
 *
 */
class ElectionsService {
    getElections = () => {
        return [{id: "abc123", name: "Test Wahl", description: "Diese Wahl ist ein Test"}];
    };

    /**
     * Get the Elections via URL
     * @param {String} url the path to the Election JSON
     * @return {JSON} return json or null
     */
    getElectionsByURL = (url) => {
        try{
            let response = await fetch(url);
            return await response.json();
        }catch(exception){
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
        try{
            let storageData = localStorage.getItem(name);
            return JSON.parse(storageData);
        }catch(exception){
            console.error(exception);
            return null;
        }
    }

    /**
     * Save the Elections in local Storage
     * @param {String} name the name for storage
     * @param {JSON} data the election json data
     * @return {JSON} return json or null
     */
    setElectionsToStorage = (name, data) => {
        try{
            localStorage.setItem(name, JSON.stringify(storageData));
            return true;
        }catch(exception){
            console.error(exception);
            return null;
        }
    }
}

export default ElectionsService;
