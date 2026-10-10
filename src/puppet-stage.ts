import * as THREE from "three";
import type { Emotion, Gesture } from "../server/protocol.ts";
import { Puppet, PUPPET_THEMES } from "./puppet";

// Delulu: an AI-driven ghost-girl on the same expressive rig as the
// user's hand puppet. The inherited face/jaw and arm hierarchy keep all
// speech, emotion, gaze, and gesture behavior intact.

type EmotionParams = {
  eyeScaleY: number;
  rockSpeed: number;
  rockAmp: number;
  bodyTiltZ: number;
  bodyOffsetZ: number;
  armAmp: number;
  blinkRate: number;
  blinkSuppress: number;
  browInner: number;
  browOuter: number;
  browAngle: number;
  headTiltZ: number;
};

const EMOTIONS: Record<Emotion, EmotionParams> = {
  neutral: {
    eyeScaleY: 1.0,
    rockSpeed: 1.0,
    rockAmp: 1.0,
    bodyTiltZ: 0.0,
    bodyOffsetZ: 0.0,
    armAmp: 1.0,
    blinkRate: 1.0,
    blinkSuppress: 0,
    browInner: 0,
    browOuter: 0,
    browAngle: 0,
    headTiltZ: 0,
  },
  smug: {
    eyeScaleY: 0.75,
    rockSpeed: 0.7,
    rockAmp: 0.9,
    bodyTiltZ: 0.06,
    bodyOffsetZ: 0.0,
    armAmp: 0.8,
    blinkRate: 0.6,
    blinkSuppress: 0,
    browInner: -0.04,
    browOuter: 0.04,
    browAngle: 0.25,
    headTiltZ: 0.08,
  },
  curious: {
    eyeScaleY: 1.1,
    rockSpeed: 0.9,
    rockAmp: 0.6,
    bodyTiltZ: 0.0,
    bodyOffsetZ: 0.0,
    armAmp: 0.7,
    blinkRate: 1.4,
    blinkSuppress: 0,
    browInner: 0.05,
    browOuter: 0.08,
    browAngle: 0.1,
    headTiltZ: 0.14,
  },
  excited: {
    eyeScaleY: 1.15,
    rockSpeed: 1.8,
    rockAmp: 1.4,
    bodyTiltZ: 0.0,
    bodyOffsetZ: 0.0,
    armAmp: 1.6,
    blinkRate: 0.3,
    blinkSuppress: 0,
    browInner: 0.08,
    browOuter: 0.08,
    browAngle: 0,
    headTiltZ: 0,
  },
  bored: {
    eyeScaleY: 0.55,
    rockSpeed: 0.4,
    rockAmp: 0.5,
    bodyTiltZ: -0.04,
    bodyOffsetZ: 0.0,
    armAmp: 0.4,
    blinkRate: 0.3,
    blinkSuppress: 0,
    browInner: -0.05,
    browOuter: -0.05,
    browAngle: -0.1,
    headTiltZ: -0.05,
  },
  surprised: {
    eyeScaleY: 1.5,
    rockSpeed: 1.0,
    rockAmp: 0.2,
    bodyTiltZ: 0.0,
    bodyOffsetZ: -0.1,
    armAmp: 0.2,
    blinkRate: 1.0,
    blinkSuppress: 1.0,
    browInner: 0.14,
    browOuter: 0.14,
    browAngle: 0,
    headTiltZ: 0,
  },
};

type GestureSpec = {
  duration: number;
  apply: (t: number, rig: GestureRig) => void;
};

type GestureRig = {
  leftShoulder: THREE.Group;
  rightShoulder: THREE.Group;
  root: THREE.Group;
  headGroup: THREE.Group;
};

function envelope(t: number, dur: number): number {
  const p = t / dur;
  const e = 0.2;
  if (p < e) return p / e;
  if (p > 1 - e) return (1 - p) / e;
  return 1;
}

