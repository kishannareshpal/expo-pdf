import { atom } from "jotai";

export type ExampleKey = string;
export const exampleSelectorAtom = atom<ExampleKey | null>(null);
