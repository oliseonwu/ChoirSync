// By default in typescript, the module resolution resolves the 
// import using only the files with extension: .ts .tsx or .d.ts
// So it doesn't know how to handle other types of files

declare module "*.jpg";
declare module "*.png";

declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
  };