const GESTURES: Record<Gesture, GestureSpec | null> = {
  none: null,
  wave: {
    duration: 1.2,
    apply(t, { rightShoulder }) {
      const env = envelope(t, 1.2);
      rightShoulder.rotation.z += -1.8 * env;
      rightShoulder.rotation.x += Math.sin(t * Math.PI * 2 * 2.5) * 0.6 * env;
    },
  },
  shrug: {
    duration: 0.8,
    apply(t, { leftShoulder, rightShoulder, root }) {
      const env = envelope(t, 0.8);
      leftShoulder.rotation.z += -0.5 * env;
      rightShoulder.rotation.z += 0.5 * env;
      root.position.y -= 0.05 * env;
    },
  },
  lean_in: {
    duration: 1.0,
    apply(t, { root }) {
      const env = envelope(t, 1.0);
      root.position.z += 0.35 * env;
    },
  },
  nod: {
    duration: 0.8,
    apply(t, { headGroup }) {
      const env = envelope(t, 0.8);
      headGroup.rotation.x += Math.sin(t * Math.PI * 2 * 2.5) * 0.25 * env;
    },
  },
  shake: {
    duration: 0.7,
    apply(t, { headGroup }) {
      const env = envelope(t, 0.7);
      headGroup.rotation.y += Math.sin(t * Math.PI * 2 * 4.3) * 0.3 * env;
    },
  },
  jump: {
    duration: 0.6,
    apply(t, { root }) {
      const p = t / 0.6;
      root.position.y += Math.sin(p * Math.PI) * 0.6;
    },
  },
  spin: {
    duration: 0.9,
    apply(t, { root }) {
      const p = Math.min(1, t / 0.9);
      const eased = 0.5 - 0.5 * Math.cos(p * Math.PI);
      root.rotation.y += eased * Math.PI * 2;
    },
  },
  wiggle: {
    duration: 1.0,
    apply(t, { root }) {
      const env = envelope(t, 1.0);
      root.rotation.z += Math.sin(t * Math.PI * 2 * 3.0) * 0.2 * env;
    },
  },
  // Both arms rise into a "ta-da!" pose. Mirror of `wave` applied to both
  // shoulders. Useful for celebratory beats and for presenting items
  // attached to hand_left / hand_right slots — held props lift above
  // the head, drawing the eye.
  raise_hands: {
    duration: 1.4,
    apply(t, { leftShoulder, rightShoulder }) {
      const env = envelope(t, 1.4);
      leftShoulder.rotation.z += 1.8 * env;
      rightShoulder.rotation.z += -1.8 * env;
    },
  },
  // Both arms swing forward and back in unison. Useful for showing off
  // hand-held props with motion ("look what I've got!") — the cosmetic
  // attached to hand_left / hand_right ragdolls along with the swing,
  // so a flag or wand reads as actively waved.
  swing_hands: {
    duration: 1.4,
    apply(t, { leftShoulder, rightShoulder }) {
      const env = envelope(t, 1.4);
      const swing = Math.sin(t * Math.PI * 2 * 1.8) * 0.7 * env;
      leftShoulder.rotation.x += swing;
      rightShoulder.rotation.x += swing;
      // Light outward lift so hands clear the torso during the swing.
      leftShoulder.rotation.z += -0.35 * env;
      rightShoulder.rotation.z += 0.35 * env;
    },
  },
};

// Base rest rotation of the shoulder groups, set in Puppet's constructor:
// shoulder.rotation.z = sx * 0.15. Resetting to these each frame keeps
// idle-arm-wiggle and gesture deltas additive without accumulating.
const SHOULDER_REST_LZ = -0.15;
const SHOULDER_REST_RZ = 0.15;

/**
 * AI-driven Delulu rig. Subclasses Puppet to retain its expressive
 * face, speech jaw, and gesture anchors, then layers the ghostly sari,
 * jasmine flowers, bindi, and braid over the inherited model.
 */
