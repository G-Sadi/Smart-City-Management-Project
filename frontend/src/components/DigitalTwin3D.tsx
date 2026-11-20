import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Project, ComponentItem, ProjectRiskForecast } from '../types';
import { calculateProjectRiskForecast } from '../riskEngine';
import {
  RotateCcw, Eye, Layers, Compass, Zap, AlertTriangle, ShieldCheck,
  ZoomIn, ZoomOut, Maximize2, X
} from 'lucide-react';

interface DigitalTwin3DProps {
  projects: Project[];
  components: ComponentItem[];
  selectedProjectId?: string | null;
  onSelectProject: (projectId: string) => void;
  isDark?: boolean;
}

// Dhaka geographical center anchor
const DHAKA_CENTER = { lat: 23.7808, lon: 90.3950 };
// Coordinate scaling to 3D scene units
const COORD_SCALE = 650.0;

const ZONES = [
  { name: 'Mirpur', lat: 23.8068, lon: 90.3687, radius: 2.2, color: 0x38bdf8 },
  { name: 'Uttara', lat: 23.8759, lon: 90.3795, radius: 2.5, color: 0x818cf8 },
  { name: 'Gulshan', lat: 23.7925, lon: 90.4078, radius: 2.0, color: 0x34d399 },
  { name: 'Motijheel', lat: 23.7330, lon: 90.4172, radius: 1.8, color: 0xf59e0b },
  { name: 'Dhanmondi', lat: 23.7461, lon: 90.3742, radius: 2.0, color: 0xa78bfa },
  { name: 'Mohammadpur', lat: 23.7658, lon: 90.3584, radius: 1.9, color: 0x2dd4bf },
  { name: 'Banani', lat: 23.7937, lon: 90.4066, radius: 1.7, color: 0x10b981 },
  { name: 'Old Dhaka', lat: 23.7104, lon: 90.4074, radius: 2.4, color: 0xf43f5e },
];

