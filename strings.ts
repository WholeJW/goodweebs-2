import toTitleCase from "title";

type StringNames =
  | "AniListAuthAttribution"
  | "tagline"
  | "logIn"
  | "signUp"
  | "anime"
  | "discover"
  | "profile"
  | "details";

type StringDefinitions = {
  [p in StringNames]: string;
};

export enum StringCase {
  TITLE,
  UPPER,
  LOWER,
  SOURCE,
}

export const en_us: StringDefinitions = {
  AniListAuthAttribution: "via AniList",
  tagline: "An anime tracking app powered by AniList and Expo.",
  logIn: "Log in",
  signUp: "Sign up",
  anime: "anime",
  discover: "discover",
  profile: "profile",
  details: "details",
};

export function getString(
  stringName: StringNames,
  stringCase: StringCase = StringCase.SOURCE
) {
  const stringText = en_us[stringName];

  switch (stringCase) {
    case StringCase.UPPER:
      return stringText.toLocaleUpperCase();
    case StringCase.LOWER:
      return stringText.toLocaleLowerCase();
    case StringCase.TITLE:
      return toTitleCase(stringText);
    default:
      return stringText;
  }
}