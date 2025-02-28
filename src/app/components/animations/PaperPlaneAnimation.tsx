import Lottie from "lottie-react";
import animationData from "./paperPlaneAnimation.json";
import { CSSProperties, memo } from "react";
import { replaceColor } from "lottie-colorify";
import Color from "color";

// This is essential, as the animation JSON file contains hardcoded colors that we are finding and replacing
const ANIMATION_JSON_COLORS = {
    accent: [14, 157, 43],
    accentShade1: [161, 190, 167],
    accentShade2: [219, 229, 221],
    background: [255, 255, 255],
};

const PaperPlaneAnimation = memo(({ style }: { style?: CSSProperties }) => {
    const primaryAccent = new Color("#060735");
    const secondaryAccent = new Color("#E1B45B");
    const backgroundColor = new Color("#FFFFFF");

    const accentColorShade1 = primaryAccent.mix(backgroundColor, 0.6);
    const accentColorShade2 = secondaryAccent.mix(backgroundColor, 0.3);

    const colorCorrectedAnimationData = [
        { color: ANIMATION_JSON_COLORS.accent, newColor: primaryAccent },
        { color: ANIMATION_JSON_COLORS.accentShade1, newColor: accentColorShade1 },
        { color: ANIMATION_JSON_COLORS.accentShade2, newColor: accentColorShade2 },
        { color: ANIMATION_JSON_COLORS.background, newColor: backgroundColor },
    ].reduce((acc, step) => {
        return replaceColor(step.color, step.newColor.hex(), acc);
    }, animationData);

    return (
        <Lottie
            animationData={colorCorrectedAnimationData}
            loop
            style={{ height: "150px", width: "150px", ...style }}
        />
    );
});

export { PaperPlaneAnimation };
