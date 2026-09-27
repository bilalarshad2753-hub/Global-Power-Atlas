import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { countries, CountryData } from "@/data/countries";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function CountryMarker({
  country,
  isSelected,
  onToggle,
}: {
  country: CountryData;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pos = useMemo(
    () => latLngToVector3(country.coordinates[0], country.coordinates[1], 2.02),
    [country.coordinates]
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      const scale = isSelected ? 1.6 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), delta * 5);
    }
  });

  return (
    <group position={pos}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(country.id);
        }}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? "#00d4ff" : "#f59e0b"}
          emissive={isSelected ? "#00d4ff" : "#f59e0b"}
          emissiveIntensity={isSelected ? 2 : 0.8}
        />
      </mesh>
      {isSelected && (
        <Html distanceFactor={8} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(10,22,40,0.9)",
              border: "1px solid rgba(0,212,255,0.3)",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "11px",
              whiteSpace: "nowrap",
              color: "#00d4ff",
              fontFamily: "Orbitron, monospace",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <img src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`} alt={country.name} style={{ width: 16, height: 12, borderRadius: 2 }} />
            <span>{country.name}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function GlobeGrid() {
  const gridLines = useMemo(() => {
    const lines: THREE.BufferGeometry[] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const points: THREE.Vector3[] = [];
      for (let lng = 0; lng <= 360; lng += 5) {
        points.push(latLngToVector3(lat, lng, 2.004));
      }
      lines.push(new THREE.BufferGeometry().setFromPoints(points));
    }
    for (let lng = 0; lng < 360; lng += 30) {
      const points: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        points.push(latLngToVector3(lat, lng, 2.004));
      }
      lines.push(new THREE.BufferGeometry().setFromPoints(points));
    }
    return lines;
  }, []);

  return (
    <group>
      {gridLines.map((geom, i) => (
        <primitive key={i} object={new THREE.Line(geom, new THREE.LineBasicMaterial({ color: "#00d4ff", opacity: 0.05, transparent: true }))} />
      ))}
    </group>
  );
}

// Parse GeoJSON coordinates into line geometries on the globe
function coordsToLines(coords: number[][][], radius: number): THREE.BufferGeometry[] {
  return coords.map((ring) => {
    const points = ring.map(([lng, lat]) => latLngToVector3(lat, lng, radius));
    return new THREE.BufferGeometry().setFromPoints(points);
  });
}

function WorldBoundaries() {
  const [geometries, setGeometries] = useState<THREE.BufferGeometry[]>([]);

  useEffect(() => {
    // Load world-atlas TopoJSON
    import("world-atlas/countries-110m.json").then((topoData) => {
      const topo = topoData.default as unknown as Topology<{ countries: GeometryCollection }>;
      const geoCountries = feature(topo, topo.objects.countries);
      const lines: THREE.BufferGeometry[] = [];
      const R = 2.006;

      if (geoCountries.type === "FeatureCollection") {
        for (const feat of geoCountries.features) {
          const geom = feat.geometry;
          if (geom.type === "Polygon") {
            lines.push(...coordsToLines(geom.coordinates as number[][][], R));
          } else if (geom.type === "MultiPolygon") {
            for (const polygon of geom.coordinates as number[][][][]) {
              lines.push(...coordsToLines(polygon as number[][][], R));
            }
          }
        }
      }

      setGeometries(lines);
    });
  }, []);

  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#00d4ff", opacity: 0.55, transparent: true }),
    []
  );

  return (
    <group>
      {geometries.map((geom, i) => (
        <primitive key={i} object={new THREE.Line(geom, material)} />
      ))}
    </group>
  );
}

function EarthSphere({ children }: { children?: React.ReactNode }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#060e1a"
          roughness={0.9}
          metalness={0.1}
        />
      </Sphere>
      <Sphere args={[2.002, 64, 64]}>
        <meshStandardMaterial
          color="#00d4ff"
          wireframe
          transparent
          opacity={0.03}
        />
      </Sphere>
      <WorldBoundaries />
      <GlobeGrid />
      {children}
    </group>
  );
}

function Scene({
  selectedIds,
  onToggle,
}: {
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#00d4ff" />
      <EarthSphere>
        {countries.map((c) => (
          <CountryMarker
            key={c.id}
            country={c}
            isSelected={selectedIds.includes(c.id)}
            onToggle={onToggle}
          />
        ))}
      </EarthSphere>
      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

interface GlobeProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const Globe = ({ selectedIds, onToggle }: GlobeProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div className="h-full aspect-square max-w-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene selectedIds={selectedIds} onToggle={onToggle} />
      </Canvas>
      </div>
    </div>
  );
};

export default Globe;
