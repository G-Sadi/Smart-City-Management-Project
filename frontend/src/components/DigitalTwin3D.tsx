import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Project, ComponentItem } from '../types';
import {
  InfrastructureCategory,
  ColorByMode,
  PhaseFilter,
  ProjectPaceInfo,
  CATEGORY_META,
  AGENCY_COLORS,
  PACE_COLORS,
  classifyInfrastructureCategory,
  calculateProjectPace,
  resolveProjectColor,
  computeDeclusteredPositions,
  createZoneBadgeCanvasTexture,
  createTacticalGroundCanvasTexture,
} from '../utils/digitalTwin3DUtils';
import {
  ZoomIn, ZoomOut, RotateCcw, Compass, MapPin, Eye,
  Layers, AlertTriangle, ShieldCheck, CheckCircle2,
  Clock, Activity, Calendar, Zap, RefreshCw, ChevronRight,
  Maximize2
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
  projects = [],
  components = [],
  selectedProjectId,
  onSelectProject,
  isDark = true,
  isActive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLError, setWebGLError] = useState<string | null>(null);

  // View state & Mode toggles
  const [colorByMode, setColorByMode] = useState<ColorByMode>('status');
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('all');
  const [showTacticalBase, setShowTacticalBase] = useState<boolean>(true);
  const [showZoneBadges, setShowZoneBadges] = useState<boolean>(true);

  // Interactive Hover state
  const [hoveredProject, setHoveredProject] = useState<{
    project: Project;
    paceInfo: ProjectPaceInfo;
    category: InfrastructureCategory;
    colorStr: string;
    screenX: number;
    screenY: number;
  } | null>(null);

  // 1. Sanitized & Precomputed Pace for each project
  const projectPaceMap = useMemo(() => {
    const map = new Map<string, ProjectPaceInfo>();
    projects.forEach(p => {
      if (!p || !p.project_id) return;
      map.set(p.project_id, calculateProjectPace(p));
    });
    return map;
  }, [projects]);

  // 2. Anti-Collision De-Clustering Engine (Zero Overlap & Zero Z-Fighting)
  const layoutData = useMemo(() => {
    return computeDeclusteredPositions(projects, 82.0);
  }, [projects]);

  const { projectPositions, zones } = layoutData;

  // 3. Live Aggregate KPIs for Bottom-Center Timeline Bar
  const aggregateKPIs = useMemo(() => {
    const total = projects.length;
    let filteredCount = 0;
    let progressSum = 0;
    let delayedCount = 0;
    let totalBudget = 0;

    projects.forEach(p => {
      const pace = projectPaceMap.get(p.project_id)?.pace || 'On Track';
      const comp = Number(p.completion) || 0;

      let matches = true;
      if (phaseFilter === 'not_started') matches = comp === 0;
      else if (phaseFilter === 'in_progress') matches = comp > 0 && comp < 100;
      else if (phaseFilter === 'delayed') matches = pace === 'Delayed' || pace === 'At Risk' || p.status === 'Delayed';
      else if (phaseFilter === 'completed') matches = comp >= 100 || p.status === 'Completed';

      if (matches) {
        filteredCount++;
        progressSum += comp;
        totalBudget += Number(p.cost) || 0;
        if (pace === 'Delayed' || pace === 'At Risk' || p.status === 'Delayed') {
          delayedCount++;
        }
      }
    });

    return {
      total,
      filteredCount,
      avgProgress: filteredCount > 0 ? Math.round(progressSum / filteredCount) : 0,
      delayedCount,
      totalBudget: Math.round(totalBudget),
    };
  }, [projects, projectPaceMap, phaseFilter]);

  // Three.js References for Animation, Camera Control Dock & Mesh lookup
  const sceneStateRef = useRef<{
    resetCamera: () => void;
    zoomCamera: (factor: number) => void;
    setIsometricView: () => void;
    setTopDownView: () => void;
    focusOnProject: (projId: string) => void;
  } | null>(null);

  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  const projectMeshesRef = useRef<Map<string, {
    group: THREE.Group;
    shellMesh: THREE.Mesh;
    coreMesh: THREE.Mesh;
    foundationMesh: THREE.Mesh;
    haloRing?: THREE.Mesh;
    beaconMesh: THREE.Mesh;
    project: Project;
    paceInfo: ProjectPaceInfo;
    category: InfrastructureCategory;
  }>>(new Map());

  const selectionMarkerRef = useRef<{
    haloRing: THREE.Mesh;
    laserBeacon: THREE.Line;
    pointLight: THREE.PointLight;
  } | null>(null);

  // Main Three.js Scene Setup & Lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width || container.clientWidth || 800;
    const height = rect.height || container.clientHeight || 600;

    if (width <= 0 || height <= 0) return;

    setWebGLError(null);

    // 1. WebGL Renderer with High-Contrast ACES Filmic Tone Mapping
    let renderer: THREE.WebGLRenderer;
    try {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = !isMobile;
      if (!isMobile) {
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }
    } catch (err: any) {
      console.error('Failed to create WebGLRenderer:', err);
      setWebGLError(err?.message || 'WebGL context initialization failed');
      return;
    }

    container.innerHTML = '';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // 2. Midnight Geospatial Scene & Distance Fog
    const scene = new THREE.Scene();
    const BG_COLOR = 0x080d1a;
    scene.background = new THREE.Color(BG_COLOR);
    // Subtle distance fog keeping all 24 municipal zones crisp and legible
    scene.fog = new THREE.Fog(BG_COLOR, 85, 290);

    // 3. Perspective Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.2, 1000);

    // 4. Smooth OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.screenSpacePanning = true;
    controls.minDistance = 6;
    controls.maxDistance = 270;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minPolarAngle = 0.05;

    // 5. Studio-Grade Multi-Source Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x60a5fa, 0x080d1a, 1.45);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 640;
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(70, 110, 55);
    keyLight.castShadow = !isMobileDevice;
    if (!isMobileDevice) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 420;
      keyLight.shadow.camera.left = -95;
      keyLight.shadow.camera.right = 95;
      keyLight.shadow.camera.top = 95;
      keyLight.shadow.camera.bottom = -95;
      keyLight.shadow.bias = -0.0004;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.25);
    fillLight.position.set(-70, 50, -60);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 0.85);
    rimLight.position.set(20, 35, -80);
    scene.add(rimLight);

    // Orbiting Cyan City Beacon Light
    const cityBeaconLight = new THREE.PointLight(0x06b6d4, 1.5, 140);
    cityBeaconLight.position.set(0, 28, 0);
    scene.add(cityBeaconLight);

    // 6. Tactical GIS Base Plane (Matte Dark Slab + High-Tech Vector Grid)
    const groundSize = 220;
    const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);

    // Optional Tactical Canvas Texture
    const tacticalCanvas = createTacticalGroundCanvasTexture();
    const tacticalTexture = new THREE.CanvasTexture(tacticalCanvas);
    tacticalTexture.wrapS = THREE.ClampToEdgeWrapping;
    tacticalTexture.wrapT = THREE.ClampToEdgeWrapping;

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x080d1a,
      map: showTacticalBase ? tacticalTexture : null,
      roughness: 0.82,
      metalness: 0.18,
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = !isMobileDevice;
    scene.add(ground);

    // Major & Minor Tactical Coordinate Grids
    const majorGrid = new THREE.GridHelper(groundSize, 22, 0x0ea5e9, 0x1e293b);
    majorGrid.position.y = 0.01;
    (majorGrid.material as THREE.Material).transparent = true;
    (majorGrid.material as THREE.Material).opacity = 0.4;
    scene.add(majorGrid);

    const minorGrid = new THREE.GridHelper(groundSize, 88, 0x1e293b, 0x0f172a);
    minorGrid.position.y = 0.01;
    (minorGrid.material as THREE.Material).transparent = true;
    (minorGrid.material as THREE.Material).opacity = 0.22;
    scene.add(minorGrid);

    // 7. 24 Municipal Zone Elevated Pads & Floating Billboard Badges
    const zoneGroup = new THREE.Group();
    const zoneBadgeSprites: THREE.Sprite[] = [];

    zones.forEach(z => {
      // Elevated Translucent Ground Pad
      const padGeo = new THREE.CylinderGeometry(z.radius * 0.94, z.radius * 0.98, 0.22, 36);
      const padMat = new THREE.MeshStandardMaterial({
        color: 0x0c1527,
        transparent: true,
        opacity: 0.72,
        roughness: 0.5,
        metalness: 0.2,
      });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(z.worldX, 0.11, z.worldZ);
      pad.receiveShadow = !isMobileDevice;
      zoneGroup.add(pad);

      // Outer Glowing Zone Perimeter Ring
      const ringGeo = new THREE.RingGeometry(z.radius * 0.95, z.radius, 40);
      const ringMat = new THREE.MeshBasicMaterial({
        color: z.colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(z.worldX, 0.24, z.worldZ);
      zoneGroup.add(ring);

      // Floating Zone Billboard Badge Sprite
      if (showZoneBadges) {
        const badgeCanvas = createZoneBadgeCanvasTexture(z.name, z.projectCount, z.totalBudgetCr, z.colorStr);
        const badgeTex = new THREE.CanvasTexture(badgeCanvas);
        badgeTex.minFilter = THREE.LinearFilter;
        const spriteMat = new THREE.SpriteMaterial({
          map: badgeTex,
          transparent: true,
          depthWrite: false,
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(z.worldX, 3.4, z.worldZ - z.radius * 0.78);
        sprite.scale.set(9.0, 2.8, 1.0);
        zoneGroup.add(sprite);
        zoneBadgeSprites.push(sprite);
      }
    });
    scene.add(zoneGroup);

    // 8. Procedural Architectural Silhouettes (Dual-Layer: Ghost Scope Shell + Solid Core)
    const buildingsGroup = new THREE.Group();
    const raycastTargets: THREE.Mesh[] = [];
    const projectMeshesMap = new Map<string, any>();
    const delayedHalos: THREE.Mesh[] = [];

    projects.forEach(p => {
      const posData = projectPositions.get(p.project_id);
      if (!posData) return;

      const paceInfo = projectPaceMap.get(p.project_id) || calculateProjectPace(p);
      const colors = resolveProjectColor(p, paceInfo, colorByMode);
      const { worldX, worldZ, anchorX, anchorZ, isDeclustered, category, height } = posData;

      const comp = Math.max(0, Math.min(100, Number(p.completion) || 0));
      // Solid core fills upward with progress. Minimum 0.6 base foundation plinth so 0% progress projects are never flat!
      const coreHeight = Math.max(0.65, height * (comp / 100));

      const isSelected = selectedProjectId === p.project_id;
      const isDelayed = paceInfo.pace === 'Delayed' || paceInfo.pace === 'At Risk' || p.status === 'Delayed';

      // Building Root Group
      const bGroup = new THREE.Group();
      bGroup.position.set(worldX, 0, worldZ);

      // A. Ground Foundation Plinth (Solid illuminated baseline)
      const plinthGeo = new THREE.CylinderGeometry(1.65, 1.85, 0.35, 16);
      const plinthMat = new THREE.MeshStandardMaterial({
        color: 0x111c33,
        roughness: 0.6,
        metalness: 0.5,
      });
      const plinth = new THREE.Mesh(plinthGeo, plinthMat);
      plinth.position.y = 0.175;
      plinth.receiveShadow = !isMobileDevice;
      bGroup.add(plinth);

      // Base Status Ring
      const baseRingGeo = new THREE.RingGeometry(1.6, 2.0, 24);
      const baseRingMat = new THREE.MeshBasicMaterial({
        color: colors.hex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
      baseRing.rotation.x = -Math.PI / 2;
      baseRing.position.y = 0.36;
      bGroup.add(baseRing);

      // B. Procedural Architectural Geometry by Category
      let shellGeo: THREE.BufferGeometry;
      let coreGeo: THREE.BufferGeometry;
      let beaconGeo: THREE.BufferGeometry;
      let beaconY = height + 0.5;

      switch (category) {
        case 'Healthcare':
          // Cross-shaped clinical block
          shellGeo = new THREE.BoxGeometry(1.6, height, 1.6);
          coreGeo = new THREE.BoxGeometry(1.4, coreHeight, 1.4);
          beaconGeo = new THREE.SphereGeometry(0.55, 12, 12);
          beaconY = height + 0.45;
          break;

        case 'Education':
          // Multi-wing stepped academic campus block
          shellGeo = new THREE.BoxGeometry(2.2, height, 1.5);
          coreGeo = new THREE.BoxGeometry(2.0, coreHeight, 1.35);
          beaconGeo = new THREE.ConeGeometry(0.75, 1.0, 4);
          beaconY = height + 0.6;
          break;

        case 'Transport':
          // Elevated transit span / dual pylon tower
          shellGeo = new THREE.BoxGeometry(2.6, height, 0.9);
          coreGeo = new THREE.BoxGeometry(2.4, coreHeight, 0.75);
          beaconGeo = new THREE.BoxGeometry(2.7, 0.3, 1.1);
          beaconY = height + 0.25;
          break;

        case 'Utilities':
          // Cylindrical water tower / reservoir column
          shellGeo = new THREE.CylinderGeometry(1.0, 1.25, height, 16);
          coreGeo = new THREE.CylinderGeometry(0.85, 1.1, coreHeight, 16);
          beaconGeo = new THREE.SphereGeometry(1.1, 16, 12);
          beaconY = height + 0.7;
          break;

        case 'Recreation':
          // Stepped tiered hexagonal pavilion / eco terraces
          shellGeo = new THREE.CylinderGeometry(1.7, 2.0, height, 6);
          coreGeo = new THREE.CylinderGeometry(1.5, 1.8, coreHeight, 6);
          beaconGeo = new THREE.CylinderGeometry(1.6, 0.8, 0.25, 6);
          beaconY = height + 0.3;
          break;

        case 'Civic':
        default:
          // Modern stepped administrative skyscraper
          shellGeo = new THREE.BoxGeometry(1.8, height, 1.8);
          coreGeo = new THREE.BoxGeometry(1.55, coreHeight, 1.55);
          beaconGeo = new THREE.ConeGeometry(0.6, 1.4, 4);
          beaconY = height + 0.7;
          break;
      }

      // Outer Translucent Wireframe / Glass Shell (100% Planned Scope)
      const shellMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x38bdf8 : colors.hex,
        transparent: true,
        opacity: isSelected ? 0.45 : 0.24,
        roughness: 0.18,
        metalness: 0.35,
      });
      const shellMesh = new THREE.Mesh(shellGeo, shellMat);
      shellMesh.position.y = 0.35 + height / 2;
      shellMesh.castShadow = !isMobileDevice;
      shellMesh.receiveShadow = !isMobileDevice;
      bGroup.add(shellMesh);

      // Inner Solid Illuminated Core (Fills upward with actual completion %)
      const coreMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x38bdf8 : colors.hex,
        emissive: isSelected ? 0x0284c7 : colors.emissive,
        emissiveIntensity: isSelected ? 1.2 : 0.8,
        roughness: 0.3,
        metalness: 0.4,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = 0.35 + coreHeight / 2;
      coreMesh.castShadow = !isMobileDevice;
      coreMesh.receiveShadow = !isMobileDevice;
      bGroup.add(coreMesh);

      // Top Illuminated Crown / Beacon
      const beaconMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xffffff : colors.hex,
        emissive: isSelected ? 0x38bdf8 : colors.emissive,
        emissiveIntensity: 1.0,
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.y = beaconY;
      bGroup.add(beaconMesh);

      // C. Animated Pulsing Ground Halo for Delayed / Critical Projects
      let haloMesh: THREE.Mesh | undefined;
      if (isDelayed) {
        const haloGeo = new THREE.RingGeometry(2.1, 2.7, 32);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0xef4444,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75,
        });
        haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.rotation.x = -Math.PI / 2;
        haloMesh.position.y = 0.37;
        bGroup.add(haloMesh);
        delayedHalos.push(haloMesh);
      }

      // D. Subtle Ground Connector Line to Geographic Anchor (for de-clustered projects)
      if (isDeclustered) {
        const linePts = [
          new THREE.Vector3(anchorX - worldX, 0.08, anchorZ - worldZ),
          new THREE.Vector3(0, 0.08, 0),
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.45,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        bGroup.add(line);

        // Ground Anchor Dot
        const dotGeo = new THREE.CircleGeometry(0.35, 12);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.rotation.x = -Math.PI / 2;
        dot.position.set(anchorX - worldX, 0.09, anchorZ - worldZ);
        bGroup.add(dot);
      }

      // Attach User Data for Raycasting
      const userData = {
        project: p,
        paceInfo,
        category,
        colorStr: colors.str,
      };
      shellMesh.userData = userData;
      coreMesh.userData = userData;

      raycastTargets.push(shellMesh, coreMesh);
      buildingsGroup.add(bGroup);

      projectMeshesMap.set(p.project_id, {
        group: bGroup,
        shellMesh,
        coreMesh,
        foundationMesh: plinth,
        haloRing: haloMesh,
        beaconMesh,
        project: p,
        paceInfo,
        category,
      });
    });

    scene.add(buildingsGroup);
    projectMeshesRef.current = projectMeshesMap;

    // 9. Selected Project Glowing Cyan Laser & Ring
    const selRingGeo = new THREE.RingGeometry(2.8, 3.6, 36);
    const selRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const selRing = new THREE.Mesh(selRingGeo, selRingMat);
    selRing.rotation.x = -Math.PI / 2;
    selRing.position.y = 0.4;
    selRing.visible = false;
    scene.add(selRing);

    // Skyward Laser Line
    const laserPts = [new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(0, 45, 0)];
    const laserGeo = new THREE.BufferGeometry().setFromPoints(laserPts);
    const laserMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
    });
    const laser = new THREE.Line(laserGeo, laserMat);
    laser.visible = false;
    scene.add(laser);

    // Point Light for Selected Building
    const selLight = new THREE.PointLight(0x38bdf8, 2.5, 35);
    selLight.position.set(0, 15, 0);
    selLight.visible = false;
    scene.add(selLight);

    selectionMarkerRef.current = {
      haloRing: selRing,
      laserBeacon: laser,
      pointLight: selLight,
    };

    // 10. Auto-Framing using Bounding Box
    const box = new THREE.Box3();
    if (raycastTargets.length > 0) {
      box.setFromObject(buildingsGroup);
    }
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    if (!box.isEmpty()) {
      box.getCenter(center);
      box.getSize(size);
    } else {
      center.set(0, 0, 0);
      size.set(60, 15, 60);
    }

    const maxDim = Math.max(size.x, size.z, 30);
    const fov = camera.fov * (Math.PI / 180);
    let camDist = (maxDim / 2) / Math.tan(fov / 2);
    camDist = Math.max(48, camDist * 1.25);

    const defaultTarget = new THREE.Vector3(center.x, 2.0, center.z);
    const defaultCamPos = new THREE.Vector3(
      center.x + camDist * 0.62,
      center.y + camDist * 0.72,
      center.z + camDist * 0.78
    );

    camera.position.copy(defaultCamPos);
    controls.target.copy(defaultTarget);
    controls.update();

    // 11. Smooth Camera Transition Controller
    let camAnim: {
      startPos: THREE.Vector3;
      targetPos: THREE.Vector3;
      startTarget: THREE.Vector3;
      targetLookAt: THREE.Vector3;
      startTime: number;
      duration: number;
    } | null = null;

    const startCameraLerp = (toPos: THREE.Vector3, toTarget: THREE.Vector3, duration: number = 850) => {
      camAnim = {
        startPos: camera.position.clone(),
        targetPos: toPos.clone(),
        startTarget: controls.target.clone(),
        targetLookAt: toTarget.clone(),
        startTime: performance.now(),
        duration,
      };
    };

    // Camera Dock Actions
    sceneStateRef.current = {
      resetCamera: () => {
        startCameraLerp(defaultCamPos, defaultTarget, 900);
      },
      zoomCamera: (factor: number) => {
        const offset = camera.position.clone().sub(controls.target);
        offset.multiplyScalar(factor);
        offset.clampLength(8, 250);
        const newPos = controls.target.clone().add(offset);
        startCameraLerp(newPos, controls.target, 550);
      },
      setIsometricView: () => {
        const isoPos = new THREE.Vector3(
          controls.target.x + camDist * 0.72,
          controls.target.y + camDist * 0.82,
          controls.target.z + camDist * 0.72
        );
        startCameraLerp(isoPos, controls.target, 900);
      },
      setTopDownView: () => {
        const topPos = new THREE.Vector3(
          controls.target.x,
          controls.target.y + camDist * 1.35,
          controls.target.z + 0.05
        );
        startCameraLerp(topPos, controls.target, 950);
      },
      focusOnProject: (projId: string) => {
        const entry = projectMeshesMap.get(projId);
        if (entry) {
          const bPos = entry.group.position;
          const targetLookAt = new THREE.Vector3(bPos.x, 3.5, bPos.z);
          const targetCam = new THREE.Vector3(bPos.x + 18, bPos.y + 16, bPos.z + 20);
          startCameraLerp(targetCam, targetLookAt, 850);
        }
      },
    };

    // 12. Raycasting for Hover & Click
    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const bRect = container.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      mousePos.x = ((mouseX - bRect.left) / bRect.width) * 2 - 1;
      mousePos.y = -((mouseY - bRect.top) / bRect.height) * 2 + 1;

      raycaster.setFromCamera(mousePos, camera);
      const intersects = raycaster.intersectObjects(raycastTargets, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const data = hit.userData;
        if (data && data.project) {
          setHoveredProject({
            project: data.project,
            paceInfo: data.paceInfo,
            category: data.category,
            colorStr: data.colorStr,
            screenX: mouseX - bRect.left,
            screenY: mouseY - bRect.top,
          });
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredProject(null);
      container.style.cursor = 'default';
    };

    const onClick = (e: MouseEvent) => {
      const bRect = container.getBoundingClientRect();
      mousePos.x = ((e.clientX - bRect.left) / bRect.width) * 2 - 1;
      mousePos.y = -((e.clientY - bRect.top) / bRect.height) * 2 + 1;

      raycaster.setFromCamera(mousePos, camera);
      const intersects = raycaster.intersectObjects(raycastTargets, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const data = hit.userData;
        if (data && data.project) {
          onSelectProject(data.project.project_id);
          sceneStateRef.current?.focusOnProject(data.project.project_id);
        }
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('click', onClick);

    // 13. Responsive ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const curW = container.clientWidth;
      const curH = container.clientHeight;
      if (curW <= 0 || curH <= 0) return;
      camera.aspect = curW / curH;
      camera.updateProjectionMatrix();
      renderer.setSize(curW, curH, false);
      renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    // 14. 60 FPS Render & Animation Loop
    let animationFrameId: number;
    let isRunning = true;
    const clock = new THREE.Clock();

    // Render immediate first frame
    controls.update();
    renderer.render(scene, camera);

    const cubicEaseInOut = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animate = () => {
      if (!isRunning) return;
      animationFrameId = requestAnimationFrame(animate);

      if (isActiveRef.current) {
        const elapsedTime = clock.getElapsedTime();

        // Orbiting City Beacon Light
        cityBeaconLight.position.x = Math.sin(elapsedTime * 0.4) * 25;
        cityBeaconLight.position.z = Math.cos(elapsedTime * 0.4) * 25;

        // Pulsing Delayed Halos
        const pulseOpacity = 0.35 + 0.35 * Math.sin(elapsedTime * 3.5);
        delayedHalos.forEach(h => {
          (h.material as THREE.MeshBasicMaterial).opacity = pulseOpacity;
        });

        // Smooth Camera Transition Lerp
        if (camAnim) {
          const now = performance.now();
          const progress = Math.min(1.0, (now - camAnim.startTime) / camAnim.duration);
          const ease = cubicEaseInOut(progress);

          camera.position.lerpVectors(camAnim.startPos, camAnim.targetPos, ease);
          controls.target.lerpVectors(camAnim.startTarget, camAnim.targetLookAt, ease);
          controls.update();

          if (progress >= 1.0) {
            camAnim = null;
          }
        } else {
          controls.update();
        }

        renderer.render(scene, camera);
      }
    };
    animate();

    // 15. Cleanup on Unmount
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
      majorGrid.dispose();
      minorGrid.dispose();
      tacticalTexture.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [projects, components, isDark, colorByMode, layoutData, onSelectProject, showTacticalBase, showZoneBadges]);

  // Synchronize Project Selection (Update Halos & Focus without Rebuilding WebGL)
  useEffect(() => {
    const marker = selectionMarkerRef.current;
    if (!marker) return;

    if (!selectedProjectId) {
      marker.haloRing.visible = false;
      marker.laserBeacon.visible = false;
      marker.pointLight.visible = false;
      return;
    }

    const entry = projectMeshesRef.current.get(selectedProjectId);
    if (entry) {
      const bPos = entry.group.position;
      marker.haloRing.position.set(bPos.x, 0.4, bPos.z);
      marker.haloRing.visible = true;

      marker.laserBeacon.position.set(bPos.x, 0, bPos.z);
      marker.laserBeacon.visible = true;

      marker.pointLight.position.set(bPos.x, 14, bPos.z);
      marker.pointLight.visible = true;

      if (isActive) {
        sceneStateRef.current?.focusOnProject(selectedProjectId);
      }
    }
  }, [selectedProjectId, isActive]);

  // Update Visual Opacity when Phase Filter changes
  useEffect(() => {
    projectMeshesRef.current.forEach(({ shellMesh, coreMesh, project, paceInfo }) => {
      const comp = Number(project.completion) || 0;
      let matches = true;

      if (phaseFilter === 'not_started') matches = comp === 0;
      else if (phaseFilter === 'in_progress') matches = comp > 0 && comp < 100;
      else if (phaseFilter === 'delayed') matches = paceInfo.pace === 'Delayed' || paceInfo.pace === 'At Risk' || project.status === 'Delayed';
      else if (phaseFilter === 'completed') matches = comp >= 100 || project.status === 'Completed';

      const sMat = shellMesh.material as THREE.MeshStandardMaterial;
      const cMat = coreMesh.material as THREE.MeshStandardMaterial;

      if (matches) {
        sMat.opacity = 0.25;
        cMat.opacity = 1.0;
        cMat.transparent = false;
      } else {
        sMat.opacity = 0.06;
        cMat.opacity = 0.12;
        cMat.transparent = true;
      }
    });
  }, [phaseFilter]);

  return (
    <div className="relative w-full h-[54dvh] min-h-[380px] sm:h-[500px] lg:h-[650px] rounded-2xl overflow-hidden border border-slate-800 bg-[#080d1a] select-none touch-none shadow-2xl">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

      {/* WebGL Hardware Acceleration Error Fallback */}
      {webGLError && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 bg-[#080d1a]/95 text-center text-slate-300 space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-400" />
          <h4 className="text-sm font-bold text-white">WebGL Initialization Required</h4>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            {webGLError}. Please ensure hardware acceleration is enabled in your browser settings.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Application</span>
          </button>
        </div>
      )}

      {/* TOP-RIGHT: Tactical Camera Control Dock */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex flex-col space-y-2 pointer-events-auto">
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800 text-slate-300 shadow-xl">
          <button
            onClick={() => sceneStateRef.current?.zoomCamera(0.8)}
            title="Zoom In (+)"
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => sceneStateRef.current?.zoomCamera(1.25)}
            title="Zoom Out (-)"
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => sceneStateRef.current?.setIsometricView()}
            title="45° Isometric View"
            className="px-2 py-1 rounded-lg text-[10px] font-bold font-mono hover:bg-slate-800 hover:text-white text-slate-400 transition-colors"
          >
            ISO
          </button>
          <button
            onClick={() => sceneStateRef.current?.setTopDownView()}
            title="Top-Down Plan View"
            className="px-2 py-1 rounded-lg text-[10px] font-bold font-mono hover:bg-slate-800 hover:text-white text-slate-400 transition-colors"
          >
            PLAN
          </button>
          <button
            onClick={() => sceneStateRef.current?.resetCamera()}
            title="Reset Auto-Frame View"
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tactical Map Base Toggle */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => setShowTacticalBase(!showTacticalBase)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-semibold backdrop-blur-md transition-all shadow-md ${
              showTacticalBase
                ? 'bg-slate-900/85 border-cyan-500/40 text-cyan-400'
                : 'bg-slate-900/85 border-slate-800 text-slate-400'
            }`}
            title="Toggle Tactical Radar & Waterway Map Base"
          >
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>Map Base: {showTacticalBase ? 'Radar ON' : 'Grid'}</span>
          </button>
        </div>
      </div>

      {/* BOTTOM-LEFT: Color-By Mode Switcher & Category Legend */}
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 space-y-2 pointer-events-auto max-w-[280px] sm:max-w-xs">
        {/* Color-By Selector */}
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs text-slate-300 shadow-xl space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Color Encoding</span>
            </span>
            <span className="font-mono text-cyan-400">{projects.length} Projects</span>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] font-semibold">
            <button
              onClick={() => setColorByMode('status')}
              className={`py-1 rounded text-center transition-all ${
                colorByMode === 'status'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pace & Status
            </button>
            <button
              onClick={() => setColorByMode('agency')}
              className={`py-1 rounded text-center transition-all ${
                colorByMode === 'agency'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              5 Agencies
            </button>
            <button
              onClick={() => setColorByMode('progress')}
              className={`py-1 rounded text-center transition-all ${
                colorByMode === 'progress'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Progress %
            </button>
          </div>

          {/* Color Key Explanation */}
          {colorByMode === 'status' && (
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] pt-1 text-slate-300">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>On Track / Normal</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Ahead of Plan</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Delayed / Behind</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Completed</span>
              </div>
            </div>
          )}

          {colorByMode === 'agency' && (
            <div className="grid grid-cols-3 gap-1 text-[10px] pt-1 text-slate-300 font-mono">
              {Object.entries(AGENCY_COLORS).map(([code, meta]) => (
                <div key={code} className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.str }} />
                  <span>{code}</span>
                </div>
              ))}
            </div>
          )}

          {colorByMode === 'progress' && (
            <div className="grid grid-cols-4 gap-1 text-[9px] pt-1 text-slate-300 font-mono text-center">
              <span className="px-1 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">0-24%</span>
              <span className="px-1 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">25-49%</span>
              <span className="px-1 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">50-74%</span>
              <span className="px-1 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">75-100%</span>
            </div>
          )}

          {/* Infrastructure Category Shape Key */}
          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300 flex items-center justify-between">
              <span>Architectural Silhouettes:</span>
              <span className="text-[9px] text-cyan-400 font-mono">Ghost = Scope • Solid = Core</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <div key={key} className="flex items-center space-x-1 truncate">
                  <span>{meta.emoji}</span>
                  <span className="truncate">{meta.label.split('&')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM-CENTER: Working-Time & Phase Timeline Bar */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto hidden md:block max-w-xl w-full px-4">
        <div className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-2xl space-y-1.5">
          {/* Phase Filter Tabs */}
          <div className="flex items-center justify-between space-x-1 text-[11px] font-semibold">
            <button
              onClick={() => setPhaseFilter('all')}
              className={`flex-1 py-1 px-2 rounded-lg text-center transition-all ${
                phaseFilter === 'all'
                  ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({aggregateKPIs.total})
            </button>
            <button
              onClick={() => setPhaseFilter('not_started')}
              className={`flex-1 py-1 px-2 rounded-lg text-center transition-all ${
                phaseFilter === 'not_started'
                  ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-800 shadow-xs'
                  : 'text-slate-400 hover:text-indigo-300'
              }`}
            >
              Not Started (0%)
            </button>
            <button
              onClick={() => setPhaseFilter('in_progress')}
              className={`flex-1 py-1 px-2 rounded-lg text-center transition-all ${
                phaseFilter === 'in_progress'
                  ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800 shadow-xs'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setPhaseFilter('delayed')}
              className={`flex-1 py-1 px-2 rounded-lg text-center transition-all ${
                phaseFilter === 'delayed'
                  ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800 shadow-xs'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              Delayed / Attention ({aggregateKPIs.delayedCount})
            </button>
            <button
              onClick={() => setPhaseFilter('completed')}
              className={`flex-1 py-1 px-2 rounded-lg text-center transition-all ${
                phaseFilter === 'completed'
                  ? 'bg-blue-950 text-blue-300 font-bold border border-blue-800 shadow-xs'
                  : 'text-slate-400 hover:text-blue-300'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Timeline KPI Ticker */}
          <div className="flex items-center justify-between px-2 pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            <span>
              Showing: <strong className="text-white">{aggregateKPIs.filteredCount}</strong> projects
            </span>
            <span>
              Avg Progress: <strong className="text-emerald-400">{aggregateKPIs.avgProgress}%</strong>
            </span>
            <span>
              Delayed: <strong className="text-rose-400">{aggregateKPIs.delayedCount}</strong>
            </span>
            <span>
              Budget: <strong className="text-cyan-400">৳{aggregateKPIs.totalBudget.toLocaleString()} Cr</strong>
            </span>
          </div>
        </div>
      </div>

      {/* FLOATING HOVER INSPECTOR CARD (Enriched with Working Time & Pace) */}
      {hoveredProject && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
          style={{
            left: `${hoveredProject.screenX}px`,
            top: `${hoveredProject.screenY}px`,
          }}
        >
          <div className="w-80 max-w-[calc(100vw-32px)] p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 text-white shadow-2xl space-y-2.5">
            {/* Header: Project ID, Category & Pace Badge */}
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-bold">
                    {hoveredProject.project.project_id}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {CATEGORY_META[hoveredProject.category].emoji} {CATEGORY_META[hoveredProject.category].label.split('&')[0]}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 line-clamp-1 leading-snug">
                  {hoveredProject.project.name}
                </h4>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  hoveredProject.paceInfo.pace === 'Delayed'
                    ? 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                    : hoveredProject.paceInfo.pace === 'At Risk'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : hoveredProject.paceInfo.pace === 'Ahead'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : hoveredProject.paceInfo.pace === 'Completed'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                    : hoveredProject.paceInfo.pace === 'Not Started'
                    ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                ● {hoveredProject.paceInfo.pace}
              </span>
            </div>

            {/* Working Time & Schedule Window */}
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>Working Time Window:</span>
                </span>
                <span className="font-mono text-slate-200">{hoveredProject.paceInfo.durationYears} Years</span>
              </div>
              <div className="font-mono text-[10px] text-cyan-300 flex items-center justify-between">
                <span>Start: {hoveredProject.paceInfo.startDateText}</span>
                <span>→</span>
                <span>Est End: {hoveredProject.paceInfo.endDateText}</span>
              </div>
            </div>

            {/* Execution Progress & Budget Spent vs Allocated */}
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Physical Progress:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {hoveredProject.project.completion}%
                  <span className="text-slate-500 font-normal ml-1">
                    (Expected {hoveredProject.paceInfo.expectedProgress}%)
                  </span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, hoveredProject.project.completion)}%`,
                    backgroundColor: hoveredProject.colorStr,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                <div>
                  <span className="text-slate-400">Budget Spent / Total:</span>
                  <p className="font-semibold text-cyan-400 font-mono">
                    ৳{hoveredProject.project.actual_cost || 0} / ৳{hoveredProject.project.cost} Cr
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Zone & Agency:</span>
                  <p className="font-semibold text-slate-200 truncate">
                    {hoveredProject.project.location} • {hoveredProject.project.exec}
                  </p>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="text-[10px] text-cyan-300/90 bg-cyan-950/40 px-2 py-1.5 rounded-lg border border-cyan-900/60 flex items-center justify-between">
              <span>Click building to frame & inspect DPP details</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalTwin3D;
