import * as THREE from "three";
import Experience from "../Experience.js";
import noise from "@/Shaders/Particles/noise.glsl";

export default class Particles {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.gu = {
      time: { value: 0 },
    };

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Particles");
    }

    this.createParticles();
  }

  createParticles() {
    let particlePos = []; //vec4 (speed, shift radius, phase, reserved);
    let particleAlpha = []; //vec4 (phase, speed, reserved, reserved);

    let geometry = new THREE.BufferGeometry()
      .setFromPoints(
        new Array(300).fill().map(() => {
          particlePos.push(
            Math.random() * 0.2 + 0.2,
            Math.random() + 1,
            Math.random(),
            0
          );
          particleAlpha.push(Math.random(), Math.random() * 0.4 + 0.1, 0, 0);

          let r = 5;
          return new THREE.Vector3().setFromCylindricalCoords(
            Math.sqrt(r * r * Math.random()),
            Math.random() * Math.PI * 2,
            Math.random() * 10
          );
        })
      )
      .setAttribute(
        "particlePos",
        new THREE.Float32BufferAttribute(particlePos, 4)
      )
      .setAttribute(
        "particleAlpha",
        new THREE.Float32BufferAttribute(particleAlpha, 4)
      );

    let material = new THREE.PointsMaterial({
      size: 0.5,
      color: "white",
      transparent: true,
      onBeforeCompile: (shader) => {
        shader.uniforms.time = this.gu.time;
        shader.uniforms.heightLimMin = { value: 0 };
        shader.uniforms.heightLimMax = { value: 5 };
        shader.vertexShader = `
          uniform float time;
          uniform float heightLimMin;
          uniform float heightLimMax;
          attribute vec4 particlePos;
          attribute vec4 particleAlpha;
          varying float vParticleAlpha;
          mat2 rot(float a){float c = cos(a); float s = sin(a); return mat2(c, s, -s, c);}
          ${noise}
          ${shader.vertexShader}
        `
          .replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
            float t = time;
          
            vParticleAlpha = sin(mod((particleAlpha.x + t * particleAlpha.y) * PI2, PI2)) * 0.5 + 0.5;
                        
            float hGap = heightLimMax - heightLimMin;
            float halfGap = hGap * 0.5;
            
            float verticalSpeed = particlePos.x;
            float verticalShift = mod((position.y - heightLimMin) + verticalSpeed * t, hGap);
            transformed.y = heightLimMin + verticalShift; // make it looped on Y-axis
            float verticalFade = smoothstep(halfGap, halfGap - 1., abs(verticalShift - halfGap)); // for both top and bottom
            vParticleAlpha *= verticalFade;
            
            // particle shift
            float n = snoise(vec4(position, t * 0.05));
            float radius = particlePos.y;
            float phase = particlePos.z;
            
            float angle = (phase + n) * PI ;
            vec2 shiftVec = rot(angle) * vec2(radius, 0.);
            
            transformed.xz += shiftVec; // make it shifting
            
          `
          )
          .replace(
            `gl_PointSize = size;`,
            `gl_PointSize = size * vParticleAlpha;`
          );
        //console.log(shader.vertexShader);
        shader.fragmentShader = `
          varying float vParticleAlpha;
          ${shader.fragmentShader}
        `.replace(
          `#include <color_fragment>`,
          `#include <color_fragment>
          vec2 uv = gl_PointCoord.xy - 0.5;
          float d = sqrt(dot(uv, uv));
          if(d > 0.5) discard;
          float f = smoothstep(0.5, 0., d);
          f *= f * f * f * f;
          f = f * 0.95 + 0.05;
          diffuseColor.a = vParticleAlpha * f;
          `
        );
        //console.log(shader.fragmentShader);
      },
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  update() {
    // Update uniforms, etc.
    if (this.particles)
      // this.particles.material.uniforms.time.value = this.time.elapsed;
      this.gu.time.value = this.time.elapsed * 0.0005;
  }
}
