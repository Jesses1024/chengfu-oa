import { createListModel } from '../utils/models';
import * as ProjectsAPi from '../services/projects';

export default createListModel({
  namespace: 'projectList',
  fetch: ProjectsAPi.getList,
});
