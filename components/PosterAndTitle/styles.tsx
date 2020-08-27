import { takimoto } from "yep/takimoto";
import { darkTheme } from "yep/themes";
import { Manrope } from "yep/typefaces";

export const Image = takimoto.Image({
  borderRadius: 4,
  overflow: "hidden",
  backgroundColor: darkTheme.listItemBackground,
});

export const Title = takimoto.Text({
  marginTop: 8,
  fontFamily: Manrope.regular,
  fontSize: 12.8,
  textAlign: "center",
  color: darkTheme.text,
});

export const Container = takimoto.TouchableOpacity({
  alignItems: "center",
});
