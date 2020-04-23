const { getSlotValue } = require("ask-sdk-core");
const responseFeedback = require("../shared/responseFeedback");
const clearVerb = require("../shared/clearVerb");
const conjugationSlots = require("../shared/conjugationSlots");

const ConjugationResponseIntentHandler = {
  canHandle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name ===
        "ConjugationResponseIntent" &&
      sessionAttributes.infinitive &&
      sessionAttributes.conjugation &&
      (sessionAttributes.mood === "indicativo" ||
        sessionAttributes.mood === "subjuntivo") &&
      sessionAttributes.tense !== null
    );
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const dialogState = handlerInput.requestEnvelope.request.dialogState;

    if (dialogState === "COMPLETED") {
      const { infinitive, conjugation, mood, tense } = sessionAttributes;

      const userResponse = Object.keys(conjugationSlots).map(resp =>
        getSlotValue(handlerInput.requestEnvelope, resp),
      );

      const response = responseFeedback(
        {
          infinitive,
          mood,
          tense,
          conjugation,
        },
        userResponse,
      );

      clearVerb(handlerInput, sessionAttributes);

      return handlerInput.responseBuilder
        .speak(response)
        .withShouldEndSession(false)
        .getResponse();
    } else {
      const currentIntent = handlerInput.requestEnvelope.request.intent;

      return handlerInput.responseBuilder
        .addDelegateDirective(currentIntent)
        .getResponse();
    }
  },
};

module.exports = ConjugationResponseIntentHandler;
