import { atom } from "jotai";

export const exampleSelectorAtom = atom<'normal' | 'password-protected' | null>(null);
