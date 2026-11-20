import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
  isActive?: boolean;
}

export const DigitalTwin3D: React.FC<DigitalTwin3DProps> = ({
  projects,
  components,
  selectedProjectId,
  onSelectProject,
  isDark = true,
  isActive = true,
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

  // Precompute project risks for fast coloring
  const projectRisks = useMemo(() => {
    const map = new Map<string, ProjectRiskForecast>();
    projects.forEach(p => {
      const comps = components.filter(c => c.project_id === p.project_id);
      map.set(p.project_id, calculateProjectRiskForecast(p, comps));
    });
    return map;
  }, [projects, components]);

  // 1. Filter valid projects with geographic coordinates
  const validProjects = useMemo(() => {
    return projects.filter(p =>
      typeof p.latitude === 'number' && !isNaN(p.latitude) && p.latitude >= -90 && p.latitude <= 90 &&
      typeof p.longitude === 'number' && !isNaN(p.longitude) && p.longitude >= -180 && p.longitude <= 180
    );
  }, [projects]);

  // 2. Compute dynamic geographic bounding box of the active dataset
  const geoBounds = useMemo(() => {
    if (validProjects.length === 0) {
      return {
        minLat: 23.6, maxLat: 23.9, minLng: 90.4, maxLng: 90.6,
        centerLat: 23.75, centerLng: 90.52,
        spanLat: 0.3, spanLng: 0.2
      };
    }
    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;
    validProjects.forEach(p => {
      if (p.latitude < minLat) minLat = p.latitude;
      if (p.latitude > maxLat) maxLat = p.latitude;
      if (p.longitude < minLng) minLng = p.longitude;
      if (p.longitude > maxLng) maxLng = p.longitude;
    });
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const spanLat = Math.max(0.005, maxLat - minLat);
    const spanLng = Math.max(0.005, maxLng - minLng);
    return { minLat, maxLat, minLng, maxLng, centerLat, centerLng, spanLat, spanLng };
  }, [validProjects]);

  // 3. Normalization scale: maps full dataset onto ~75 scene units in XZ plane
  const WORLD_SPAN = 75.0;
  const coordScale = useMemo(() => {
    const maxSpan = Math.max(geoBounds.spanLat, geoBounds.spanLng);
    return WORLD_SPAN / maxSpan;
  }, [geoBounds]);

  // 4. Calculate 3D positions with spiral offset for co-located projects
  const projectPositions = useMemo(() => {
    const map = new Map<string, { pos: THREE.Vector3; height: number; radius: number }>();
    const clusterMap = new Map<string, Project[]>();

    validProjects.forEach(p => {
      const key = `${p.latitude.toFixed(5)},${p.longitude.toFixed(5)}`;
      if (!clusterMap.has(key)) clusterMap.set(key, []);
      clusterMap.get(key)!.push(p);
    });

    clusterMap.forEach(cluster => {
      cluster.forEach((p, index) => {
        const baseX = (p.longitude - geoBounds.centerLng) * coordScale;
        const baseZ = -(p.latitude - geoBounds.centerLat) * coordScale;

        let finalX = baseX;
        let finalZ = baseZ;

        if (cluster.length > 1 && index > 0) {
          const radius = Math.min(3.2, 0.95 * Math.sqrt(index));
          const angle = index * 2.39996;
          finalX += radius * Math.cos(angle);
          finalZ += radius * Math.sin(angle);
        }

        const height = Math.max(2.4, Math.min(14.0, (p.cost / 30.0) * 4.0 + 2.5));
        const radius = 0.85;

        map.set(p.project_id, {
          pos: new THREE.Vector3(finalX, height / 2, finalZ),
          height,
          radius
        });
      });
    });

    return map;
  }, [validProjects, geoBounds, coordScale]);

  // 5. Dynamically derive real municipal zones from the dataset
  const derivedZones = useMemo(() => {
    const locMap = new Map<string, { lats: number[]; lngs: number[]; count: number; cost: number }>();
    validProjects.forEach(p => {
      const loc = p.location || 'Municipal Center';
      if (!locMap.has(loc)) {
        locMap.set(loc, { lats: [], lngs: [], count: 0, cost: 0 });
      }
      const entry = locMap.get(loc)!;
      entry.lats.push(p.latitude);
      entry.lngs.push(p.longitude);
      entry.count += 1;
      entry.cost += p.cost || 0;
    });

    const ZONE_PALETTE = [
      0x38bdf8, 0x10b981, 0x818cf8, 0xf59e0b, 0x2dd4bf,
      0xa78bfa, 0xf43f5e, 0x06b6d4, 0xec4899, 0x14b8a6
    ];
    let cIdx = 0;

    const zones: Array<{
      name: string;
      x: number;
      z: number;
      radius: number;
      color: number;
      count: number;
      cost: number;
    }> = [];

    locMap.forEach((data, name) => {
      const avgLat = data.lats.reduce((a, b) => a + b, 0) / data.lats.length;
      const avgLng = data.lngs.reduce((a, b) => a + b, 0) / data.lngs.length;
      const zX = (avgLng - geoBounds.centerLng) * coordScale;
      const zZ = -(avgLat - geoBounds.centerLat) * coordScale;

      let maxDist = 2.5;
      for (let i = 0; i < data.lats.length; i++) {
        const pX = (data.lngs[i] - geoBounds.centerLng) * coordScale;
        const pZ = -(data.lats[i] - geoBounds.centerLat) * coordScale;
        const d = Math.hypot(pX - zX, pZ - zZ);
        if (d > maxDist) maxDist = d;
      }

      zones.push({
        name,
        x: zX,
        z: zZ,
        radius: Math.max(4.0, Math.min(22.0, maxDist + 2.5)),
        color: ZONE_PALETTE[cIdx % ZONE_PALETTE.length],
        count: data.count,
        cost: data.cost
      });
      cIdx++;
    });

    return zones;
  }, [validProjects, geoBounds, coordScale]);

  // Three.js refs for interaction and camera control
  const sceneStateRef = useRef<{
    resetCamera: () => void;
    zoomCamera: (factor: number) => void;
    focusOnProject: (projId: string) => void;
  } | null>(null);

  const pillarMeshesRef = useRef<THREE.Mesh[]>([]);
  const selectionBeaconsRef = useRef<Map<string, THREE.Object3D>>(new Map());

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 550;

    // 1. Scene & Linear Clear Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x070b14 : 0xf8fafc);
    // Linear fog starts at 120 and ends at 380: zero fog in the 0-90 world radius
    scene.fog = new THREE.Fog(isDark ? 0x070b14 : 0xf8fafc, 120, 380);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
    renderer.shadowMap.enabled = !isMobile;
    if (!isMobile) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    container.innerHTML = '';
    container.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    // 4. OrbitControls with smooth damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.screenSpacePanning = true;
    controls.minDistance = 10;
    controls.maxDistance = 250;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minPolarAngle = 0.05;

    // 5. Multi-Source Balanced High-Contrast Lighting
    const hemiLight = new THREE.HemisphereLight(
      isDark ? 0xcfedff : 0xffffff,
      isDark ? 0x0f172a : 0x334155,
      isDark ? 1.4 : 1.2
    );
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.95 : 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, isDark ? 2.4 : 2.6);
    keyLight.position.set(60, 90, 50);
    keyLight.castShadow = !isMobile;
    if (!isMobile) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 400;
      keyLight.shadow.camera.left = -90;
      keyLight.shadow.camera.right = 90;
      keyLight.shadow.camera.top = 90;
      keyLight.shadow.camera.bottom = -90;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, isDark ? 1.3 : 1.0);
    fillLight.position.set(-60, 45, -50);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, isDark ? 0.9 : 0.7);
    rimLight.position.set(10, 35, -70);
    scene.add(rimLight);

    // Moving beacon light for dynamic ambient reflection
    const beaconLight = new THREE.PointLight(0x06b6d4, 1.2, 90);
    beaconLight.position.set(0, 20, 0);
    scene.add(beaconLight);

    // 6. Ground Plane & Grid Platform
    const groundSize = 150;
    const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);
    const groundMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0b1120 : 0xe2e8f0,
      roughness: 0.75,
      metalness: 0.25,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = !isMobile;
    scene.add(ground);

    const grid = new THREE.GridHelper(
      groundSize,
      50,
      isDark ? 0x0284c7 : 0x0284c7,
      isDark ? 0x1e293b : 0xcbd5e1
    );
    grid.position.y = 0;
    scene.add(grid);

    // 7. Dynamic Municipal Zone Platforms
    const zoneGroup = new THREE.Group();
    derivedZones.forEach(z => {
      // Outer glowing ring
      const ringGeo = new THREE.RingGeometry(z.radius * 0.92, z.radius, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: z.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isDark ? 0.45 : 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(z.x, 0.02, z.z);
      zoneGroup.add(ring);

      // Low extruded platform disk
      const padGeo = new THREE.CylinderGeometry(z.radius * 0.88, z.radius * 0.92, 0.2, 32);
      const padMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x131d31 : 0xe2e8f0,
        transparent: true,
        opacity: isDark ? 0.5 : 0.65,
        roughness: 0.6,
        metalness: 0.2,
      });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(z.x, 0.1, z.z);
      pad.receiveShadow = !isMobile;
      zoneGroup.add(pad);
    });
    scene.add(zoneGroup);

    // 8. 3D Project Infrastructure Towers
    const pillarGroup = new THREE.Group();
    const pillarMeshes: THREE.Mesh[] = [];
    const selectionMap = new Map<string, THREE.Object3D>();

    validProjects.forEach(p => {
      const posData = projectPositions.get(p.project_id);
      if (!posData) return;
      const { pos, height, radius } = posData;
      const risk = projectRisks.get(p.project_id);

      let colorHex = 0x10b981; // Running = Emerald Green
      let emissiveHex = 0x047857;

      if (p.status === 'Completed') {
        colorHex = 0x38bdf8; // Sky Blue
        emissiveHex = 0x0284c7;
      } else if (p.status === 'Delayed' || risk?.risk_tier === 'Critical') {
        colorHex = 0xf43f5e; // Rose Red
        emissiveHex = 0xbe123c;
      } else if (risk?.risk_tier === 'Elevated') {
        colorHex = 0xf59e0b; // Amber Gold
        emissiveHex = 0xb45309;
      } else if (p.status === 'Approved') {
        colorHex = 0xa855f7; // Purple
        emissiveHex = 0x7e22ce;
      }

      const isSelected = selectedProjectId === p.project_id;

      // Architectural 8-sided faceted prism tower
      const towerGeo = new THREE.CylinderGeometry(radius * 0.8, radius * 1.05, height, 8);
      const towerMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x38bdf8 : colorHex,
        emissive: isSelected ? 0x38bdf8 : emissiveHex,
        emissiveIntensity: isSelected ? 0.95 : 0.45,
        roughness: 0.25,
        metalness: 0.4,
      });

      const pillar = new THREE.Mesh(towerGeo, towerMat);
      pillar.position.set(pos.x, height / 2, pos.z);
      pillar.castShadow = !isMobile;
      pillar.receiveShadow = !isMobile;
      pillar.userData = {
        project: p,
        risk,
        height,
        radius,
        baseColor: colorHex,
        baseEmissive: emissiveHex
      };

      pillarGroup.add(pillar);
      pillarMeshes.push(pillar);

      // Top glowing spherical obstruction beacon
      const beaconGeo = new THREE.SphereGeometry(radius * 0.75, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xffffff : colorHex,
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(pos.x, height + 0.3, pos.z);
      pillarGroup.add(beacon);

      // Metallic foundation disk
      const padGeo = new THREE.CylinderGeometry(radius * 1.35, radius * 1.45, 0.2, 12);
      const padMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x1e293b : 0x94a3b8,
        roughness: 0.5,
        metalness: 0.7,
      });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(pos.x, 0.1, pos.z);
      pad.receiveShadow = !isMobile;
      pillarGroup.add(pad);

      // Delayed or Critical ground indicator ring
      if (p.status === 'Delayed' || risk?.risk_tier === 'Critical') {
        const warnGeo = new THREE.RingGeometry(radius * 1.45, radius * 1.85, 24);
        const warnMat = new THREE.MeshBasicMaterial({
          color: 0xf43f5e,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.65,
        });
        const warnRing = new THREE.Mesh(warnGeo, warnMat);
        warnRing.rotation.x = -Math.PI / 2;
        warnRing.position.set(pos.x, 0.05, pos.z);
        pillarGroup.add(warnRing);
      }

      // Selection Halo Ring
      const selectHaloGeo = new THREE.RingGeometry(radius * 1.7, radius * 2.3, 28);
      const selectHaloMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.85 : 0.0,
      });
      const selectHalo = new THREE.Mesh(selectHaloGeo, selectHaloMat);
      selectHalo.rotation.x = -Math.PI / 2;
      selectHalo.position.set(pos.x, 0.06, pos.z);
      selectHalo.visible = isSelected;
      pillarGroup.add(selectHalo);
      selectionMap.set(p.project_id, selectHalo);
    });

    scene.add(pillarGroup);
    pillarMeshesRef.current = pillarMeshes;
    selectionBeaconsRef.current = selectionMap;

    // 9. Curved 3D DAG Dependency Arcs
    const arcGroup = new THREE.Group();
    const compMap = new Map(components.map(c => [c.component_id, c]));
    const projectPairs = new Set<string>();

    components.forEach(c => {
      if (!c.depends_on || !c.project_id) return;
      const parentComp = compMap.get(c.depends_on);
      if (!parentComp || !parentComp.project_id || parentComp.project_id === c.project_id) return;

      const pairKey = `${parentComp.project_id}->${c.project_id}`;
      if (projectPairs.has(pairKey)) return;
      projectPairs.add(pairKey);

      const posA = projectPositions.get(parentComp.project_id)?.pos;
      const posB = projectPositions.get(c.project_id)?.pos;
      if (!posA || !posB) return;

      const midPoint = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
      const dist = posA.distanceTo(posB);
      midPoint.y += Math.max(3.5, dist * 0.35);

      const curve = new THREE.CatmullRomCurve3([posA, midPoint, posB]);
      const points = curve.getPoints(36);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
      const curveMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: isDark ? 0.6 : 0.75,
        linewidth: 2,
      });

      const line = new THREE.Line(curveGeo, curveMat);
      arcGroup.add(line);
    });
    scene.add(arcGroup);

    // 10. Auto-Framing using THREE.Box3 bounding calculation
    const box = new THREE.Box3();
    if (pillarMeshes.length > 0) {
      box.setFromObject(pillarGroup);
    }

    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    if (!box.isEmpty()) {
      box.getCenter(center);
      box.getSize(size);
    } else {
      center.set(0, 0, 0);
      size.set(50, 10, 50);
    }

    const maxDim = Math.max(size.x, size.z, 28);
    const fov = camera.fov * (Math.PI / 180);
    let camDist = (maxDim / 2) / Math.tan(fov / 2);
    camDist = Math.max(48, camDist * 1.25);

    const defaultTarget = new THREE.Vector3(center.x, 2.0, center.z);
    const defaultCamPos = new THREE.Vector3(
      center.x + camDist * 0.62,
      center.y + camDist * 0.75,
      center.z + camDist * 0.82
    );

    camera.position.copy(defaultCamPos);
    controls.target.copy(defaultTarget);
    controls.update();

    // 11. Raycaster for Hover & Selection
    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      mousePos.x = ((mouseX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -((mouseY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mousePos, camera);
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
        container.style.cursor = 'default';
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mousePos, camera);
      const intersects = raycaster.intersectObjects(pillarMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const { project } = hit.userData;
        if (project) {
          onSelectProject(project.project_id);
        }
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('click', onClick);

    // Save camera controls to ref for HUD buttons
    sceneStateRef.current = {
      resetCamera: () => {
        camera.position.copy(defaultCamPos);
        controls.target.copy(defaultTarget);
        controls.update();
      },
      zoomCamera: (factor: number) => {
        const offset = camera.position.clone().sub(controls.target);
        offset.multiplyScalar(factor);
        offset.clampLength(12, 220);
        camera.position.copy(controls.target).add(offset);
        controls.update();
      },
      focusOnProject: (projId: string) => {
        const posData = projectPositions.get(projId);
        if (posData) {
          controls.target.set(posData.pos.x, posData.pos.y, posData.pos.z);
          camera.position.set(posData.pos.x + 18, posData.pos.y + 16, posData.pos.z + 20);
          controls.update();
        }
      }
    };

    // 12. Responsive Resize
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

    // 13. Render & Animation Loop
    let animationFrameId: number;
    let isRunning = true;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isRunning) return;
      animationFrameId = requestAnimationFrame(animate);

      if (isActive) {
        const elapsedTime = clock.getElapsedTime();
        beaconLight.position.x = Math.sin(elapsedTime * 0.45) * 20;
        beaconLight.position.z = Math.cos(elapsedTime * 0.45) * 20;

        controls.update();
        renderer.render(scene, camera);
      }
    };
    animate();

    // 14. Clean Cleanup on Unmount
    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();

      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('click', onClick);

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
  }, [validProjects, components, isDark, coordScale, geoBounds, projectPositions, derivedZones]);

  // Highlight and focus on selected project without rebuilding the entire scene
  useEffect(() => {
    if (!selectedProjectId) return;
    pillarMeshesRef.current.forEach(mesh => {
      const isSelected = mesh.userData?.project?.project_id === selectedProjectId;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissive.setHex(isSelected ? 0x38bdf8 : mesh.userData.baseEmissive);
        mat.emissiveIntensity = isSelected ? 0.95 : 0.45;
      }
    });

    selectionBeaconsRef.current.forEach((halo, pid) => {
      halo.visible = pid === selectedProjectId;
    });

    if (isActive) {
      sceneStateRef.current?.focusOnProject(selectedProjectId);
    }
  }, [selectedProjectId, isActive]);

  return (
    <div className="relative w-full h-[50dvh] min-h-[350px] sm:h-[500px] lg:h-[650px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 select-none touch-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

      {/* Floating 3D Navigation Controls Bar */}
      <div className="absolute top-4 right-4 flex items-center space-x-1.5 p-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-300 shadow-xl z-20">
        <button
          onClick={() => sceneStateRef.current?.zoomCamera(0.85)}
          title="Zoom In (+)"
          className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => sceneStateRef.current?.zoomCamera(1.15)}
          title="Zoom Out (-)"
          className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => sceneStateRef.current?.resetCamera()}
          title="Reset Camera Angle (Auto-Frame All Projects)"
          className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Legend & Status Overlay (Desktop / Tablet only) */}
      <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-800 text-xs text-slate-300 shadow-xl z-20 space-y-2 pointer-events-auto hidden sm:block">
        <div className="flex items-center space-x-2 font-medium text-slate-200 pb-1 border-b border-slate-800">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>3D City Twin Visual Encoding ({validProjects.length} Projects)</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
            <span>Running / Normal</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm" />
            <span>Completed / Approved</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
            <span>Elevated Risk / Watch</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm animate-pulse" />
            <span>Delayed / Critical</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
          Towers = Budget & Progress • Ground Pads = Real Municipal Zones
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
                <span className="text-slate-400">Location:</span>
                <p className="font-medium text-slate-300">{hoveredProject.project.location}</p>
              </div>
            </div>

            <div className="text-[10px] text-cyan-300/80 bg-cyan-950/40 p-1.5 rounded border border-cyan-900/50 flex items-center justify-between">
              <span>Click tower to inspect full DPP dossier</span>
              <span className="font-bold">→</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalTwin3D;
