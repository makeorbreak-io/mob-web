// styles
import "assets/reset.css";
import "react-select/dist/react-select.css";
import "styles/application";

import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.js$/), module);
