"use client";

import React, { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL = "/indonesia-geo.json";

interface Props {
  data: Array<{ province: string; count: number }>;
  selectedProvince?: string;
  onProvinceClick?: (province: string) => void;
}

export default function IndonesiaAlumniMap({
  data,
  selectedProvince,
  onProvinceClick,
}: Props) {
  const [tooltip, setTooltip] = useState<{
    name: string;
    value: number | string;
  } | null>(null);

  const dataMap = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach((d) => {
      map[d.province] = d.count;
    });
    return map;
  }, [data]);

  const maxAlumni = useMemo(
    () => Math.max(...data.map((d) => d.count), 1),
    [data],
  );

  function getColor(value: number | undefined) {
    if (value === undefined) return "#818283";
    const ratio = value / maxAlumni;
    if (ratio > 0.75) return "#1D9E75";
    if (ratio > 0.5) return "#5DCAA5";
    if (ratio > 0.25) return "#9FE1CB";
    return "#818283";
  }

  return (
    <div className="relative w-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [118, -2], scale: 1100 }}
        width={800}
        height={400}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name: string = geo.properties.Propinsi || "";
              const value = dataMap[name];
              const isSelected = selectedProvince === name;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    if (onProvinceClick) {
                      onProvinceClick(isSelected ? "" : name);
                    }
                  }}
                  onMouseEnter={() => {
                    setTooltip({
                      name,
                      value: value !== undefined ? value : "Tidak ada data",
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    default: {
                      fill: isSelected ? "#0F6E56" : getColor(value),
                      stroke: isSelected ? "#085041" : "#FFFFFF",
                      strokeWidth: isSelected ? 1.5 : 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "#0F6E56",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "#085041",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute top-2 left-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm shadow-md pointer-events-none">
          <p className="font-semibold text-slate-800">{tooltip.name}</p>
          <p className="text-slate-500">
            Jumlah alumni:{" "}
            <span className="font-medium text-brand-dark">{tooltip.value}</span>
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 justify-center text-xs text-slate-500">
        <span>Sedikit</span>
        <div className="flex gap-0.5">
          <div
            className="w-5 h-3 rounded-sm"
            style={{ backgroundColor: "#E1F5EE" }}
          />
          <div
            className="w-5 h-3 rounded-sm"
            style={{ backgroundColor: "#9FE1CB" }}
          />
          <div
            className="w-5 h-3 rounded-sm"
            style={{ backgroundColor: "#5DCAA5" }}
          />
          <div
            className="w-5 h-3 rounded-sm"
            style={{ backgroundColor: "#1D9E75" }}
          />
        </div>
        <span>Banyak</span>
      </div>
    </div>
  );
}
