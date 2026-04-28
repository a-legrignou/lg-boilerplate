"use client";

import * as React from "react";
import { useField } from "@payloadcms/ui";

const HEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const wrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};
const swatch: React.CSSProperties = {
  width: 36,
  height: 36,
  border: "1px solid var(--theme-elevation-200)",
  borderRadius: 6,
  padding: 0,
  cursor: "pointer",
  background: "transparent",
};
const text: React.CSSProperties = {
  width: 110,
  padding: "6px 8px",
  border: "1px solid var(--theme-elevation-200)",
  borderRadius: 4,
  background: "var(--theme-input-bg)",
  color: "var(--theme-text)",
  fontFamily: "monospace",
  fontSize: 13,
};

const ColorPickerField: React.FC<{
  path: string;
  field?: { label?: string };
}> = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path });
  const [draft, setDraft] = React.useState(
    (value as string | undefined) ?? "#6366f1",
  );

  React.useEffect(() => {
    if (typeof value === "string" && value !== draft) setDraft(value);
  }, [value, draft]);

  const commit = (next: string) => {
    setDraft(next);
    if (HEX.test(next)) setValue(next);
  };

  return (
    <div className="field-type">
      {field?.label ? (
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {field.label}
        </label>
      ) : null}
      <div style={wrap}>
        <input
          type="color"
          value={HEX.test(draft) ? draft : "#000000"}
          onChange={(e) => commit(e.target.value)}
          style={swatch}
          aria-label="Sélecteur de couleur"
        />
        <input
          type="text"
          value={draft}
          onChange={(e) => commit(e.target.value)}
          placeholder="#6366f1"
          style={text}
        />
      </div>
    </div>
  );
};

export default ColorPickerField;
