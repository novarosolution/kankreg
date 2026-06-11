import React, { useEffect, useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { prefetchDisplayImages } from "../../utils/image";
import { buildProcessSectionDefaults } from "../../content/processHomeContent";
import { resolveProcessDisplay } from "../../utils/homeViewMedia";
import useProcessJourneyScroll from "../../hooks/useProcessJourneyScroll";
import useReducedMotion from "../../hooks/useReducedMotion";
import { useKankregLayout } from "../../theme/kankregBreakpoints";
import { KANKREG_CHROME } from "../../theme/kankregWeb";
import { injectProcessCinemaStyles, PROCESS_CINEMA_ROOT_CLASS } from "./processCinemaStyles";
import { HtmlDiv, HtmlH1, HtmlH3, HtmlImg, HtmlP, HtmlSpan, toImageSrc } from "./compareWebDom";

injectProcessCinemaStyles();

function StepFrame({ step, priority = false }) {
  const src = toImageSrc(step.image, { width: priority ? 1200 : 960 });
  const fit = step.imageFit === "contain" ? "contain" : "cover";
  const position = step.imagePosition || "top center";

  return (
    <HtmlDiv className="kankreg-process-frame">
      {src ? (
        <HtmlImg
          src={src}
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          style={{ objectFit: fit, objectPosition: position }}
        />
      ) : (
        <HtmlDiv className="kankreg-process-frame-fallback" />
      )}
      <HtmlDiv className="kankreg-process-scrim" />
      <HtmlDiv className="kankreg-process-frame-rule" />
    </HtmlDiv>
  );
}

function ProcessJourneyCinema({ content }) {
  const reducedMotion = useReducedMotion();
  const { isMobileWeb } = useKankregLayout();
  const scroll = useProcessJourneyScroll({
    stepCount: content.steps.length,
    disabled: reducedMotion,
  });

  const chapterLabel = [content.filmLabel, content.journeyLabel].filter(Boolean).join(" — ");
  const rootClass = [
    PROCESS_CINEMA_ROOT_CLASS,
    reducedMotion ? "kankreg-process-static-mode" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const fullBleedStyle = isMobileWeb ? styles.fullBleedMobile : styles.fullBleedDesktop;

  useEffect(() => {
    prefetchDisplayImages(
      content.steps.map((step) => step.image),
      { eagerCount: 2 }
    );
  }, [content.steps]);

  return (
    <View style={[styles.shell, fullBleedStyle]}>
      <HtmlDiv id="home-process" className={rootClass}>
        <HtmlDiv className="kankreg-process-inner">
          <HtmlDiv className="kankreg-process-prologue">
            {chapterLabel ? (
              <HtmlSpan className="kankreg-process-chapter">{chapterLabel}</HtmlSpan>
            ) : null}
            <HtmlH1 className="kankreg-process-title">{content.title}</HtmlH1>
            {content.subtitle ? (
              <HtmlP className="kankreg-process-subtitle">{content.subtitle}</HtmlP>
            ) : null}
            {content.openingLine ? (
              <HtmlP className="kankreg-process-opening">{content.openingLine}</HtmlP>
            ) : null}
            <HtmlDiv className="kankreg-process-hairline" />
            {content.journeyLabel ? (
              <HtmlDiv className="kankreg-process-journey-chip">{content.journeyLabel}</HtmlDiv>
            ) : null}
          </HtmlDiv>

          <HtmlDiv ref={scroll.bodyRef} className="kankreg-process-body">
            <HtmlDiv className="kankreg-process-spine">
              <HtmlDiv ref={scroll.spineTrackRef} className="kankreg-process-spine-track">
                <HtmlDiv ref={scroll.spineFillRef} className="kankreg-process-spine-fill" />
                <HtmlDiv className="kankreg-process-spine-nodes">
                  {content.steps.map((step, index) => (
                    <HtmlSpan
                      key={step.id || step.step}
                      ref={scroll.setNodeRef(index)}
                      className={index === 0 ? "kankreg-process-node kankreg-process-node-on" : "kankreg-process-node"}
                    >
                      {scroll.roman[index] || step.step}
                    </HtmlSpan>
                  ))}
                </HtmlDiv>
              </HtmlDiv>
            </HtmlDiv>

            <HtmlDiv className="kankreg-process-panels">
              {content.steps.map((step, index) => (
                <HtmlDiv
                  key={step.id || step.step}
                  ref={scroll.setPanelRef(index)}
                  className={index === 0 ? "kankreg-process-panel kankreg-process-panel-on" : "kankreg-process-panel"}
                >
                  <HtmlDiv className="kankreg-process-panel-meta">
                    <HtmlSpan>
                      Step {String(step.step).padStart(2, "0")} · {content.eyebrow}
                    </HtmlSpan>
                    <HtmlSpan className="kankreg-process-panel-num">
                      {scroll.roman[index] || step.step}
                    </HtmlSpan>
                  </HtmlDiv>
                  <StepFrame step={step} priority={index < 2} />
                  <HtmlDiv className="kankreg-process-copy">
                    <HtmlH3>{step.title}</HtmlH3>
                    {step.description ? <HtmlP>{step.description}</HtmlP> : null}
                  </HtmlDiv>
                </HtmlDiv>
              ))}
            </HtmlDiv>
          </HtmlDiv>
        </HtmlDiv>
      </HtmlDiv>
    </View>
  );
}

/** Web: premium film-timeline process journey. */
export default function HomeProcessJourneyWeb({ processSection }) {
  const content = useMemo(() => {
    return (
      resolveProcessDisplay(processSection) ??
      resolveProcessDisplay(buildProcessSectionDefaults())
    );
  }, [processSection]);

  if (!content) return null;

  return <ProcessJourneyCinema content={content} />;
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
    alignSelf: "stretch",
    backgroundColor: KANKREG_CHROME.cream,
  },
  fullBleedMobile: {
    width: "100%",
    maxWidth: "100%",
  },
  fullBleedDesktop: Platform.select({
    web: {
      width: "100vw",
      maxWidth: "100vw",
      marginLeft: "calc(50% - 50vw)",
      marginRight: "calc(50% - 50vw)",
      alignSelf: "center",
    },
    default: {},
  }),
});
