/// <reference types="nativewind/types" />

// TS 6 errors on untyped side-effect imports; Metro/NativeWind handle the CSS itself.
declare module '*.css';
