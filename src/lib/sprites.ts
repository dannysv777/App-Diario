import { Assets, Texture } from "pixi.js";

export interface SpriteManifest {
  key: string;
  path: string;
  optional?: boolean;
}

const SPRITE_LIST: SpriteManifest[] = [
  // Background
  { key: "sky", path: "/sprites/sky.png" },
  { key: "ground", path: "/sprites/ground.png" },
  // Seed sequence (3 states)
  { key: "seed-1", path: "/sprites/seed-1.png" },
  { key: "seed-2", path: "/sprites/seed-2.png" },
  { key: "seed-3", path: "/sprites/seed-3.png" },
  // Flower parts
  { key: "flower-stem", path: "/sprites/flower-stem.png" },
  { key: "flower-leaves", path: "/sprites/flower-leaves.png" },
  { key: "flower-head", path: "/sprites/flower-head.png" },
  // Scenery
  { key: "house", path: "/sprites/house.png", optional: true },
  { key: "tree", path: "/sprites/tree.png", optional: true },
  { key: "bush-1", path: "/sprites/bush-1.png", optional: true },
  { key: "bush-2", path: "/sprites/bush-2.png", optional: true },
  { key: "bush-3", path: "/sprites/bush-3.png", optional: true },
  // Small flowers
  { key: "flower-small-1", path: "/sprites/flower-small-1.png", optional: true },
  { key: "flower-small-2", path: "/sprites/flower-small-2.png", optional: true },
  { key: "flower-small-3", path: "/sprites/flower-small-3.png", optional: true },
  { key: "flower-small-4", path: "/sprites/flower-small-4.png", optional: true },
];

const loadedTextures = new Map<string, Texture>();
const LOAD_TIMEOUT_MS = 2500;

function preloadImage(path: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image();
    const timeout = window.setTimeout(() => {
      image.onload = null;
      image.onerror = null;
      reject(new Error("timeout"));
    }, LOAD_TIMEOUT_MS);

    image.onload = () => {
      window.clearTimeout(timeout);
      resolve();
    };

    image.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error("not found"));
    };

    image.src = path;
  });
}

export async function loadSprites(
  onProgress?: (loaded: number, total: number) => void
): Promise<Map<string, Texture>> {
  const total = SPRITE_LIST.length;
  let loaded = 0;

  const loadOne = async (sprite: SpriteManifest) => {
    try {
      await preloadImage(sprite.path);
      Assets.backgroundLoad(sprite.path);
    } catch {
      if (!sprite.optional) {
        console.warn(`Required sprite missing: ${sprite.path}`);
      }
    }
    loaded++;
    onProgress?.(loaded, total);
  };

  await Promise.all(SPRITE_LIST.map(loadOne));
  return loadedTextures;
}

export function getTexture(key: string): Texture | null {
  return loadedTextures.get(key) ?? null;
}

export function hasTexture(key: string): boolean {
  return loadedTextures.has(key);
}
