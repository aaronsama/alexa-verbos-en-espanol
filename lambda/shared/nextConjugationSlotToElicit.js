const conjugationSlots = require("./conjugationSlots");

const conjugationSlotNames = Object.keys(conjugationSlots);

const nextConjugationSlotToElicit = providedSlots => {
  const providedSlotsCount = Object.values(providedSlots).filter(slot => slot.value !== undefined).length;
  return conjugationSlotNames[providedSlotsCount];
};

module.exports = nextConjugationSlotToElicit;
