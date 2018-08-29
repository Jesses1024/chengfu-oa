import { createFormModel } from '../utils/models';
import * as ContactApi from '../services/contact';

export default createFormModel({
  namespace: 'contactForm',
  fetch: ContactApi.getInfo,
  save: ContactApi.save,
  redirectUrl: '/contacts/list',
});
