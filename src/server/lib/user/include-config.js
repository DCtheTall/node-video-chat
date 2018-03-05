export default models => [
  {
    model: models.contact_request,
    as: 'contactRequestsSent',
    include: [{
      model: models.user,
      as: 'recipient',
    }],
  },
  {
    model: models.contact_request,
    as: 'contactRequestsReceived',
    include: [{
      model: models.user,
      as: 'sender',
    }],
  },
];
