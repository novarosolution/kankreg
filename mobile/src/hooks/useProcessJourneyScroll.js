import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { getGsap, getScrollTrigger } from "../utils/loadGsap";
import { scheduleScrollTriggerRefresh } from "../utils/scrollTriggerRefresh";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

function asDomNode(refOrNode) {
  const node = refOrNode?.current ?? refOrNode;
  if (!node) return null;
  if (typeof Element !== "undefined" && node instanceof Element) return node;
  const host = node._nativeNode || node.node || node;
  if (typeof Element !== "undefined" && host instanceof Element) return host;
  return null;
}

function findScrollParent(element) {
  if (typeof document === "undefined" || !element?.parentElement) return null;
  let parent = element.parentElement;
  while (parent && parent !== document.documentElement) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;
    const overflow = style.overflow;
    const scrollable =
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowY === "overlay" ||
      overflow === "auto" ||
      overflow === "scroll";
    if (scrollable && parent.scrollHeight > parent.clientHeight + 2) return parent;
    if (parent.scrollHeight > parent.clientHeight + 2 && parent.clientHeight > 0) return parent;
    parent = parent.parentElement;
  }
  return null;
}

/**
 * Web process timeline — spine progress + active step (class toggles only, no opacity tweens).
 */
export default function useProcessJourneyScroll({ stepCount, disabled = false }) {
  const bodyRef = useRef(null);
  const spineFillRef = useRef(null);
  const spineTrackRef = useRef(null);
  const panelRefs = useRef([]);
  const nodeRefs = useRef([]);

  const setPanelRef = useCallback((index) => (node) => {
    panelRefs.current[index] = node;
  }, []);

  const setNodeRef = useCallback((index) => (node) => {
    nodeRefs.current[index] = node;
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || disabled || stepCount < 1) return undefined;

    let cancelled = false;
    const triggers = [];

    const cleanup = () => {
      triggers.forEach((t) => t.kill?.());
      triggers.length = 0;
    };

    const setActive = (index) => {
      panelRefs.current.forEach((ref, i) => {
        const panel = asDomNode(ref);
        if (panel) panel.classList.toggle("kankreg-process-panel-on", i === index);
      });
      nodeRefs.current.forEach((ref, i) => {
        const node = asDomNode(ref);
        if (node) node.classList.toggle("kankreg-process-node-on", i === index);
      });
      const N = stepCount;
      const progress = N <= 1 ? 1 : index / Math.max(N - 1, 1);
      const fill = asDomNode(spineFillRef);
      if (fill) fill.style.height = `${Math.min(100, progress * 100)}%`;
    };

    const ensureVisible = () => setActive(0);

    let startId;
    let retryId;
    let resizeTimer = null;

    const setup = async () => {
      if (cancelled) return;
      await getGsap();
      const ScrollTrigger = await getScrollTrigger();
      if (cancelled || !ScrollTrigger) return;

      const body = asDomNode(bodyRef);
      const panels = panelRefs.current.map(asDomNode).filter(Boolean);
      if (!body || panels.length < stepCount) return;

      cleanup();

      const scroller = findScrollParent(body);
      const track = asDomNode(spineTrackRef);
      if (track) {
        track.style.minHeight = `${Math.max(240, panels.length * 72)}px`;
      }

      ensureVisible();

      panels.forEach((panel, index) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: panel,
            scroller: scroller || undefined,
            start: "top 82%",
            onEnter: () => setActive(index),
            onEnterBack: () => setActive(index),
          })
        );
      });

      scheduleScrollTriggerRefresh();
    };

    startId = requestAnimationFrame(() => requestAnimationFrame(setup));
    retryId = setTimeout(setup, 400);

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeTimer = null;
        setup();
        scheduleScrollTriggerRefresh();
      }, 200);
    };
    globalThis.addEventListener?.("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(startId);
      clearTimeout(retryId);
      if (resizeTimer) clearTimeout(resizeTimer);
      globalThis.removeEventListener?.("resize", onResize);
      cleanup();
    };
  }, [disabled, stepCount]);

  return {
    bodyRef,
    spineFillRef,
    spineTrackRef,
    setPanelRef,
    setNodeRef,
    roman: ROMAN,
  };
}
