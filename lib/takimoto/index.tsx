import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  forwardRef,
  FC,
  Ref,
} from "react";
import {
  ViewStyle,
  ScaledSize,
  Dimensions,
  ViewProps,
  View,
  TextStyle,
  TextProps,
  Text,
  TouchableOpacityProps,
  TouchableOpacity,
  ImageStyle,
  ImageProps,
  Image,
  ImageBackground,
  ImageBackgroundProps,
  TextInput,
  TextInputProps,
  ScrollView,
  ScrollViewProps,
  FlatList,
  FlatListProps,
} from "react-native";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";

type DeclarativeWindowSizeStyles<StyleT> = {
  "<"?: {
    [value: number]: StyleT;
  };
  "<="?: {
    [value: number]: StyleT;
  };
  ">"?: {
    [value: number]: StyleT;
  };
  ">="?: {
    [value: number]: StyleT;
  };
  "="?: {
    [value: number]: StyleT;
  };
};

type DynamicKeys<StyleT> = StyleT & {
  //   hover?: StyleT; // TODO
  //   active?: StyleT; // TODO
  //   focused?: StyleT; // TODO
  //   darkTheme?: StyleT; // TODO
  //   lightTheme?: StyleT; // TODO
  //   portrait?: StyleT; // TODO
  //   landscape?: StyleT; // TODO
  whenWidth?: DeclarativeWindowSizeStyles<StyleT>;
  whenHeight?: DeclarativeWindowSizeStyles<StyleT>;
};

type DimensionsChangeData = {
  window: ScaledSize;
  screen: ScaledSize;
};

function useTakimoto<StyleT>(style: DynamicKeys<StyleT>) {
  const [windowSize, setWindowSize] = useState<ScaledSize>(
    Dimensions.get("window")
  );

  const onDimensionsChange = useCallback(
    ({ window }: DimensionsChangeData) => setWindowSize(window),
    []
  );

  useEffect(function manageDimensionsEventListeners() {
    Dimensions.addEventListener("change", onDimensionsChange);

    return () => Dimensions.removeEventListener("change", onDimensionsChange);
  }, []);

  const styles = useMemo(() => {
    const styleCopy = { ...style };
    const styleWithoutExtras = (() => {
      const s = { ...styleCopy };
      delete s.whenHeight;
      delete s.whenWidth;
      return s as StyleT;
    })();

    const stylesArray = [styleWithoutExtras];

    for (const operator in styleCopy.whenHeight) {
      if (styleCopy.whenHeight.hasOwnProperty(operator)) {
        const castedOperator = operator as keyof DeclarativeWindowSizeStyles<
          StyleT
        >;
        const breakpointBasedStyles = styleCopy.whenHeight[castedOperator];

        if (breakpointBasedStyles) {
          for (const breakpoint in breakpointBasedStyles) {
            const castedBreakpoint = (breakpoint as unknown) as keyof typeof breakpointBasedStyles;
            switch (castedOperator) {
              case "<":
                if (windowSize.height < castedBreakpoint)
                  stylesArray.push(breakpointBasedStyles[castedBreakpoint]);
                break;
              case "<=":
                if (windowSize.height <= castedBreakpoint)
                  stylesArray.push(breakpointBasedStyles[castedBreakpoint]);
                break;
              case "=":
                if (windowSize.height === castedBreakpoint)
                  stylesArray.push(breakpointBasedStyles[castedBreakpoint]);
                break;
              case ">":
                if (windowSize.height > castedBreakpoint)
                  stylesArray.push(breakpointBasedStyles[castedBreakpoint]);
                break;
              case ">=":
                if (windowSize.height >= castedBreakpoint)
                  stylesArray.push(breakpointBasedStyles[castedBreakpoint]);
                break;
            }
          }
        }
      }
    }

    for (const operator in styleCopy.whenWidth) {
      if (styleCopy.whenWidth.hasOwnProperty(operator)) {
        const castedOperator = operator as keyof DeclarativeWindowSizeStyles<
          StyleT
        >;
        const breakpointBasedStyles = styleCopy.whenWidth[castedOperator];

        if (breakpointBasedStyles) {
          for (const breakpoint in breakpointBasedStyles) {
            const castedBreakpoint = (breakpoint as unknown) as keyof typeof breakpointBasedStyles;
            switch (castedOperator) {
              case "<":
                if (windowSize.width < castedBreakpoint)
                  stylesArray.push(breakpointBasedStyles[castedBreakpoint]);
                break;
              case "<=":
                if (windowSize.width <= castedBreakpoint)
                  stylesArray.push(breakpointBasedStyles[castedBreakpoint]);
                break;
              case "=":
                if (windowSize.width === castedBreakpoint)
                  stylesArray.push(breakpointBasedStyles[castedBreakpoint]);
                break;
              case ">":
                if (windowSize.width > castedBreakpoint)
                  stylesArray.push(breakpointBasedStyles[castedBreakpoint]);
                break;
              case ">=":
                if (windowSize.width >= castedBreakpoint)
                  stylesArray.push(breakpointBasedStyles[castedBreakpoint]);
                break;
            }
          }
        }
      }
    }

    return stylesArray;
  }, [windowSize]);

  return styles;
}

