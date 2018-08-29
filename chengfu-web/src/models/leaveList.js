import { createListModel } from '../utils/models';
import * as LeaveAPi from '../services/leave';

export default createListModel({
  namespace: 'leaveList',
  fetch: LeaveAPi.getList,
});
