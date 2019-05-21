// @flow
import type { AnswerType } from "../typedefs/AnswerType";
import type { PartyType } from "../typedefs/PartyType";


class EvaluationHelper {
    /**
     * Evaluates concordance of user and parties answers
     *
     * @param answers
     * @param parties
     * @returns {Array<{name: string, description: string, logoPath: string, answers: Array<{value: (number|number|number)}>, concordance: number}>}
     */
    static evaluateAnswers = (
        answers: Array<AnswerType>,
        parties: Array<PartyType>,
    ): Array<PartyType> => {
        for (let i = 0; i < parties.length; i++) {
            parties[i].concordance = this.evaluateParty(answers, parties[i].answers);
        }
        return parties.sort((a,b)=>{
            return b.concordance - a.concordance
        });
    };

    /**
     * Calculates concordance of user and party answers
     *
     * @param userAnswers
     * @param partyAnswers
     * @returns {number}
     */
    static evaluateParty = (
        userAnswers: Array<AnswerType>,
        partyAnswers: Array<{ value: -1 | 0 | 1 | null }>
    ): number => {
        let maxPoints: number = 0;
        let score: number = 0;
        for (let i = 0; i < userAnswers.length; i++) {
            if (userAnswers[i].value !== null && partyAnswers[i].value !== null) {
                // user and party has answered this question
                score += Math.abs(userAnswers[i].value - partyAnswers[i].value) * userAnswers[i].weight;
                maxPoints += 2 * userAnswers[i].weight; // max distance is always 2
            }
        }
        if (maxPoints === 0) return 0;
        return 1 - (score / maxPoints);
    };
}

export default EvaluationHelper;