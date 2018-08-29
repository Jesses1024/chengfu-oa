import { createListModel } from '../utils/models';
import * as ReimburseApi from '../services/reimburse';

export default createListModel({
  namespace: 'reimburseList',
  fetch: ReimburseApi.getList,
});
