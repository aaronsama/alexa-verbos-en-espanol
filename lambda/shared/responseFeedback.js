const fullConjugation = require("./fullConjugation");
const { normalizedMood } = require("./verbs");
const { positiveStarters, negativeStarters, wantMoreQuestion } = require("./phrases.json");

const buildExpectedResponseString = ({ tense = undefined, conjugation }) => {
  return !!tense ? fullConjugation(conjugation) : conjugation;
};

const normalizeUserResponse = userResponse => {
    if (typeof userResponse === "object") {
        return fullConjugation({
          form_1s: userResponse[0],
          form_2s: userResponse[1],
          form_3s: userResponse[2],
          form_1p: userResponse[3],
          form_2p: userResponse[4],
          form_3p: userResponse[5]
        });
    } else {
        return userResponse;
    }
}

const validateUserResponse = (expectedResponse, userResponse) => {
  console.log("Expected:", expectedResponse);
  console.log("Received:", userResponse);
  return expectedResponse === userResponse;
};

const feedbackText = (responseIsCorrect) => {
    const feedback = responseIsCorrect
        ? positiveStarters[Math.floor(Math.random() * positiveStarters.length)]
        : negativeStarters[Math.floor(Math.random() * negativeStarters.length)]
    
    return `<say-as interpret-as="interjection">${feedback}</say-as>`
}

const correctResponseText = ({ mood, tense = undefined, infinitive }, expectedResponse) => {
    if (!!tense) {
        return `El ${normalizedMood(mood)} ${tense} de ${infinitive} es: ${expectedResponse}`;
    }

    return `El ${normalizedMood(mood)} de ${infinitive} es ${expectedResponse}`;
}

const responseFeedback = (
  { infinitive, mood, tense = undefined, conjugation },
  userResponse
) => {
    console.log("infinitive", infinitive);
    console.log("mood", mood);
    console.log("tense", tense);
    console.log("conjugation", conjugation);
    console.log("userResponse", userResponse);
    
    const expectedResponse = buildExpectedResponseString({
    tense,
    conjugation
    });
    const givenResponse = normalizeUserResponse(userResponse);
    
    const responseIsCorrect = validateUserResponse(expectedResponse, givenResponse);
    
    return (`
        <speak>
            <p>${feedbackText(responseIsCorrect)}</p>
            <p>${correctResponseText({ mood, tense, infinitive }, expectedResponse)}</p>
            <p>${wantMoreQuestion}</p>
        </speak>
    `);
};

module.exports = responseFeedback;
