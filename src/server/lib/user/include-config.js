import models from '../../models';

export default [
  {
    model: models.contact_request,
    as: 'contactRequestsReceived',
    include: [{
      model: models.user,
      as: 'sender',
    }],
  },
];
