const constants = require("./constants");

function rewardsService({
  customerAccountNumber,
  portfolio,
  eligibilityService,
}) {
  const data = { data: [] };

  const customerRewards = (customerSubscription) =>
    typeof constants.channelAssociatedRewards[customerSubscription] === "undefined"
      ? []
      : constants.channelAssociatedRewards[customerSubscription];

  try {
    const eligibility = eligibilityService(customerAccountNumber);
    if (eligibility !== constants.CUSTOMER_ELIGIBLE) {
      return data;
    }

    return Object.assign(data, {
      data: [].concat.apply(
        [],
        portfolio.customerSubscriptions.map(customerRewards)
      ),
    });
  } catch (err) {
    if (err.message === constants.INVALID_ACCOUNT_NUMBER_EXCEPTION) {
      return Object.assign(data, { invalidAccountNumber: true });
    }

    return data;
  }
}

module.exports = rewardsService;