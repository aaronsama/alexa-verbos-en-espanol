const { normalizedMood } = require("../shared/verbs");
const fullConjugation = require("../shared/fullConjugation");
const clearVerb = require("../shared/clearVerb");
const { wantMoreQuestion } = require("../shared/phrases.json");

const DontKnowIntentHandler = {
  canHandle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "DontKnowIntent" &&
      sessionAttributes.infinitive &&
      sessionAttributes.conjugation
    );
  },
  async handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const { infinitive, mood, tense, conjugation } = sessionAttributes;

    let response = `Vale. Aquí tienes la respuesta.`;

    if (mood === "gerund" || mood === "pastparticiple") {
      response += ` El ${normalizedMood(
        mood,
      )} de ${infinitive} es: ${conjugation}.`;
    } else {
      response += ` El ${normalizedMood(
        mood,
      )} ${tense} de ${infinitive} es: ${fullConjugation(conjugation)}.`;
    }

    response += ` ${wantMoreQuestion}`;

    clearVerb(handlerInput, sessionAttributes);

    return handlerInput.responseBuilder
      .speak(response)
      .reprompt(wantMoreQuestion)
      .withShouldEndSession(false)
      .getResponse();
  },
};

module.exports = DontKnowIntentHandler;
