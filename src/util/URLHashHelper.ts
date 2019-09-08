import { Coordinate } from "ol/coordinate";

export const createLocationHash = (coordinates: Coordinate) => {
  return "#x=" + coordinates[0] + ";y=" + coordinates[1];
};

export const parseCoordinatesFromURL = (): Coordinate | null => {
  const coordinateArray = window.location.hash
    .replace("#", "")
    .replace("x=", "")
    .replace("y=", "")
    .split(";");

  if (coordinateArray.length !== 2) {
    return null;
  }
  const x = parseFloat(coordinateArray[0]);
  const y = parseFloat(coordinateArray[1]);

  if (!isNaN(x) && !isNaN(y)) {
    return [x, y];
  }
  return null;
};
