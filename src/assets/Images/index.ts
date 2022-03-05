import operatorPlus from "./operator-plus.png";
import operatorPlusGrey from "./operator-plus-grey.png";
import operatorMinus from "./operator-minus.png";
import operatorMinusGrey from "./operator-minus-grey.png";
import operatorTimes from "./operator-cross.png";
import operatorTimesGrey from "./operator-cross-grey.png";
import operatorEquals from "./operator-equals.png";
import operatorEqualsGrey from "./operator-equals-grey.png";
import grid from "./grid.png";

const Images = {
  operatorPlus,
  operatorPlusGrey,
  operatorMinus,
  operatorMinusGrey,
  operatorTimes,
  operatorTimesGrey,
  operatorEquals,
  operatorEqualsGrey,
  grid,
};

export default Images;
export type ImageKeys = keyof typeof Images;

export const OperatorIcons = {
  "+": { active: Images.operatorPlus, grey: Images.operatorPlusGrey },
  "-": { active: Images.operatorMinus, grey: Images.operatorMinusGrey },
  "*": { active: Images.operatorTimes, grey: Images.operatorTimesGrey },
  "=": { active: Images.operatorEquals, grey: Images.operatorEqualsGrey },
};
