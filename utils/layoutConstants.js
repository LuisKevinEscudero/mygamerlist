// layoutConstants.js
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// 🔹 Espaciados y márgenes
export const paddingContainer = windowWidth * 0.04;
export const marginVerticalSection = windowHeight * 0.02;
export const marginBetweenButtons = windowWidth * 0.015;

// 🔹 Tamaños de botones y FAB
export const buttonHeight = windowHeight * 0.06;
export const fabSize = windowWidth * 0.12;

// 🔹 Tamaños de fuente
export const titleFontSize = windowWidth * 0.06;
export const buttonFontSize = windowWidth * 0.04;
export const filterOptionFontSize = windowWidth * 0.045;

// 🔹 Inputs
export const inputWidth = windowWidth * 0.35;
export const inputHeight = buttonHeight;
export const inputPadding = windowWidth * 0.02;

// 🔹 Menús desplegables
export const filterMenuWidth = windowWidth * 0.35;
export const filterMenuBottom = windowHeight * 0.15;

// 🔹 Sombra / elevación
export const shadowOffsetY = windowHeight * 0.002;
export const shadowRadius = windowWidth * 0.01;

// 🔹 Cards
export const cardMargin = windowWidth * 0.04;
export const cardPadding = windowWidth * 0.04;
export const cardBorderRadius = windowWidth * 0.02;


