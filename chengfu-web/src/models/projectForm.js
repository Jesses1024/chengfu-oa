import { createFormModel } from '../utils/models';
import * as ProjectsAPi from '../services/projects';

export default createFormModel({
  namespace: 'projectForm',
  fetch: ProjectsAPi.getInfo,
  save: ProjectsAPi.save,
  redirectUrl: '/project/list',
});
