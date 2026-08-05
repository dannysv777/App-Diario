import { Container, Application } from "pixi.js";

interface CameraOptions {
  worldWidth: number;
  screenWidth: number;
  screenHeight: number;
  friction?: number;
  edgePadding?: number;
}

export class Camera {
  private world: Container;
  private app: Application;
  private screenW: number;
  private worldW: number;
  private minX: number;
  private maxX: number;

  private dragging = false;
  private dragStartX = 0;
  private dragStartWorldX = 0;
  private velocity = 0;
  private lastPointerX = 0;
  private lastTime = 0;
  private friction: number;

  constructor(world: Container, app: Application, opts: CameraOptions) {
    this.world = world;
    this.app = app;
    this.screenW = opts.screenWidth;
    this.worldW = opts.worldWidth;
    this.friction = opts.friction ?? 0.92;

    const padding = opts.edgePadding ?? 0;
    this.maxX = padding;
    this.minX = -(opts.worldWidth - opts.screenWidth) - padding;

    this.setupEvents();
    this.setupInertia();
  }

  get x() {
    return this.world.x;
  }

  scrollTo(x: number, animated = true) {
    const target = this.clamp(x);
    if (!animated) {
      this.world.x = target;
      return;
    }
    this.velocity = 0;
    const start = this.world.x;
    const dist = target - start;
    let elapsed = 0;
    const duration = 600;

    const tick = () => {
      elapsed += this.app.ticker.deltaMS;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      this.world.x = start + dist * eased;
      if (t >= 1) {
        this.app.ticker.remove(tick);
      }
    };
    this.app.ticker.add(tick);
  }

  centerOn(worldX: number, animated = true) {
    this.scrollTo(-worldX + this.screenW / 2, animated);
  }

  private clamp(x: number) {
    return Math.max(this.minX, Math.min(this.maxX, x));
  }

  private setupEvents() {
    const canvas = this.app.canvas as HTMLCanvasElement;

    const onDown = (clientX: number) => {
      this.dragging = true;
      this.velocity = 0;
      this.dragStartX = clientX;
      this.dragStartWorldX = this.world.x;
      this.lastPointerX = clientX;
      this.lastTime = performance.now();
    };

    const onMove = (clientX: number) => {
      if (!this.dragging) return;
      const now = performance.now();
      const dt = now - this.lastTime;
      if (dt > 0) {
        this.velocity = (clientX - this.lastPointerX) / dt * 16;
      }
      this.lastPointerX = clientX;
      this.lastTime = now;

      const delta = clientX - this.dragStartX;
      this.world.x = this.clamp(this.dragStartWorldX + delta);
    };

    const onUp = () => {
      this.dragging = false;
    };

    canvas.addEventListener("pointerdown", (e) => onDown(e.clientX));
    canvas.addEventListener("pointermove", (e) => onMove(e.clientX));
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onUp);

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.world.x = this.clamp(this.world.x - e.deltaX - e.deltaY);
    }, { passive: false });
  }

  private setupInertia() {
    this.app.ticker.add(() => {
      if (this.dragging) return;
      if (Math.abs(this.velocity) < 0.1) {
        this.velocity = 0;
        return;
      }
      this.world.x = this.clamp(this.world.x + this.velocity);
      this.velocity *= this.friction;
    });
  }

  destroy() {
    // Events are cleaned up when canvas is removed
  }
}
