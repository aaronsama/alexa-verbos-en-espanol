const { welcomeText, helpText } = require("../shared/phrases.json");

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'StartIntent',
        confirmationStatus: 'NONE',
        slots: {}
      })
      .speak(welcomeText)
      .reprompt(helpText)
      .getResponse();
  }
};

module.exports = LaunchRequestHandler;
