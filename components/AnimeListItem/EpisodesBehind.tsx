import React from "react";
import { StyleSheet, Platform, View, Text } from "react-native";

import { badgeRed, white, black } from "yep/colors";
import { Manrope } from "yep/typefaces";

type EpisodesBehindProps = {
  count: number;
};

export function EpisodesBehind({ count }: EpisodesBehindProps) {
  if (count <= 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: badgeRed,
    borderRadius: 16,
    height: 16,
    justifyContent: "center",
    position: "absolute",
    right: 4,
    shadowColor: black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    top: 4,
    width: 16,
  },
  text: {
    color: white,
    fontFamily: Manrope.semiBold,
    fontSize: 8,
    marginTop: Platform.OS === "android" ? -1 : undefined,
    textAlign: "center",
    textAlignVertical: "center",
  },
});