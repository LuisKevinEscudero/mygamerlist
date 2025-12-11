
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// 🔹 Espaciados y márgenes
const paddingContainer = windowWidth * 0.04;
const marginVerticalSection = windowHeight * 0.02;
const marginBetweenButtons = windowWidth * 0.015;

// 🔹 Tamaños de botones y FAB
const buttonHeight = windowHeight * 0.06;
const fabSize = windowWidth * 0.12;

// 🔹 Tamaños de fuente
const titleFontSize = windowWidth * 0.06;
const buttonFontSize = windowWidth * 0.04;
const filterOptionFontSize = windowWidth * 0.045;

// 🔹 Inputs
const inputWidth = windowWidth * 0.35;
const inputHeight = buttonHeight;
const inputPadding = windowWidth * 0.02;

// 🔹 Menús desplegables
const filterMenuWidth = windowWidth * 0.35;
const filterMenuBottom = windowHeight * 0.15;

// 🔹 Sombra / elevación
const shadowOffsetY = windowHeight * 0.002;
const shadowRadius = windowWidth * 0.01;

export {windowWidth,
windowHeight,
paddingContainer,
marginVerticalSection,
marginBetweenButtons,
buttonHeight,
fabSize,
titleFontSize,
buttonFontSize,
filterOptionFontSize,
filterMenuWidth,
filterMenuBottom,
shadowOffsetY,
shadowRadius
};