export const DigitalTwin3D: React.FC<DigitalTwin3DProps> = ({
  projects,
  components,
  selectedProjectId,
  onSelectProject,
  isDark = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<{
    project: Project;
    risk: ProjectRiskForecast;
    screenX: number;
    screenY: number;
  } | null>(null);

  const [showArcs, setShowArcs] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  // Precompute project risks for fast coloring
  const projectRisks = useMemo(() => {
    const map = new Map<string, ProjectRiskForecast>();
    projects.forEach(p => {
      const comps = components.filter(c => c.project_id === p.project_id);
      map.set(p.project_id, calculateProjectRiskForecast(p, comps));
    });
    return map;
  }, [projects, components]);

  // Project map for coordinates
  const projectPositions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    projects.forEach(p => {
      const x = (p.longitude - DHAKA_CENTER.lon) * COORD_SCALE;
      const z = -(p.latitude - DHAKA_CENTER.lat) * COORD_SCALE;
      const height = Math.max(0.6, Math.min(8.5, (p.cost / 40.0) * 2.2));
      map.set(p.project_id, new THREE.Vector3(x, height / 2, z));
    });
    return map;
  }, [projects]);

  // Three.js refs for camera reset & interaction
  const sceneStateRef = useRef<{
    resetCamera: () => void;
    zoomCamera: (factor: number) => void;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 550;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x070b14 : 0xf8fafc);
    scene.fog = new THREE.FogExp2(isDark ? 0x070b14 : 0xf8fafc, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const initialCamPos = new THREE.Vector3(0, 38, 48);
    camera.position.copy(initialCamPos);
    camera.lookAt(0, 0, 0);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
    renderer.shadowMap.enabled = !isMobile;
    if (!isMobile) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    container.innerHTML = '';
    container.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(isDark ? 0x475569 : 0x94a3b8, isDark ? 1.2 : 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 1.4 : 1.8);
    dirLight.position.set(30, 50, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 1.2, 80);
    pointLight.position.set(0, 20, 0);
    scene.add(pointLight);

    // 3. Ground Grid & Base Plate
    const groundGroup = new THREE.Group();
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0b1120 : 0xe2e8f0,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    groundGroup.add(ground);

    const grid = new THREE.GridHelper(120, 48, isDark ? 0x0ea5e9 : 0x94a3b8, isDark ? 0x1e293b : 0xcbd5e1);
    grid.position.y = 0;
    groundGroup.add(grid);
    scene.add(groundGroup);

    // 4. Extruded City Zone Blocks
    const zoneGroup = new THREE.Group();
    ZONES.forEach(z => {
      const zX = (z.lon - DHAKA_CENTER.lon) * COORD_SCALE;
      const zZ = -(z.lat - DHAKA_CENTER.lat) * COORD_SCALE;

      // Circular glowing zone footprint
      const ringGeo = new THREE.RingGeometry(z.radius * 0.85, z.radius * 1.05, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: z.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isDark ? 0.35 : 0.5,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(zX, 0.02, zZ);
      zoneGroup.add(ring);

      // Low extruded block representing the municipal ward center
      const baseBlockGeo = new THREE.CylinderGeometry(z.radius * 0.7, z.radius * 0.75, 0.4, 24);
      const baseBlockMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x1e293b : 0xe2e8f0,
        transparent: true,
        opacity: isDark ? 0.45 : 0.6,
        roughness: 0.6,
      });
      const baseBlock = new THREE.Mesh(baseBlockGeo, baseBlockMat);
      baseBlock.position.set(zX, 0.2, zZ);
      zoneGroup.add(baseBlock);
    });
    scene.add(zoneGroup);

    // 5. 3D Project Infrastructure Pillars
    const pillarGroup = new THREE.Group();
    const pillarMeshes: THREE.Mesh[] = [];

    projects.forEach(p => {
      const x = (p.longitude - DHAKA_CENTER.lon) * COORD_SCALE;
      const z = -(p.latitude - DHAKA_CENTER.lat) * COORD_SCALE;
      const height = Math.max(0.6, Math.min(8.5, (p.cost / 40.0) * 2.2));
      const radius = 0.55;

      const risk = projectRisks.get(p.project_id);
      let colorHex = 0x0284c7; // Default Blue (Running)

      if (p.status === 'Completed') {
        colorHex = 0x10b981; // Emerald Green
      } else if (p.status === 'Delayed' || risk?.risk_tier === 'Critical') {
        colorHex = 0xf43f5e; // Rose Red
      } else if (risk?.risk_tier === 'Elevated') {
        colorHex = 0xf59e0b; // Amber
      } else if (p.status === 'Approved') {
        colorHex = 0x06b6d4; // Cyan
      }

      const isSelected = selectedProjectId === p.project_id;
      const pillarGeo = new THREE.CylinderGeometry(radius * 0.9, radius * 1.1, height, 16);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x38bdf8 : colorHex,
        emissive: isSelected ? 0x0284c7 : (risk?.risk_tier === 'Critical' ? 0x881337 : 0x000000),
        emissiveIntensity: isSelected ? 0.6 : 0.4,
        roughness: 0.3,
        metalness: 0.5,
      });

      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, height / 2, z);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      pillar.userData = { project: p, risk };

      pillarGroup.add(pillar);
      pillarMeshes.push(pillar);

      // Top glowing indicator cap
      const capGeo = new THREE.SphereGeometry(radius * 0.85, 12, 12);
      const capMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xffffff : colorHex,
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(x, height + 0.25, z);
      pillarGroup.add(cap);

      // Beacon ring for Delayed or Critical projects
      if (p.status === 'Delayed' || risk?.risk_tier === 'Critical') {
        const beaconGeo = new THREE.RingGeometry(radius * 1.2, radius * 1.6, 24);
        const beaconMat = new THREE.MeshBasicMaterial({
          color: 0xf43f5e,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.rotation.x = -Math.PI / 2;
        beacon.position.set(x, 0.05, z);
        pillarGroup.add(beacon);
      }
    });
    scene.add(pillarGroup);

    // 6. Curved 3D DAG Dependency Arcs
    const arcGroup = new THREE.Group();
    const arcCurves: Array<{ curve: THREE.CatmullRomCurve3; line: THREE.Line; particles?: THREE.Points }> = [];

    // Map parent project to child project via components
    const compMap = new Map(components.map(c => [c.component_id, c]));
    const projectPairs = new Set<string>();

    components.forEach(c => {
      if (!c.depends_on || !c.project_id) return;
      const parentComp = compMap.get(c.depends_on);
      if (!parentComp || !parentComp.project_id || parentComp.project_id === c.project_id) return;

      const pairKey = `${parentComp.project_id}->${c.project_id}`;
      if (projectPairs.has(pairKey)) return;
      projectPairs.add(pairKey);

      const posA = projectPositions.get(parentComp.project_id);
      const posB = projectPositions.get(c.project_id);
      if (!posA || !posB) return;

      // Create high arch curve
      const midPoint = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
      const dist = posA.distanceTo(posB);
      midPoint.y += Math.max(3.5, dist * 0.35);

      const curve = new THREE.CatmullRomCurve3([posA, midPoint, posB]);
      const points = curve.getPoints(40);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
      const curveMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: isDark ? 0.55 : 0.7,
        linewidth: 2,
      });

      const line = new THREE.Line(curveGeo, curveMat);
      arcGroup.add(line);
      arcCurves.push({ curve, line });
    });
    scene.add(arcGroup);

    // 7. Interactive Orbit & Pan Controls (Zero-Dependency Pointer Events)
    let isDragging = false;
    let isRightDrag = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = new THREE.Spherical().setFromVector3(camera.position);
    let target = new THREE.Vector3(0, 0, 0);

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      isRightDrag = e.button === 2 || e.shiftKey;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      if (isDragging) {
        const deltaX = mouseX - prevMouseX;
        const deltaY = mouseY - prevMouseY;
        prevMouseX = mouseX;
        prevMouseY = mouseY;

        if (isRightDrag) {
          // Pan camera
          const panSpeed = 0.05 * (spherical.radius / 40);
          const right = new THREE.Vector3();
          camera.getWorldDirection(right);
          right.cross(camera.up).normalize();

          target.addScaledVector(right, -deltaX * panSpeed);
          target.addScaledVector(camera.up, deltaY * panSpeed);
        } else {
          // Orbit camera
          spherical.theta -= deltaX * 0.007;
          spherical.phi = Math.max(0.15, Math.min(Math.PI / 2.1, spherical.phi - deltaY * 0.007));
        }

        camera.position.setFromSpherical(spherical).add(target);
        camera.lookAt(target);
      } else {
        // Raycasting for Hover Tooltip
        const normX = ((mouseX - rect.left) / rect.width) * 2 - 1;
        const normY = -((mouseY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(normX, normY), camera);
        const intersects = raycaster.intersectObjects(pillarMeshes, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh;
          const { project, risk } = hit.userData;
          setHoveredProject({
            project,
            risk,
            screenX: mouseX - rect.left,
            screenY: mouseY - rect.top,
          });
          container.style.cursor = 'pointer';
        } else {
          setHoveredProject(null);
          container.style.cursor = isDragging ? 'grabbing' : 'grab';
        }
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      isRightDrag = false;
      container.style.cursor = 'grab';
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
      spherical.radius = Math.max(12, Math.min(110, spherical.radius * zoomFactor));
      camera.position.setFromSpherical(spherical).add(target);
      camera.lookAt(target);
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(normX, normY), camera);
      const intersects = raycaster.intersectObjects(pillarMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const { project } = hit.userData;
        if (project) {
          onSelectProject(project.project_id);
        }
      }
    };

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    // Multi-touch Pinch to Zoom on Mobile Screens
    let touchStartDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStartDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        if (currentDist > 0) {
          const factor = touchStartDist / currentDist;
          spherical.radius = Math.max(12, Math.min(110, spherical.radius * (1 + (factor - 1) * 0.08)));
          camera.position.setFromSpherical(spherical).add(target);
          camera.lookAt(target);
          touchStartDist = currentDist;
        }
      }
    };

    const onTouchEnd = () => {
      touchStartDist = 0;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onClick);
    container.addEventListener('contextmenu', onContextMenu);

    // Save camera controls to ref for HUD buttons
    sceneStateRef.current = {
      resetCamera: () => {
        spherical.setFromVector3(initialCamPos);
        target.set(0, 0, 0);
        camera.position.copy(initialCamPos);
        camera.lookAt(target);
      },
      zoomCamera: (factor: number) => {
        spherical.radius = Math.max(12, Math.min(110, spherical.radius * factor));
        camera.position.setFromSpherical(spherical).add(target);
        camera.lookAt(target);
      },
    };

    // 8. Responsive Resize
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // 9. Render & Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle pulsing of beacon lights
      pointLight.position.x = Math.sin(elapsedTime * 0.4) * 15;
      pointLight.position.z = Math.cos(elapsedTime * 0.4) * 15;

      renderer.render(scene, camera);
    };
    animate();

    // 10. Clean Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      container.removeEventListener('contextmenu', onContextMenu);

      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      grid.dispose();
      pillarMeshes.forEach(m => {
        m.geometry.dispose();
        if (Array.isArray(m.material)) m.material.forEach(mat => mat.dispose());
        else m.material.dispose();
      });
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [projects, components, selectedProjectId, isDark, projectRisks, projectPositions]);

  return (
    <div className="relative w-full h-[50dvh] min-h-[350px] sm:h-[500px] lg:h-[650px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 select-none touch-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

      {/* Floating 3D Navigation Controls Bar */}
      <div className="absolute top-4 right-4 flex items-center space-x-1.5 p-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-300 shadow-xl z-20">
        <button
          onClick={() => sceneStateRef.current?.zoomCamera(0.85)}
          title="Zoom In"
          className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => sceneStateRef.current?.zoomCamera(1.15)}
          title="Zoom Out"
          className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => sceneStateRef.current?.resetCamera()}
          title="Reset Camera Angle"
          className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Legend & Status Overlay (Desktop / Tablet only) */}
      <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-800 text-xs text-slate-300 shadow-xl z-20 space-y-2 pointer-events-auto hidden sm:block">
        <div className="flex items-center space-x-2 font-medium text-slate-200 pb-1 border-b border-slate-800">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>3D City Twin Visual Encoding</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
            <span>Completed / Approved</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm" />
            <span>Running / Low Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
            <span>Elevated Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm animate-pulse" />
            <span>Delayed / Critical</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
          Height = Budget (Cr Tk) • Arcs = Cross-Project Precedences
        </div>
      </div>

      {/* Floating Hover Project Inspection HUD */}
      {hoveredProject && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
          style={{
            left: `${hoveredProject.screenX}px`,
            top: `${hoveredProject.screenY}px`,
          }}
        >
          <div className="w-72 max-w-[calc(100vw-32px)] p-3 rounded-xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold">
                  {hoveredProject.project.project_id}
                </span>
                <h4 className="text-xs font-semibold text-slate-100 mt-1 line-clamp-1">
                  {hoveredProject.project.name}
                </h4>
              </div>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  hoveredProject.risk.risk_tier === 'Critical'
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : hoveredProject.risk.risk_tier === 'Elevated'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                {hoveredProject.risk.risk_tier} Risk
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 my-2 text-[11px]">
              <div>
                <span className="text-slate-400">Budget:</span>
                <p className="font-semibold text-cyan-400 font-mono">৳{hoveredProject.project.cost} Cr</p>
              </div>
              <div>
                <span className="text-slate-400">Progress:</span>
                <p className="font-semibold text-emerald-400 font-mono">{hoveredProject.project.completion}%</p>
              </div>
              <div>
                <span className="text-slate-400">Agency:</span>
                <p className="font-medium text-slate-300">{hoveredProject.project.exec}</p>
              </div>
              <div>
                <span className="text-slate-400">Forecast Cost:</span>
                <p className="font-semibold text-amber-400 font-mono">৳{hoveredProject.risk.forecasted_final_cost} Cr</p>
              </div>
            </div>

            <div className="text-[10px] text-cyan-300/80 bg-cyan-950/40 p-1.5 rounded border border-cyan-900/50 flex items-center justify-between">
              <span>Click pillar to inspect full DPP drawer</span>
              <span className="font-bold">→</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalTwin3D;
