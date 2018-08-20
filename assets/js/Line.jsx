import React from 'react';
import PropTypes from 'prop-types';
import Sign from './Sign';

function lineSigns(line) {
  if (line == "") {
    return []
  }
  if(line == "Mattapan") {
    return ["MCED-s", "MCED-n",
      "MBUT-c",
      "MMIL-s", "MMIL-n",
      "MCEN-s", "MCEN-n",
      "MVAL-s", "MVAL-n",
      "MCAP-s", "MCAP-n"]
  }
  else if(line == "SL3") {
    return ["SCHS-w",
      "SBSQ-w", "SBSQ-e",
      "SBOX-w", "SBOX-e",
      "SEAV-w", "SEAV-e",
      "SSOU-e", "RSOU-m",
      "SCOU-e", "SCOU-m",
      "SWTC-e", "SWTC-m"]
  }
  else if (line == "Blue") {
    return ["BWON-w", "BWON-m",
      "BREV-e", "BREV-m", "BREV-w",
      "BBEA-e", "BBEA-w",
      "BSUF-e", "BSUF-w",
      "BORH-e", "BORH-m", "BORH-w",
      "BWOO-e", "BWOO-m", "BWOO-w",
      "BAIR-e", "BAIR-w",
      "BMAV-e", "BMAV-w",
      "BAQU-e", "BAQU-m", "BAQU-w",
      "BSTA-e", "BSTA-m", "BSTA-w",
      "BGOV-e", "BGOV-m", "BGOV-w",
      "BBOW-e", "BBOW-m"]
  }
  else if (line == "Orange") {
    return ["OOAK-m", "OOAK-e", "OOAK-n", "OOAK-s",
      "OMAL-m",
      "OWEL-m", "OWEL-n", "OWEL-s",
      "OASQ-m", "OASQ-n", "OASQ-s",
      "OSUL-m", "OSUL-n", "OSUL-s",
      "OCOM-m", "OCOM-n", "OCOM-s",
      "ONST-n", "ONST-s", "ONST-c", "ONST-m",
      "OHAY-m", "OHAY-n", "OHAY-s",
      "OSTN-m", "OSTN-n", "OSTS-s",
      "ODTN-n", "ODTS-s",
      "OCHN-m", "OCHS-m", "OCHN-n", "OCHS-s",
      "ONEM-m", "ONEM-n", "ONEM-s",
      "OBAC-m", "OBAC-n", "OBAC-s",
      "OMAS-m", "OMAS-n", "OMAS-s",
      "ORUG-n", "ORUG-s", "ORUG-c", "ORUG-m", "SRUG-m",
      "OROX-m", "OROX-n", "OROX-s",
      "OJAC-m", "OJAC-n", "OJAC-s",
      "OSTO-m", "OSTO-n", "OSTO-s",
      "OGRE-m", "OGRE-n", "OGRE-s",
      "OFOR-m", "OFOR-n", "OFOR-s", "SFOR-m"]
  }
  else if (line == "Red") {
    return ["RALE-c", "RALE-m",
      "RDAV-m", "RDAV-n", "RDAV-s",
      "RPOR-m", "RPOR-n", "RPOR-s",
      "RHAR-m", "RHAR-n", "RHAR-s",
      "RCEN-n", "RCEN-s",
      "RKEN-n", "RKEN-s",
      "RMGH-n", "RMGH-s",
      "RPRK-n", "RPRK-s", "RPRK-c",
      "RDTC-n", "RDTC-s",
      "RSOU-m", "RSOU-n", "RSOU-s",
      "SSOU-m",
      "RBRO-m", "RBRO-n", "RBRO-s",
      "RAND-m", "RAND-n", "RAND-s",
      "RSAV-m", "RSAV-n", "RSAV-s",
      "RFIE-m", "RFIE-n", "RFIE-s",
      "RSHA-m", "RSHA-n", "RSHA-s",
      "RASH-m", "RASH-n",
      "RNQU-m", "RNQU-n", "RNQU-s",
      "RWOL-m", "RWOL-n", "RWOL-s",
      "RQUC-m", "RQUC-n", "RQUC-s",
      "RQUA-m", "RQUA-n", "RQUA-s",
      "RBRA-c", "RBRA-m",
      "RJFK-w", "RJFK-s", "RJFK-e", "RJFK-n", "RJFK-m"]
  }
  return ["MCED-s", "MCED-n",
    "MBUT-c",
    "MMIL-s", "MMIL-n",
    "MCEN-s", "MCEN-n",
    "MVAL-s", "MVAL-n",
    "MCAP-s", "MCAP-n"]
}

function Line({ signs, currentTime, line }) {
  const signIds = lineSigns(line);

  return (
    <div>
      {
        signIds.map((key) => {
          const lines = signs[key];
          let lineOne, lineTwo, lineOneDuration, lineTwoDuration;
          if (lines != undefined) {
            lineOne = lines[0].text;
            lineTwo = lines[1].text;
            lineOneDuration = lines[0].duration;
            lineTwoDuration = lines[1].duration;
          }
          else {
            lineOne = "";
            lineTwo = "";
            lineOneDuration = "0";
            lineTwoDuration = "0";
          }
          return (
            <Sign
              key={key}
              signId={key}
              lineOne={lineOne}
              lineOneDuration={lineOneDuration}
              lineTwo={lineTwo}
              lineTwoDuration={lineTwoDuration}
              currentTime={currentTime}
            />
          );
        })
      }
    </div>
  );
}

Line.propTypes = {
  signs: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string, duration: PropTypes.string,
  }))).isRequired,
  currentTime: PropTypes.number.isRequired,
};

export default Line;
