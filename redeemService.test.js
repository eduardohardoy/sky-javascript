const redeemService = require('./redeemService');
const constants = require('./constants');

// Mocks
const mockEligibileCustomer = () => constants.CUSTOMER_ELIGIBLE;
const mockIneligibileCustomer = () => constants.CUSTOMER_INELIGIBLE;
const mockTechnicalError = () => {
  throw new Error(constants.TECHNICAL_FAILURE_EXCEPTION);
};
const mockInvalidAccountError = () => {
  throw new Error(constants.INVALID_ACCOUNT_NUMBER_EXCEPTION);
};

const technicalErrorParams = () => ({
  customerAccountNumber: 123456,
  portfolio: {
    customerSubscriptions: [],
  },
  eligibilityService: mockTechnicalError,
});

const invalidAccountNumberErrorParams = () => ({
  customerAccountNumber: 333333,
  portfolio: {
    customerSubscriptions: [],
  },
  eligibilityService: mockInvalidAccountError,
});

const eligibileCustomerAndSubscriptionInfo = (customerSubscriptions) => ({
  customerAccountNumber: 123456,
  portfolio: {
    customerSubscriptions,
  },
  eligibilityService: mockEligibileCustomer,
});

describe('redeemService', () => {
  it('Should not return any rewards for an Ineligible Customer', () => {
    const params = {
      customerAccountNumber: 123456,
      portfolio: {
        customerSubscriptions: [],
      },
      eligibilityService: mockIneligibileCustomer,
    };
    const customerRewards = redeemService(params);
    expect(customerRewards.data.length).toBe(0);
    expect(customerRewards.data).toEqual([]);
  });

  it('Should not return any rewards for a Technical Failure', () => {
    const customerRewards = redeemService(technicalErrorParams());
    expect(customerRewards.data.length).toBe(0);
    expect(customerRewards.data).toEqual([]);
  });


  it('Should throw a error for a Technical Failure', () => {
    const params = {
      customerAccountNumber: 123456,
      portfolio: {
        customerSubscriptions: [],
      },
      eligibilityService: mockTechnicalError,
    };
    expect(params.eligibilityService).toThrow(constants.TECHNICAL_FAILURE_EXCEPTION);
  });

  it('Should throw a error for an Invalid Account Number', () => {
    const params = {
      customerAccountNumber: 123456,
      portfolio: {
        customerSubscriptions: [],
      },
      eligibilityService: mockInvalidAccountError,
    };
    expect(params.eligibilityService).toThrow(constants.INVALID_ACCOUNT_NUMBER_EXCEPTION);
  });

  it('Should set invalidAccountNumber to true for an Invalid Account Number', () => {
    const customerRewards = redeemService(invalidAccountNumberErrorParams());
    expect(customerRewards.invalidAccountNumber).toBeTruthy();
  });

  it('Should return no rewards results for an Invalid Account Number', () => {
    const customerRewards = redeemService(invalidAccountNumberErrorParams());
    expect(customerRewards.data.length).toBe(0);
    expect(customerRewards.data).toEqual([]);
  });

  it('Should return no rewards for a eligible customer subscribed to KIDS channel only', () => {
    const customerRewards = redeemService(
      eligibileCustomerAndSubscriptionInfo(constants.KIDS)
    );
    expect(customerRewards.data.length).toBe(0);
    expect(customerRewards.data).toEqual([]);
  });

  it('Should return no rewards for a eligible customer subscribed to NEWS channel only', () => {
    const customerRewards = redeemService(
      eligibileCustomerAndSubscriptionInfo(constants.NEWS)
    );
    expect(customerRewards.data.length).toBe(0);
    expect(customerRewards.data).toEqual([]);
  });

  it('Should return "Champions League Final Ticket" reward for a eligible customer subscribed to SPORTS channel only', () => {
    const customerRewards = redeemService(
      eligibileCustomerAndSubscriptionInfo([constants.SPORTS])
    );
    expect(customerRewards.data.length).toBe(1);
    expect(customerRewards.data).toContain(
      constants.CHAMPIONS_LEAGUE_FINAL_TICKET
    );
  });

  it('Should return "Karaoke Pro Microphone" reward for a eligible customer subscribed to MUSIC channel only', () => {
    const customerRewards = redeemService(
      eligibileCustomerAndSubscriptionInfo([constants.MUSIC])
    );
    expect(customerRewards.data.length).toBe(1);
    expect(customerRewards.data).toContain(constants.KARAOKE_PRO_MICROPHONE);
  });

  it('Should return "Champions League Final Ticket" reward for a eligible customer subscribed to MOVIES channel only', () => {
    const customerRewards = redeemService(
      eligibileCustomerAndSubscriptionInfo([constants.MOVIES])
    );
    expect(customerRewards.data.length).toBe(1);
    expect(customerRewards.data).toContain(
      constants.PIRATES_OF_THE_CARIBEAN_COLLECTION
    );
  });

  it('Should return "Champions League Final Ticket" and "Karaoke Pro Microphone" rewards for a eligible customer subscribed to SPORTS and MUSIC channels', () => {
    const customerRewards = redeemService(
      eligibileCustomerAndSubscriptionInfo([
        constants.SPORTS,
        constants.MUSIC,
      ])
    );
    expect(customerRewards.data.length).toBe(2);
    expect(customerRewards.data).toContain(
      constants.CHAMPIONS_LEAGUE_FINAL_TICKET,
      constants.KARAOKE_PRO_MICROPHONE
    );
  });

  it('Should return "Champions League Final Ticket" and "Pirates of the Caribean Collection" rewards for a eligible customer subscribed to SPORTS and MOVIES channels', () => {
    const customerRewards = redeemService(
      eligibileCustomerAndSubscriptionInfo([
        constants.SPORTS,
        constants.MOVIES,
      ])
    );
    expect(customerRewards.data.length).toBe(2);
    expect(customerRewards.data).toContain(
      constants.CHAMPIONS_LEAGUE_FINAL_TICKET,
      constants.PIRATES_OF_THE_CARIBEAN_COLLECTION
    );
  });

  it('Should return "Pirates of the Caribean Collection" and "Karaoke Pro Microphone" rewards for a eligible customer subscribed to MOVIES and MUSIC channels', () => {
    const customerRewards = redeemService(
      eligibileCustomerAndSubscriptionInfo([
        constants.MOVIES,
        constants.MUSIC,
      ])
    );
    expect(customerRewards.data.length).toBe(2);
    expect(customerRewards.data).toContain(
      constants.PIRATES_OF_THE_CARIBEAN_COLLECTION,
      constants.KARAOKE_PRO_MICROPHONE
    );
  });

  it('Should return all rewards for a eligible customer subscribed to ALL channels', () => {
    const customerRewards = redeemService(
      eligibileCustomerAndSubscriptionInfo([
        constants.SPORTS,
        constants.MUSIC,
        constants.MOVIES,
      ])
    );
    expect(customerRewards.data.length).toBe(3);
    expect(customerRewards.data).toContain(
      constants.CHAMPIONS_LEAGUE_FINAL_TICKET,
      constants.KARAOKE_PRO_MICROPHONE,
      constants.PIRATES_OF_THE_CARIBEAN_COLLECTION
    );
  });
});