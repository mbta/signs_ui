require('regenerator-runtime/runtime');

const Enzyme = require('enzyme');
const EnzymeAdapter = require('enzyme-adapter-react-16');
Enzyme.configure({ adapter: new EnzymeAdapter() });

import '@testing-library/jest-dom';
