import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Ellipse, G, Path } from "react-native-svg";

/** Soft pastoral silhouettes for the storefront footer. */
export default function FooterPastureArt() {
  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
        <G fill="rgba(255,255,255,0.11)">
          <Circle cx="620" cy="78" r="28" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const a = (i / 8) * Math.PI * 2;
            const x1 = 620 + Math.cos(a) * 42;
            const y1 = 78 + Math.sin(a) * 42;
            const x2 = 620 + Math.cos(a) * 78;
            const y2 = 78 + Math.sin(a) * 78;
            return (
              <Path
                key={i}
                d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`}
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="2.4"
                fill="none"
              />
            );
          })}
          <Ellipse cx="180" cy="360" rx="160" ry="70" />
          <Ellipse cx="480" cy="380" rx="220" ry="80" />
          <Ellipse cx="980" cy="390" rx="280" ry="90" />
          <Ellipse cx="1320" cy="370" rx="180" ry="72" />
          <Path d="M210 340 C210 250 140 210 210 150 C250 210 300 230 300 340 Z" />
          <Path d="M290 350 C290 270 240 230 300 180 C340 230 390 250 380 350 Z" />
          <Path d="M720 360 C720 240 620 200 730 120 C820 190 900 230 880 360 Z" />
          <Path d="M1080 350 C1080 250 990 210 1090 140 C1170 210 1240 240 1220 350 Z" />
          <Path d="M1280 355 C1280 270 1220 230 1290 170 C1340 230 1400 250 1380 355 Z" />
          <Path d="M90 360 C70 330 40 320 70 290 C110 310 140 330 130 360 Z" />
          <Path d="M430 365 C410 330 370 318 410 280 C460 310 500 330 485 365 Z" />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95,
  },
});