export const takimoto = {
  View(style: DynamicKeys<ViewStyle>): FC<ViewProps> {
    return forwardRef(function WrappedView(
      { style: styleProp, ...rest }: ViewProps,
      ref: Ref<View>
    ) {
      const styles = useTakimoto(style);

      return <View {...rest} style={[styles, styleProp]} ref={ref} />;
    });
  },
  Text(style: DynamicKeys<TextStyle>): FC<TextProps> {
    return forwardRef(function WrappedText(
      { style: styleProp, ...rest }: TextProps,
      ref: Ref<Text>
    ) {
      const styles = useTakimoto(style);

      return <Text {...rest} style={[styles, styleProp]} ref={ref} />;
    });
  },
  Image(style: DynamicKeys<ImageStyle>): FC<ImageProps> {
    return forwardRef(function WrappedImage(
      { style: styleProp, ...rest }: ImageProps,
      ref: Ref<Image>
    ) {
      const styles = useTakimoto(style);

      return <Image {...rest} style={[styles, styleProp]} ref={ref} />;
    });
  },
  TouchableOpacity(style: DynamicKeys<ViewStyle>): FC<TouchableOpacityProps> {
    return forwardRef(function WrappedTouchableOpacity(
      { style: styleProp, ...rest }: TouchableOpacityProps,
      ref: Ref<TouchableOpacity>
    ) {
      const styles = useTakimoto(style);

      return (
        <TouchableOpacity {...rest} style={[styles, styleProp]} ref={ref} />
      );
    });
  },
  LinearGradient(style: DynamicKeys<ViewStyle>): FC<LinearGradientProps> {
    return forwardRef(function WrappedLinearGradient(
      { style: styleProp, ...rest }: LinearGradientProps,
      ref: Ref<LinearGradient>
    ) {
      const styles = useTakimoto(style);

      return <LinearGradient {...rest} style={[styles, styleProp]} ref={ref} />;
    });
  },
  ImageBackground(style: DynamicKeys<ViewStyle>): FC<ImageBackgroundProps> {
    return forwardRef(function WrappedImageBackground(
      { style: styleProp, ...rest }: ImageBackgroundProps,
      ref: Ref<ImageBackground>
    ) {
      const styles = useTakimoto(style);

      return (
        <ImageBackground {...rest} style={[styles, styleProp]} ref={ref} />
      );
    });
  },
  ScrollView(
    style: DynamicKeys<ViewStyle>,
    contentContainerStyle: DynamicKeys<ViewStyle> = {}
  ): FC<ScrollViewProps> {
    return forwardRef(function WrappedScrollView(
      {
        style: styleProp,
        contentContainerStyle: contentContainerStyleProp,
        ...rest
      }: ScrollViewProps,
      ref: Ref<ScrollView>
    ) {
      const styles = useTakimoto(style);
      const contentContainerStyles = useTakimoto(contentContainerStyle);

      return (
        <ScrollView
          {...rest}
          style={[styles, styleProp]}
          contentContainerStyle={[
            contentContainerStyles,
            contentContainerStyleProp,
          ]}
          ref={ref}
        />
      );
    });
  },
  FlatList<ItemT>(
    style: DynamicKeys<ViewStyle>,
    contentContainerStyle: DynamicKeys<ViewStyle> = {}
  ): FC<FlatListProps<ItemT>> {
    return forwardRef(function WrappedFlatList(
      {
        style: styleProp,
        contentContainerStyle: contentContainerStyleProp,
        ...rest
      }: FlatListProps<ItemT>,
      ref: Ref<FlatList>
    ) {
      const styles = useTakimoto(style);
      const contentContainerStyles = useTakimoto(contentContainerStyle);

      return (
        <FlatList
          {...rest}
          style={[styles, styleProp]}
          contentContainerStyle={[
            contentContainerStyles,
            contentContainerStyleProp,
          ]}
          ref={ref}
        />
      );
    });
  },
  TextInput(style: DynamicKeys<TextStyle>): FC<TextInputProps> {
    return forwardRef(function WrappedTextInput(
      { style: styleProp, ...rest }: TextInputProps,
      ref: Ref<TextInput>
    ) {
      const styles = useTakimoto(style);

      return <TextInput {...rest} style={[styles, styleProp]} ref={ref} />;
    });
  },
};
