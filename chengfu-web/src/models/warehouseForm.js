import { createFormModel } from '../utils/models';
import * as WarehouseApi from '../services/warehouse';

export default createFormModel({
  namespace: 'warehouseForm',
  fetch: WarehouseApi.getInfo,
  save: WarehouseApi.save,
  redirectUrl: '/sys/warehouse-list',
});
