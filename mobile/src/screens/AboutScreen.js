import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import CustomerScreenShell from "../components/CustomerScreenShell";
import BottomNavBar from "../components/BottomNavBar";
import KankregScrollPage from "../components/kankreg/KankregScrollPage";
import { KankregPageWrap } from "../components/kankreg/KankregPageChrome";
import KankregCustomerPageHeader from "../components/kankreg/KankregCustomerPageHeader";
import SectionReveal from "../components/motion/SectionReveal";
import {
  AboutCraftTimeline,
  AboutCtaBand,
  AboutMissionBlock,
  AboutPillarsGrid,
} from "../components/about/AboutPageSections";
import { ABOUT_SCREEN_UI } from "../content/appContent";
import AboutKankregMedia from "../components/home/AboutKankregMedia";
import { getHomeViewConfig } from "../services/productService";
import { hasAboutMedia } from "../utils/homeViewMedia";
import { useKankregLayout } from "../theme/kankregBreakpoints";
import { KANKREG_PAGE_SECTION_GAP } from "../theme/kankregScreenStyles";
import { customerScrollFill } from "../theme/screenLayout";

export default function AboutScreen({ navigation }) {
  const { isMd, showMobileWebTabBar } = useKankregLayout();
  const craftRef = useRef(null);
  const copy = ABOUT_SCREEN_UI.header;
  const isWeb = Platform.OS === "web";
  const [aboutSection, setAboutSection] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getHomeViewConfig()
      .then((config) => {
        if (!cancelled) setAboutSection(config?.aboutSection || null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <CustomerScreenShell>
      <KankregScrollPage scrollVariant="page" style={customerScrollFill}>
        <KankregPageWrap style={styles.wrap}>
          <KankregCustomerPageHeader
            eyebrow={copy.eyebrow}
            title={copy.title}
            subtitle={copy.subtitle}
            navigation={navigation}
            showBack={Platform.OS !== "web" || !isMd}
            index={1}
            showHairline={false}
          />

          {isWeb && aboutSection && hasAboutMedia(aboutSection) ? (
            <SectionReveal preset="fade-up" delay={60}>
              <AboutKankregMedia aboutSection={aboutSection} navigation={navigation} showCta={false} compact />
            </SectionReveal>
          ) : null}

          {!isWeb ? (
            <>
              <SectionReveal preset="fade-up" delay={80}>
                <AboutMissionBlock />
              </SectionReveal>
              <SectionReveal preset="fade-up" delay={120}>
                <AboutPillarsGrid />
              </SectionReveal>
            </>
          ) : null}

          <SectionReveal preset="fade-up" delay={200}>
            <AboutCraftTimeline sectionRef={craftRef} />
          </SectionReveal>

          {Platform.OS !== "web" ? (
            <SectionReveal preset="fade-up" delay={280}>
              <AboutCtaBand navigation={navigation} />
            </SectionReveal>
          ) : null}
        </KankregPageWrap>
      </KankregScrollPage>
      {(Platform.OS !== "web" || showMobileWebTabBar) && <BottomNavBar />}
    </CustomerScreenShell>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: KANKREG_PAGE_SECTION_GAP,
    paddingBottom: 8,
  },
});
