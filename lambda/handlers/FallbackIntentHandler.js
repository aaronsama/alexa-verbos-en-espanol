const { normalizedMood, textForVerbPrompt } = require("../shared/verbs");
const { errorText, helpText } = require("../shared/phrases.json");

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "AMAZON.FallbackIntent";
  },
  handle(handlerInput) {
    const intentName = handlerInput.requestEnvelope.request.intent.name;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const { infinitive, mood, tense } = sessionAttributes;

    if (mood !== undefined) {
        return (
          handlerInput.responseBuilder
            .speak(`<say-as interpret-as="interjection">mmh</say-as> Esperaba un ${normalizedMood(mood)}.`)
            .reprompt(textForVerbPrompt(infinitive, mood, tense))
            .getResponse()
        );
    } else {
        return (
          handlerInput.responseBuilder
            .speak(errorText)
            .reprompt(helpText)
            .getResponse()
        );
    }
  }
};

module.exports = FallbackIntentHandler;