const DEFAULT_REGION = {
  latitude: 20.5937,
  longitude: 78.9629,
  latitudeDelta: 40,
  longitudeDelta: 40,
};

/** Collect finite lat/lng points for map fitting. */
export function collectOrderMapPoints({ shop, partner, destination } = {}) {
  const points = [];

  const slat = Number(shop?.latitude);
  const slng = Number(shop?.longitude);
  if (Number.isFinite(slat) && Number.isFinite(slng)) {
    points.push({ latitude: slat, longitude: slng, kind: "shop" });
  }

  const plat = Number(partner?.latitude);
  const plng = Number(partner?.longitude);
  if (Number.isFinite(plat) && Number.isFinite(plng)) {
    points.push({ latitude: plat, longitude: plng, kind: "partner" });
  }

  const dlat = Number(destination?.latitude);
  const dlng = Number(destination?.longitude);
  if (Number.isFinite(dlat) && Number.isFinite(dlng)) {
    points.push({ latitude: dlat, longitude: dlng, kind: "destination" });
  }

  return points;
}

/** React Native Maps `initialRegion` from multiple markers. */
export function computeMapRegionFromPoints(points, { paddingFactor = 2.4, minDelta = 0.025 } = {}) {
  const valid = (points || []).filter(
    (p) => Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude))
  );
  if (!valid.length) return DEFAULT_REGION;
  if (valid.length === 1) {
    return {
      latitude: Number(valid[0].latitude),
      longitude: Number(valid[0].longitude),
      latitudeDelta: 0.06,
      longitudeDelta: 0.06,
    };
  }

  const lats = valid.map((p) => Number(p.latitude));
  const lngs = valid.map((p) => Number(p.longitude));
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * paddingFactor, minDelta),
    longitudeDelta: Math.max((maxLng - minLng) * paddingFactor, minDelta),
  };
}
