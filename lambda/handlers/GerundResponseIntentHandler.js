const { getSlotValue } = require("ask-sdk-core");
const responseFeedback = require("../shared/responseFeedback");
const clearVerb = require("../shared/clearVerb");

const GerundResponseIntentHandler = {
  canHandle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name ===
        "GerundResponseIntent" &&
      sessionAttributes.infinitive &&
      sessionAttributes.conjugation &&
      sessionAttributes.mood === "gerund"
    );
  },
  handle(handlerInput) {
    const userResponse = getSlotValue(
      handlerInput.requestEnvelope,
      "gerundResponse"
    );

    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const {
      infinitive,
      conjugation
    } = sessionAttributes;

    const response = responseFeedback(
      { infinitive, mood: "gerund", conjugation },
      userResponse
    );
    
    clearVerb(handlerInput, sessionAttributes);

    return handlerInput.responseBuilder.speak(response).withShouldEndSession(false).getResponse();
  }
};

module.exports = GerundResponseIntentHandler;
