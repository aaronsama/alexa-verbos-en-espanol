const { goodbyeText } = require("../shared/phrases.json");

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
        // // must check that, if there is a current verb, it's not parar(-se)
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (
        handlerInput.requestEnvelope.request.intent.name === "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name === "AMAZON.StopIntent"
      )
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.speak(goodbyeText).getResponse(); // keep the session if it exists
  }
};

module.exports = CancelAndStopIntentHandler;