export class StagePuppet extends Puppet {
  private params: EmotionParams = { ...EMOTIONS.neutral };
  private targetParams: EmotionParams = { ...EMOTIONS.neutral };
  private blinkSuppress = 0;

  private gesture: Gesture = "none";
  private gestureT = 0;

  private speaking = false;
  private speakingEnv = 0;
  private speakingT = 0;

  private t = Math.random() * 10;
  private glanceX = 0;
  private glanceY = 0;

  // Inner-end y offset of brows. Brow base position is inherited from
  // Puppet (y=0.74); we layer emotion offsets on top.
  private static BROW_BASE_Y = 0.74;

  constructor() {
    super(PUPPET_THEMES.stage);

    // Delulu is a moonlit ghost in Kerala kasavu rather than a second
    // ordinary hand-puppet. Keep the inherited face, jaw, and arm rig so
    // speech, expressions, cosmetics, and gestures continue to work.
    this.torso.visible = false;
    this.leftShoulder.position.y = -0.88;
    this.rightShoulder.position.y = -0.88;
    this.leftShoulder.scale.y = 0.52;
    this.rightShoulder.scale.y = 0.52;
    for (const cuff of this.hairMats.slice(1)) cuff.color.set(0xc3a15d);
    const fringe = this.upperJaw.children[2];
    if (fringe instanceof THREE.Mesh) {
      fringe.scale.set(0.78, 0.14, 0.24);
      fringe.position.set(0, 0.72, 0.67);
    }
    this.addGhostSaree();
    this.addJasmineAndBraid();

    // Small visible ears leave the head cosmetic slot free for flowers,
    // glasses, and other AI-directed accessories.
    const skinMat = new THREE.MeshStandardMaterial({
      color: PUPPET_THEMES.stage.skin,
      roughness: 0.85,
    });
    // Register the ear material under the skin channel so recolor() keeps
    // the ears in sync with the rest of the face.
    this.skinMats.push(skinMat);
    const earGeom = new THREE.SphereGeometry(0.18, 14, 12);
    const leftEar = new THREE.Mesh(earGeom, skinMat);
    leftEar.position.set(-1.0, 0.1, 0);
    leftEar.scale.set(0.5, 1.1, 0.85);
    this.upperJaw.add(leftEar);
    const rightEar = new THREE.Mesh(earGeom, skinMat);
    rightEar.position.set(1.0, 0.1, 0);
    rightEar.scale.set(0.5, 1.1, 0.85);
    this.upperJaw.add(rightEar);
  }

