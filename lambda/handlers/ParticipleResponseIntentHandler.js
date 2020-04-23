const { getSlotValue } = require("ask-sdk-core");
const responseFeedback = require("../shared/responseFeedback");
const clearVerb = require("../shared/clearVerb");

const ParticipleResponseIntentHandler = {
  canHandle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name ===
        "ParticipleResponseIntent" &&
      sessionAttributes.infinitive &&
      sessionAttributes.mood === "pastparticiple"
    );
  },
  handle(handlerInput) {
    const userResponse = getSlotValue(
      handlerInput.requestEnvelope,
      "participleResponse"
    );

    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const {
      infinitive,
      conjugation
    } = sessionAttributes;

    const response = responseFeedback(
      { infinitive, mood: "pastparticiple", conjugation },
      userResponse
    );
    
    clearVerb(handlerInput, sessionAttributes);

    return handlerInput.responseBuilder.speak(response).withShouldEndSession(false).getResponse();
  }
};

module.exports = ParticipleResponseIntentHandler;
