import { createFormModel } from '../utils/models';
import * as ShelfApi from '../services/shelf';

export default createFormModel({
  namespace: 'shelfForm',
  fetch: ShelfApi.getInfo,
  save: ShelfApi.save,
  redirectUrl: '/inventory/shelf-list',
});
