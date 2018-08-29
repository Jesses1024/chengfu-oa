import React from 'react';
import Authorized from './Authorized';
import { hasPerms } from './utils';

export default ({ perms, children, ...rest }) =>
  (<Authorized {...rest} authority={hasPerms(perms)}>{children}</Authorized>);
