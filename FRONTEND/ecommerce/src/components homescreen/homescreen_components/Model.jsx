"use client"

import React, { useRef, useState, useEffect, Suspense } from "react"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Html, useGLTF } from "@react-three/drei"
import * as THREE from "three"

const Model = ({ scrollProgress }) => {
  const { scene } = useGLTF(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/base_basic_shaded-ulwOFKrf5PakKmpr6sO58pd9Auwl8e.glb",
  )
  const modelRef = useRef()
  const { camera } = useThree()

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene)
      const center = box.getCenter(new THREE.Vector3())
      scene.position.sub(center)

      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const fov = camera.fov * (Math.PI / 180)
      const cameraZ = Math.abs((maxDim / 2) * Math.tan(fov * 2))
      camera.position.z = cameraZ * 1.5
      camera.updateProjectionMatrix()
    }
  }, [scene, camera])

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = scrollProgress * Math.PI * 2
      const scale = 1 + scrollProgress * 0.5
      modelRef.current.scale.set(scale, scale, scale)
    }
  })

  return <primitive object={scene} ref={modelRef} />
}

const FeatureSection = ({ title, description, isActive }) => (
  <div className={`feature-section ${isActive ? "active" : ""}`}>
    <h2>{title}</h2>
    <p>{description}</p>
    <button className="btn">Learn More</button>
  </div>
)

const LoadingMessage = () => (
  <Html center>
    <div className="loading-message">Loading 3D Model...</div>
  </Html>
)

export default function Component() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)
  const featuresRef = useRef(null)
  const [isResponsive, setIsResponsive] = useState(false)

  const features = [
    { title: "Virtual Try On", description: "Experience clothes virtually before you buy." },
    { title: "Recommendation System", description: "Get personalized style recommendations." },
    { title: "Community", description: "Connect with fashion enthusiasts worldwide." },
    { title: "Cloth Donations", description: "Give your clothes a second life." },
  ]

  useEffect(() => {
    const handleResize = () => {
      setIsResponsive(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (featuresRef.current) {
        const scrollPosition = featuresRef.current.scrollTop
        const totalHeight = featuresRef.current.scrollHeight - featuresRef.current.clientHeight
        const progress = Math.min(scrollPosition / totalHeight, 1)
        setScrollProgress(progress)
        setActiveFeature(Math.floor(progress * features.length))
      }
    }

    const featuresElement = featuresRef.current
    if (featuresElement) {
      featuresElement.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (featuresElement) {
        featuresElement.removeEventListener("scroll", handleScroll)
      }
    }
  }, [features.length])

  return (
    <div className="model-viewer-container">
      <div className="model-viewer-content">
        <div className="features-column" ref={featuresRef}>
          {features.map((feature, index) => (
            <FeatureSection
              key={index}
              title={feature.title}
              description={feature.description}
              isActive={index === activeFeature}
            />
          ))}
        </div>
        <div className="model-column">
          <Canvas className="canvas">
            <Suspense fallback={<LoadingMessage />}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              <Model scrollProgress={scrollProgress} />
              <OrbitControls enableZoom={false} enablePan={false} />
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            </Suspense>
          </Canvas>
        </div>
      </div>
      <style jsx>{`
        .model-viewer-container {
          height: 100vh;
          width: 100%;
          overflow: hidden;
          background: transparent;
          color: white;
        }
        .model-viewer-content {
          display: flex;
          height: 100%;
        }
        .features-column {
          flex: 1;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #34A85A #FFC107;
        }
        .features-column::-webkit-scrollbar {
          width: 12px;
        }
        .features-column::-webkit-scrollbar-track {
          background: #FFC107;
          border-radius: 10px;
        }
        .features-column::-webkit-scrollbar-thumb {
          background-color: #34A85A;
          border-radius: 10px;
          border: 3px solid #FFC107;
        }
        .model-column {
          flex: 1;
          position: relative;
        }
        .canvas {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
        }
        .feature-section {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 2rem;
          opacity: 0.3;
          transition: opacity 0.5s ease;
        }
        .feature-section.active {
          opacity: 1;
        }
        h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #34A85A;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
        }
        .btn {
          align-self: flex-start;
          background-color: #FFC107;
          color: #333;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn:hover {
          background-color: #34A85A;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .loading-message {
          color: #34A85A;
          font-size: 1.5rem;
          background-color: rgba(255, 255, 255, 0.8);
          padding: 1rem;
          border-radius: 0.5rem;
        }
        @media (max-width: 768px) {
          .model-viewer-content {
            flex-direction: column;
          }
          .features-column, .model-column {
            flex: none;
            height: 50vh;
          }
          .feature-section {
            height: auto;
            min-height: 50vh;
          }
          h2 {
            font-size: 2rem;
          }
          p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