  private addGhostSaree() {
    const gown = new THREE.Group();
    // Keep Delulu's flowing hem above the proscenium apron so the ghost
    // silhouette stays visible at the stage's resting position.
    gown.scale.y = 0.6;
    gown.position.y = -0.66 * (1 - gown.scale.y) + 0.28;
    this.root.add(gown);

    const ghost = new THREE.Shape();
    ghost.moveTo(-0.42, -0.66);
    ghost.bezierCurveTo(-0.62, -1.05, -0.76, -1.28, -0.74, -1.8);
    ghost.bezierCurveTo(-0.74, -2.3, -0.98, -2.72, -0.9, -3.06);
    ghost.quadraticCurveTo(-0.48, -2.88, -0.16, -3.08);
    ghost.quadraticCurveTo(0.15, -3.29, 0.48, -3.04);
    ghost.quadraticCurveTo(0.76, -2.84, 1.0, -3.04);
    ghost.bezierCurveTo(1.08, -2.68, 0.82, -2.35, 0.82, -1.8);
    ghost.bezierCurveTo(0.82, -1.28, 0.62, -1.02, 0.42, -0.66);
    ghost.quadraticCurveTo(0, -0.48, -0.42, -0.66);

    const ghostMat = new THREE.MeshStandardMaterial({
      color: 0xf7f1ff,
      roughness: 0.65,
      metalness: 0.04,
      emissive: 0x8c69ad,
      emissiveIntensity: 0.12,
      transparent: true,
      opacity: 0.93,
      side: THREE.DoubleSide,
    });
    const body = new THREE.Mesh(
      new THREE.ExtrudeGeometry(ghost, {
        depth: 0.12,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.035,
        bevelThickness: 0.035,
      }),
      ghostMat,
    );
    body.position.z = -0.18;
    body.castShadow = true;
    gown.add(body);

    // A kasavu pallu drapes diagonally across the luminous white sari.
    const pallu = new THREE.Shape();
    pallu.moveTo(-0.28, -0.74);
    pallu.quadraticCurveTo(0.04, -0.95, 0.46, -1.05);
    pallu.bezierCurveTo(0.54, -1.58, 0.7, -2.03, 0.81, -2.44);
    pallu.lineTo(0.61, -2.56);
    pallu.bezierCurveTo(0.43, -2.08, 0.29, -1.59, 0.2, -1.18);
    pallu.quadraticCurveTo(-0.12, -1.1, -0.37, -0.91);
    pallu.closePath();
    const gold = new THREE.MeshStandardMaterial({
      color: 0xc8a15a,
      roughness: 0.42,
      metalness: 0.48,
      side: THREE.DoubleSide,
    });
    const drape = new THREE.Mesh(new THREE.ShapeGeometry(pallu), gold);
    drape.position.z = -0.035;
    gown.add(drape);

    // Tiny gold border on the flowing ghost hem.
    const hemPoints = [
      new THREE.Vector3(-0.87, -2.96, -0.035),
      new THREE.Vector3(-0.55, -2.91, -0.035),
      new THREE.Vector3(-0.18, -3.0, -0.035),
      new THREE.Vector3(0.16, -3.15, -0.035),
      new THREE.Vector3(0.5, -2.98, -0.035),
      new THREE.Vector3(0.77, -2.91, -0.035),
      new THREE.Vector3(0.97, -2.96, -0.035),
    ];
    const hem = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hemPoints), 28, 0.025, 6, false),
      gold,
    );
    gown.add(hem);
  }

  private addJasmineAndBraid() {
    const jasmine = new THREE.MeshStandardMaterial({ color: 0xfff8ea, roughness: 0.75 });
    const center = new THREE.MeshStandardMaterial({ color: 0xd5aa61, roughness: 0.55, metalness: 0.25 });
    const flower = new THREE.SphereGeometry(0.08, 12, 10);
    for (let i = 0; i < 9; i++) {
      const x = -0.66 + (i / 8) * 1.32;
      const y = 0.94 - Math.abs(x) * 0.12;
      const z = 0.38 + (1 - Math.abs(x)) * 0.1;
      const blossom = new THREE.Mesh(flower, jasmine);
      blossom.position.set(x, y, z);
      blossom.scale.set(1, 0.85, 0.75);
      this.upperJaw.add(blossom);
      // Golden center for each jasmine bud
      const budCore = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), center);
      budCore.position.set(x, y + 0.01, z + 0.05);
      this.upperJaw.add(budCore);
    }

    // Soft glowing rosy-peach cheeks, cute cheek highlights, big sparkling
    // anime eyes with double glints, and a sweet kitten smile make Delulu
    // charming, vibrant, and lovable.
    const blush = new THREE.MeshStandardMaterial({
      color: 0xff7b95,
      roughness: 0.7,
      transparent: true,
      opacity: 0.65,
      emissive: 0xff8ca3,
      emissiveIntensity: 0.15,
    });
    const cheekGlintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (const side of [-1, 1]) {
      // Rosy cheek
      const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), blush);
      cheek.position.set(side * 0.55, 0.18, 0.79);
      cheek.scale.set(1.4, 0.8, 0.3);
      this.upperJaw.add(cheek);

      // Cute cheek highlight sparkle
      const cheekSparkle = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), cheekGlintMat);
      cheekSparkle.position.set(side * 0.57, 0.21, 0.83);
      this.upperJaw.add(cheekSparkle);

      // Eye white: slightly larger and rounder
      const eye = side < 0 ? this.leftEye : this.rightEye;
      eye.children[0]!.scale.set(1.22, 1.25, 1.05);

      // Pupil: tint to deep glistening midnight violet
      const pupilMesh = eye.children[1];
      if (pupilMesh instanceof THREE.Mesh) {
        pupilMesh.scale.set(1.2, 1.2, 1.0);
        if (pupilMesh.material instanceof THREE.MeshStandardMaterial) {
          pupilMesh.material.color.set(0x22132a);
          pupilMesh.material.roughness = 0.25;
        }
      }

      // Main big bright sparkle glint (top-left)
      const glint1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.048, 12, 10),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
      );
      glint1.position.set(-0.065, 0.08, 0.24);
      eye.add(glint1);

      // Secondary cute little bounce twinkle glint (bottom-right)
      const glint2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.025, 10, 8),
        new THREE.MeshBasicMaterial({ color: 0xf5eeff }),
      );
      glint2.position.set(0.045, -0.05, 0.242);
      eye.add(glint2);

      // Cute anime curved upper lash
      const lashCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-side * 0.14, 0.2, 0.19),
        new THREE.Vector3(0, 0.26, 0.22),
        new THREE.Vector3(side * 0.16, 0.22, 0.2),
        new THREE.Vector3(side * 0.24, 0.25, 0.16),
      ]);
      const lash = new THREE.Mesh(
        new THREE.TubeGeometry(lashCurve, 14, 0.016, 6, false),
        new THREE.MeshStandardMaterial({ color: 0x22132a, roughness: 0.5 }),
      );
      eye.add(lash);
    }

    // Sweet kitten / chibi smile with slight center cupid's bow and upturned corners
    const smileCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.17, 0.13, 0.975),
      new THREE.Vector3(-0.08, 0.055, 0.993),
      new THREE.Vector3(0, 0.08, 0.996),
      new THREE.Vector3(0.08, 0.055, 0.993),
      new THREE.Vector3(0.17, 0.13, 0.975),
    ]);
    const smile = new THREE.Mesh(
      new THREE.TubeGeometry(smileCurve, 18, 0.02, 8, false),
      new THREE.MeshStandardMaterial({ color: 0x9e3f56, roughness: 0.55 }),
    );
    this.upperJaw.add(smile);

    // The tiny red bindi and warm gold earrings
    const bindi = new THREE.Mesh(
      new THREE.SphereGeometry(0.058, 12, 10),
      new THREE.MeshStandardMaterial({
        color: 0xc23447,
        roughness: 0.4,
        emissive: 0x992233,
        emissiveIntensity: 0.2,
      }),
    );
    bindi.position.set(0, 0.78, 0.84);
    this.upperJaw.add(bindi);

    // Tiny gold maang tikka droplet above the bindi
    const tikkaDrop = new THREE.Mesh(
      new THREE.ConeGeometry(0.035, 0.08, 8),
      center,
    );
    tikkaDrop.position.set(0, 0.88, 0.8);
    tikkaDrop.rotation.z = Math.PI;
    this.upperJaw.add(tikkaDrop);

    const earring = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.028, 8, 16), center);
    for (const side of [-1, 1]) {
      const ring = earring.clone();
      ring.position.set(side * 0.98, -0.04, 0.12);
      this.upperJaw.add(ring);
    }

    const hairMat = new THREE.MeshStandardMaterial({ color: PUPPET_THEMES.stage.hair, roughness: 0.82 });
    this.hairMats.push(hairMat);

    // Cute face-framing curl tendrils
    for (const side of [-1, 1]) {
      const curlCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 0.72, 0.45, 0.55),
        new THREE.Vector3(side * 0.82, 0.15, 0.62),
        new THREE.Vector3(side * 0.78, -0.15, 0.58),
        new THREE.Vector3(side * 0.72, -0.32, 0.5),
      ]);
      const curl = new THREE.Mesh(new THREE.TubeGeometry(curlCurve, 16, 0.045, 8, false), hairMat);
      this.upperJaw.add(curl);
    }

    const braidCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.72, 0.28, -0.05),
      new THREE.Vector3(0.96, -0.08, -0.08),
      new THREE.Vector3(0.88, -0.48, -0.1),
      new THREE.Vector3(1.02, -0.82, -0.08),
    ]);
    const braid = new THREE.Mesh(new THREE.TubeGeometry(braidCurve, 20, 0.12, 10, false), hairMat);
    this.upperJaw.add(braid);

    const braidFlower = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), jasmine);
    braidFlower.position.set(0.91, -0.35, 0.03);
    this.upperJaw.add(braidFlower);
  }

  override setGaze(gx: number, gy: number) {
    // Persist for next update; the actual head/eye rotation is applied
    // in update() so it can layer with emotion-driven head tilt.
    this.glanceX = gx;
    this.glanceY = gy;
  }

  override setEmotion(emotion: Emotion) {
    this.targetParams = EMOTIONS[emotion];
    if (EMOTIONS[emotion].blinkSuppress > 0) {
      this.blinkSuppress = EMOTIONS[emotion].blinkSuppress;
    }
  }

  override playGesture(gesture: Gesture) {
    if (!GESTURES[gesture]) {
      this.gesture = "none";
      return;
    }
    this.gesture = gesture;
    this.gestureT = 0;
  }

  override setSpeaking(on: boolean) {
    this.speaking = on;
  }

  // setOpen is hand-tracking-driven on Puppet; on StagePuppet it's
  // entirely TTS-driven via setSpeaking. We override to no-op so any
  // accidental setOpen call from a controller doesn't fight the speaking
  // envelope.
  override setOpen(_amount: number): void {}

  override update(dt: number) {
    this.t += dt;
    this.blinkSuppress = Math.max(0, this.blinkSuppress - dt);

    // Ease emotion params toward target over ~300ms.
    const k = 1 - Math.exp(-dt / 0.3);
    const p = this.params;
    const tgt = this.targetParams;
    p.eyeScaleY += (tgt.eyeScaleY - p.eyeScaleY) * k;
    p.rockSpeed += (tgt.rockSpeed - p.rockSpeed) * k;
    p.rockAmp += (tgt.rockAmp - p.rockAmp) * k;
    p.bodyTiltZ += (tgt.bodyTiltZ - p.bodyTiltZ) * k;
    p.bodyOffsetZ += (tgt.bodyOffsetZ - p.bodyOffsetZ) * k;
    p.armAmp += (tgt.armAmp - p.armAmp) * k;
    p.blinkRate += (tgt.blinkRate - p.blinkRate) * k;
    p.browInner += (tgt.browInner - p.browInner) * k;
    p.browOuter += (tgt.browOuter - p.browOuter) * k;
    p.browAngle += (tgt.browAngle - p.browAngle) * k;
    p.headTiltZ += (tgt.headTiltZ - p.headTiltZ) * k;

    // Reset rotations that we layer on (position is set absolutely by
    // the AI controller each frame, so position deltas are naturally
    // single-frame; rotation we have to reset).
    this.root.rotation.set(0, 0, 0);
    this.headGroup.rotation.set(0, 0, 0);
    this.leftShoulder.rotation.set(0, 0, SHOULDER_REST_LZ);
    this.rightShoulder.rotation.set(0, 0, SHOULDER_REST_RZ);

    // Idle body sway via root rotation (subtle z-roll). Position bobble
    // already comes from the AI controller's rise animation.
    this.root.rotation.z =
      Math.sin(this.t * 1.1 * p.rockSpeed) * 0.04 * p.rockAmp + p.bodyTiltZ;

    // Gaze: head rotation comes from setGaze + emotion head tilt.
    const gx = Math.max(-1, Math.min(1, this.glanceX));
    const gy = Math.max(-1, Math.min(1, this.glanceY));
    this.headGroup.rotation.y = gx * 0.5;
    this.headGroup.rotation.x = -gy * 0.35;
    this.headGroup.rotation.z = p.headTiltZ;

    // Speaking envelope drives jaw open via the inherited setOpen on
    // upper/lower jaws. Use super to bypass our no-op override.
    this.speakingT += dt;
    this.speakingEnv +=
      ((this.speaking ? 1 : 0) - this.speakingEnv) * (1 - Math.exp(-dt / 0.09));
    const mouthPulse = 0.5 + 0.5 * Math.sin(this.speakingT * Math.PI * 2 * 4.2);
    const mouthOpen = this.speakingEnv * (0.2 + 0.8 * mouthPulse);
    super.setOpen(mouthOpen * 0.6);
    // Subtle head micro-nod on each speaking pulse.
    this.headGroup.rotation.x += mouthOpen * 0.04;

    // Idle arm wiggle + emotion-modulated arm amplitude.
    const armAmp = p.armAmp * (1 + this.speakingEnv * 0.4);
    this.leftShoulder.rotation.z =
      SHOULDER_REST_LZ + (Math.sin(this.t * 1.8) * 0.12 + 0.08) * armAmp;
    this.rightShoulder.rotation.z =
      SHOULDER_REST_RZ + (Math.sin(this.t * 1.8 + Math.PI) * 0.12 - 0.08) * armAmp;

    // Brows: layer emotion offsets on top of the inherited rest position.
    const setBrow = (brow: THREE.Mesh, side: number) => {
      const inner = p.browInner;
      const outer = p.browOuter;
      const yOff = (inner + outer) * 0.5;
      brow.position.y = StagePuppet.BROW_BASE_Y + yOff;
      brow.rotation.z = -side * 0.18 + p.browAngle * side;
    };
    setBrow(this.leftBrow, -1);
    setBrow(this.rightBrow, 1);

    // Layer active gesture on top of everything.
    if (this.gesture !== "none") {
      const spec = GESTURES[this.gesture];
      if (spec) {
        this.gestureT += dt;
        if (this.gestureT >= spec.duration) {
          this.gesture = "none";
        } else {
          spec.apply(this.gestureT, {
            leftShoulder: this.leftShoulder,
            rightShoulder: this.rightShoulder,
            root: this.root,
            headGroup: this.headGroup,
          });
        }
      }
    }

    // Eye glance: shift pupils within each eye toward the gaze direction.
    const pupilShiftX = gx * 0.04;
    const pupilShiftY = gy * 0.04;
    this.leftPupil.position.x = pupilShiftX;
    this.leftPupil.position.y = pupilShiftY;
    this.rightPupil.position.x = pupilShiftX;
    this.rightPupil.position.y = pupilShiftY;

    // Blink + emotion-driven eye scale. We override Puppet's blink loop
    // because we want to factor in blinkRate (emotion-modulated) and the
    // emotion eyeScaleY.
    const blinkRate = Math.max(0.05, p.blinkRate);
    this.nextBlink -= dt * blinkRate;
    let blinkScale = 1;
    if (this.blinkT >= 0) {
      this.blinkT += dt;
      const b = this.blinkT / 0.14;
      const s = b < 0.5 ? 1 - b * 2 : (b - 0.5) * 2;
      blinkScale = Math.max(0.05, s);
      if (b >= 1) {
        this.blinkT = -1;
        blinkScale = 1;
      }
    } else if (this.nextBlink <= 0 && this.blinkSuppress <= 0) {
      this.blinkT = 0;
      this.nextBlink = 2 + Math.random() * 3.5;
    }
    const finalEyeY = p.eyeScaleY * blinkScale;
    this.leftEyeMesh.scale.y = finalEyeY;
    this.rightEyeMesh.scale.y = finalEyeY;
    this.leftPupil.scale.y = finalEyeY;
    this.rightPupil.scale.y = finalEyeY;

    // Skip super.update(dt) — its blink loop would fight ours.
  }
}
