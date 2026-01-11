import { useRef, Suspense, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import cyrusCoinFaceTexture from "@/assets/cyrus-coin-face.png";
import freedomLionTexture from "@/assets/freedom-lion.png";
import coinEdgeTexture from "@/assets/coin-edge.png";
import coinEdgeTextureAlt from "@/assets/coin-edge-reeded.png";

interface CoinProps {
  rotation: [number, number, number];
  showRings?: boolean;
  flatView?: boolean; // For navbar: show face-on, flip only
}

// Separate component for parallax rings - gold with fibonacci spacing and edge texture
const ParallaxRings = ({ rotation }: { rotation: [number, number, number] }) => {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  const edgeTexture = useLoader(THREE.TextureLoader, coinEdgeTexture);
  const { gl } = useThree();

  useEffect(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy?.() ?? 1;
    edgeTexture.colorSpace = THREE.SRGBColorSpace;
    edgeTexture.wrapS = THREE.RepeatWrapping;
    edgeTexture.wrapT = THREE.RepeatWrapping;
    edgeTexture.anisotropy = maxAniso;
    edgeTexture.needsUpdate = true;
  }, [edgeTexture, gl]);

  // Fibonacci-inspired spacing: gaps increase as 0.13, 0.21, 0.34
  // Coin radius is ~1.92, so first ring starts at 2.05
  // Very thin rings (0.03 width) with increasing gaps
  const ringThickness = 0.04; // tube radius for torus
  const ringWidth = 0.03; // unused now but kept for reference
  
  const rings = useMemo(() => [
    { innerR: 2.05, outerR: 2.05 + ringWidth, repeat: 14 },   // gap 0.13 from coin
    { innerR: 2.29, outerR: 2.29 + ringWidth, repeat: 16 },   // gap 0.21 from inner
    { innerR: 2.66, outerR: 2.66 + ringWidth, repeat: 18 },   // gap 0.34 from middle
  ], []);

  // Parallax rotation - rings follow coin's X-axis rotation at different speeds
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (ring1Ref.current) {
      // Inner ring - fastest parallax, follows coin rotation most closely
      ring1Ref.current.rotation.x = rotation[0] * 0.6 + t * 0.12 + Math.sin(t * 0.3) * 0.05;
      ring1Ref.current.rotation.y = Math.sin(t * 0.2) * 0.08;
    }
    if (ring2Ref.current) {
      // Middle ring - medium parallax
      ring2Ref.current.rotation.x = rotation[0] * 0.4 + t * 0.09 + Math.sin(t * 0.25 + 1) * 0.04;
      ring2Ref.current.rotation.y = Math.sin(t * 0.15 + 0.5) * 0.06;
    }
    if (ring3Ref.current) {
      // Outer ring - slowest parallax
      ring3Ref.current.rotation.x = rotation[0] * 0.25 + t * 0.06 + Math.sin(t * 0.2 + 2) * 0.03;
      ring3Ref.current.rotation.y = Math.sin(t * 0.1 + 1) * 0.04;
    }
  });

  const createRingMaterial = (repeat: number) => {
    const tex = edgeTexture.clone();
    tex.repeat.set(repeat, 1);
    tex.needsUpdate = true;
    return tex;
  };

  return (
    <Float speed={0.5} rotationIntensity={0.01} floatIntensity={0.05}>
      {/* Inner ring - fastest parallax */}
      <group ref={ring1Ref}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[rings[0].innerR, ringThickness, 16, 128]} />
          <meshStandardMaterial
            map={createRingMaterial(rings[0].repeat)}
            bumpMap={createRingMaterial(rings[0].repeat)}
            bumpScale={0.15}
            metalness={0.95}
            roughness={0.15}
            color="#D4AF37"
            emissive="#C9A227"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Middle ring - medium parallax */}
      <group ref={ring2Ref}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[rings[1].innerR, ringThickness, 16, 128]} />
          <meshStandardMaterial
            map={createRingMaterial(rings[1].repeat)}
            bumpMap={createRingMaterial(rings[1].repeat)}
            bumpScale={0.15}
            metalness={0.95}
            roughness={0.15}
            color="#C9A227"
            emissive="#B8860B"
            emissiveIntensity={0.15}
          />
        </mesh>
      </group>

      {/* Outer ring - slowest parallax */}
      <group ref={ring3Ref}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[rings[2].innerR, ringThickness, 16, 128]} />
          <meshStandardMaterial
            map={createRingMaterial(rings[2].repeat)}
            bumpMap={createRingMaterial(rings[2].repeat)}
            bumpScale={0.15}
            metalness={0.95}
            roughness={0.15}
            color="#B8860B"
            emissive="#8B7500"
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
};

