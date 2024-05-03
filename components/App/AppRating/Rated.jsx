import React from "react";
import Image from "next/image";
import PropTypes from "prop-types";

import HalfStar from "./star-half-filled.png";
import StarGray from "./StarGray.png";
import StarYellow from "./StarYellow.png";

export default function Rated({ data }) {
  const rated = data.rate;

  const fixRated =
    rated > Math.floor(rated) && rated < Math.ceil(rated)
      ? Math.floor(rated) + 0.5
      : rated;

  const starArray = Array.from({ length: Math.floor(fixRated) }, (_, index) => (
    <Image
      className=" w-3 h-3 md:w-4 md:h-4"
      key={index}
      src={StarYellow}
      width="auto"
      height="auto"
      alt="StarYellow"
    />
  ));

  const starLeft = Array.from(
    { length: 5 - Math.ceil(fixRated) },
    (_, index) => (
      <Image
        className=" w-3 h-3 md:w-4 md:h-4"
        key={index}
        src={StarGray}
        width="auto"
        height="auto"
        alt="StarGray"
      />
    ),
  );

  const halfStar =
    Math.ceil(fixRated) - fixRated === 0.5 ? (
      <Image
        className=" w-3 h-3 md:w-4 md:h-4"
        src={HalfStar}
        width="auto"
        height="auto"
        alt="HalfStar"
      />
    ) : null;

  return (
    <div className="flex flex-row items-center">
      {starArray}
      {halfStar}
      {starLeft}
    </div>
  );
}

Rated.propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
};