import { createListModel } from '../utils/models';
import * as ShelfApi from '../services/shelf';

export default createListModel({
  namespace: 'shelfList',
  fetch: ShelfApi.getList,
});