const Coin = ({ rotation, showRings = true, flatView = false }: CoinProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();

  // Load textures
  const frontTexture = useLoader(THREE.TextureLoader, cyrusCoinFaceTexture);
  const backTexture = useLoader(THREE.TextureLoader, freedomLionTexture);
  const edgeTexture = useLoader(THREE.TextureLoader, coinEdgeTexture);

  useEffect(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy?.() ?? 1;

    const prepFace = (t: THREE.Texture) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = maxAniso;
      t.needsUpdate = true;
    };

    const prepEdge = (t: THREE.Texture) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(18, 0.82);
      t.offset.set(0, 0.09);
      t.anisotropy = maxAniso;
      t.needsUpdate = true;
    };

    prepFace(frontTexture);
    prepFace(backTexture);
    prepEdge(edgeTexture);
  }, [backTexture, edgeTexture, frontTexture, gl]);

  useFrame((state) => {
    if (groupRef.current) {
      if (flatView) {
        // Navbar: face the camera and slowly flip horizontally (X axis)
        groupRef.current.rotation.x = Math.PI / 2 + state.clock.elapsedTime * 0.22;
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.z = 0;
      } else {
        // Hero: rotate around X-axis (horizontal flip) to show both faces
        // Start with lion facing viewer, then slowly tumble to show both sides
        groupRef.current.rotation.x = rotation[0] + state.clock.elapsedTime * 0.15;
        groupRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.1; // subtle wobble
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05; // very subtle tilt
      }
    }
  });

  const coinRadius = 1.92;
  const coinThickness = 0.25;

  return (
    <>
      <Float speed={flatView ? 0.8 : 1.5} rotationIntensity={flatView ? 0 : 0.1} floatIntensity={flatView ? 0.1 : 0.3}>
        <group ref={groupRef}>
          {/* Main coin body (side only) with repeating milled edge texture */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[coinRadius, coinRadius, coinThickness, 180, 1, true]} />
            <meshStandardMaterial
              map={edgeTexture}
              bumpMap={edgeTexture}
              bumpScale={0.25}
              metalness={0.95}
              roughness={0.18}
            />
          </mesh>


          {/* Front face - Cyrus portrait - flush to edge */}
          <mesh position={[0, coinThickness / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[coinRadius, 64]} />
            <meshStandardMaterial
              map={frontTexture}
              metalness={0.7}
              roughness={0.25}
              color="#E8C547"
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Back face - Lion - flush to edge */}
          <mesh position={[0, -coinThickness / 2 - 0.001, 0]} rotation={[Math.PI / 2, 0, Math.PI]}>
            <circleGeometry args={[coinRadius, 64]} />
            <meshStandardMaterial
              map={backTexture}
              metalness={0.7}
              roughness={0.25}
              color="#E8C547"
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </Float>

      {/* Parallax rings - only for hero */}
      {showRings && !flatView && <ParallaxRings rotation={rotation} />}
    </>
  );
};

// Interactive controls
const DragControls = ({ onRotate, flatView = false }: { onRotate: (x: number, y: number) => void; flatView?: boolean }) => {
  const { gl } = useThree();
  const isDragging = useRef(false);
  const previousPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.cursor = 'grab';
    
    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      previousPosition.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousPosition.current.x;
      const deltaY = e.clientY - previousPosition.current.y;
      // For flat view, only allow Y rotation (horizontal drag flips coin)
      if (flatView) {
        onRotate(0, deltaX * 0.02);
      } else {
        onRotate(deltaY * 0.01, deltaX * 0.01);
      }
      previousPosition.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging.current = false;
      canvas.style.cursor = 'grab';
    };
    
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [gl, onRotate, flatView]);

  return null;
};

interface CyrusCoin3DProps {
  showRings?: boolean;
  size?: "sm" | "md" | "lg";
}

const CyrusCoin3D = ({ showRings = true, size = "lg" }: CyrusCoin3DProps) => {
  // Start with lion face showing perfectly oriented facing the viewer
  // The coin cylinder has lion on -Y side, so we need rotation.x = -Math.PI/2 to face camera
  // Adding Math.PI flips to show lion instead of Cyrus portrait
  const [rotation, setRotation] = useState<[number, number, number]>([-Math.PI / 2 + Math.PI, 0, 0]);
  const isSmall = size === "sm" || size === "md";

  const handleRotate = (deltaX: number, deltaY: number) => {
    setRotation(prev => [prev[0] + deltaX, prev[1] + deltaY, prev[2]]);
  };

  const sizeConfig = {
    sm: { classes: "w-10 h-10 rounded-full overflow-hidden", camera: 7.2, fov: 32 },
    md: { classes: "w-24 h-24 rounded-full overflow-hidden", camera: 6, fov: 34 },
    lg: { classes: "w-full h-full min-h-[600px]", camera: 9.5, fov: 48 }
  };

  const config = sizeConfig[size];

  return (
    <div className={`${config.classes} select-none relative`}>
      {/* Golden glow behind the coin - hero only */}
      {size === "lg" && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212, 175, 55, 0.3) 0%, rgba(201, 162, 39, 0.15) 30%, rgba(184, 134, 11, 0.05) 55%, transparent 75%)',
            filter: 'blur(30px)',
          }}
        />
      )}
      <Canvas
        camera={{ position: [0, 0, config.camera], fov: config.fov }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ overflow: 'visible' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1.8}
            castShadow
            color="#FFF8DC"
          />
          <spotLight
            position={[-10, 5, -10]}
            angle={0.2}
            penumbra={1}
            intensity={0.9}
            color="#FFD700"
          />
          <pointLight position={[0, 5, 0]} intensity={0.7} color="#FFD700" />
          <pointLight position={[0, -5, 0]} intensity={0.4} color="#D4AF37" />
          {size === "lg" && <pointLight position={[0, 0, 5]} intensity={0.5} color="#FFF8DC" />}
          
          <Coin 
            rotation={rotation} 
            showRings={showRings && size === "lg"} 
            flatView={isSmall}
          />
          <DragControls onRotate={handleRotate} flatView={isSmall} />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      {size === "lg" && (
        <p className="text-center text-muted-foreground/50 text-xs mt-1 font-sans">
          Drag to rotate
        </p>
      )}
    </div>
  );
};

export default CyrusCoin3D;
