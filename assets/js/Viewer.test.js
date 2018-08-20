import React from 'react';
import { mount } from 'enzyme';

import Viewer from './Viewer';

test('Shows all signs for a line', () => {
  const currentTime = Date.now();
  const line = 'Red';
  const fresh = new Date(currentTime + 5000).toLocaleString();
  const signs = { signID: [{ text: 'Alewife 1 min', duration: fresh }, { text: 'Alewife 3 min', duration: fresh }] };

  const wrapper = mount(React.createElement(Viewer, { signs, currentTime, line }, null));

  expect(wrapper.text()).toMatch('RALE-cRALE-mRDAV-mRDAV-nRDAV-sRPOR-mRPOR-nRPOR-sRHAR-mRHAR-nRHAR-sRCEN-nRCEN-sRKEN-nRKEN-sRMGH-nRMGH-sRPRK-nRPRK-sRPRK-cRDTC-nRDTC-sRSOU-mRSOU-nRSOU-sSSOU-mRBRO-mRBRO-nRBRO-sRAND-mRAND-nRAND-sRSAV-mRSAV-nRSAV-sRFIE-mRFIE-nRFIE-sRSHA-mRSHA-nRSHA-sRASH-mRASH-nRNQU-mRNQU-nRNQU-sRWOL-mRWOL-nRWOL-sRQUC-mRQUC-nRQUC-sRQUA-mRQUA-nRQUA-sRBRA-cRBRA-mRJFK-wRJFK-sRJFK-eRJFK-nRJFK-m');
  expect(wrapper.text()).not.toMatch('OOAK');
});
