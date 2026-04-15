"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

/* ─── Marqueur personnalisé (carré gold) ─────────────────────── */
const createMarker = () =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:12px;height:12px;
      background:#C4A35A;
      border:2px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,.35);
      transform:rotate(45deg);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -10],
  });

/* ─── Agences ─────────────────────────────────────────────────── */
const AGENCIES = [
  { id: "vannes", city: "Vannes",  label: "Siège social",    lat: 47.658, lng: -2.761 },
  { id: "lyon",   city: "Lyon",    label: "Agence de Lyon",  lat: 45.748, lng:  4.847 },
];

/* ─── Force le recalcul de taille après mount ───────────────── */
function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

/* ─── Zoom to marker on click (controlled from parent) ─────── */
function FlyTo({ active }) {
  const map = useMap();
  // Initialise à la valeur courante → skip le premier rendu ET le double-mount StrictMode
  const prevActive = useRef(active);
  useEffect(() => {
    if (prevActive.current === active) return;
    prevActive.current = active;
    if (!active) return;
    const agency = AGENCIES.find((a) => a.id === active);
    if (!agency) return;
    // Skip si la carte est masquée (display:none → taille 0)
    const size = map.getSize();
    if (!size || size.x === 0) return;
    map.flyTo([agency.lat, agency.lng], 10, { duration: 1.2 });
  }, [active, map]);
  return null;
}

export default function FranceMap({ activeAgency = null }) {
  const icon = typeof window !== "undefined" ? createMarker() : null;

  return (
    <MapContainer
      center={[46.6, 2.3]}
      zoom={5}
      zoomControl={false}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%" }}
      className="z-0">
      {/* Tuiles monochrome Carto Light */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {icon && AGENCIES.map((a) => (
        <Marker key={a.id} position={[a.lat, a.lng]} icon={icon}>
          <Popup className="font-sans text-xs">
            <strong className="block text-navy">{a.city}</strong>
            {a.label}
          </Popup>
        </Marker>
      ))}

      <InvalidateSize />
      <FlyTo active={activeAgency} />
    </MapContainer>
  );
}
