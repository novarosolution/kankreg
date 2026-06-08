import React, { useCallback, useRef } from "react";
import { Platform, StyleSheet } from "react-native";
import CustomerScreenShell from "../components/CustomerScreenShell";
import BottomNavBar from "../components/BottomNavBar";
import KankregScrollPage from "../components/kankreg/KankregScrollPage";
import { KankregPageWrap } from "../components/kankreg/KankregPageChrome";
import KankregCustomerPageHeader from "../components/kankreg/KankregCustomerPageHeader";
import KankregTrustStrip from "../components/kankreg/KankregTrustStrip";
import HomeTestimonials from "../components/home/HomeTestimonials";
import SectionReveal from "../components/motion/SectionReveal";
import {
  AboutCraftTimeline,
  AboutCtaBand,
  AboutEditorialHero,
  AboutMissionBlock,
  AboutPillarsGrid,
} from "../components/about/AboutPageSections";
import { ABOUT_SCREEN_UI } from "../content/appContent";
import { useTheme } from "../context/ThemeContext";
import { useKankregLayout } from "../theme/kankregBreakpoints";
import { KANKREG_PAGE_SECTION_GAP } from "../theme/kankregScreenStyles";
import { customerScrollFill } from "../theme/screenLayout";

export default function AboutScreen({ navigation }) {
  const { colors: c, isDark } = useTheme();
  const { isMd, showMobileWebTabBar } = useKankregLayout();
  const craftRef = useRef(null);
  const copy = ABOUT_SCREEN_UI.header;
  const showWebHero = Platform.OS === "web" && isMd;
  const showTestimonials = Platform.OS === "web" && isMd;

  const scrollToCraft = useCallback(() => {
    if (Platform.OS === "web" && typeof globalThis?.document !== "undefined") {
      const el = globalThis.document.getElementById("about-craft");
      el?.scrollIntoView?.({ behavior: "smooth", block: "start" });
      return;
    }
    craftRef.current?.measure?.((_x, _y, _w, _h, _px, py) => {
      // native fallback — parent scroll handles via nativeID where supported
    });
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
            showHairline={showWebHero}
          />

          {showWebHero ? (
            <SectionReveal preset="fade-up" delay={0}>
              <AboutEditorialHero navigation={navigation} onScrollToCraft={scrollToCraft} />
            </SectionReveal>
          ) : null}

          <SectionReveal preset="fade-up" delay={80}>
            <AboutMissionBlock />
          </SectionReveal>

          <SectionReveal preset="fade-up" delay={120}>
            <AboutPillarsGrid />
          </SectionReveal>

          <SectionReveal preset="fade-up" delay={160}>
            <KankregTrustStrip />
          </SectionReveal>

          <SectionReveal preset="fade-up" delay={200}>
            <AboutCraftTimeline sectionRef={craftRef} />
          </SectionReveal>

          {showTestimonials ? (
            <SectionReveal preset="fade-up" delay={240}>
              <HomeTestimonials c={c} isDark={isDark} />
            </SectionReveal>
          ) : null}

          <SectionReveal preset="fade-up" delay={280}>
            <AboutCtaBand navigation={navigation} />
          </SectionReveal>
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
