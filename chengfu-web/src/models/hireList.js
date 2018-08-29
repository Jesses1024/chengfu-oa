import { createListModel } from '../utils/models';
import * as HireApi from '../services/hire';

export default createListModel({
  namespace: 'hireList',
  fetch: HireApi.getList,
});
