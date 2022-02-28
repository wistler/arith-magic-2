import operatorPlus from "./Images/operator-plus.png";
import operatorPlusGrey from "./Images/operator-plus-grey.png";
import operatorMinus from "./Images/operator-minus.png";
import operatorMinusGrey from "./Images/operator-minus-grey.png";
import operatorTimes from "./Images/operator-cross.png";
import operatorTimesGrey from "./Images/operator-cross-grey.png";
import operatorEquals from "./Images/operator-equals.png";
import operatorEqualsGrey from "./Images/operator-equals.png";
import grid from "./Images/grid.png";

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
