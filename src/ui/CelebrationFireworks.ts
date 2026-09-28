type TrailPoint = { x: number; y: number; z: number };
type Spark = { x:number; y:number; z:number; vx:number; vy:number; vz:number; gravity:number; drag:number; life:number; decay:number; size:number; color:string; side:-1|1; trail:TrailPoint[] };
type Rocket = { x:number; y:number; targetY:number; speed:number; color:string; side:-1|1; trail:Array<{x:number;y:number}> };

const PALETTE = [
  { core:"#fff4bd", glow:"#ffd166" },
  { core:"#e8deff", glow:"#a98cff" },
  { core:"#d9fff0", glow:"#58e6a8" },
  { core:"#dff4ff", glow:"#70c9ff" },
];

export class CelebrationFireworks {
  private readonly canvas = document.createElement("canvas");
  private readonly ctx: CanvasRenderingContext2D;
  private sparks: Spark[] = [];
  private rockets: Rocket[] = [];
  private frameId = 0;
  private lastFrame = 0;
  private nextLaunch = 0;
  private launchCount = 0;
  private width = 0;
  private height = 0;
  private mobile = false;

  constructor(private readonly root: HTMLElement) {
    this.canvas.className = "celebration-canvas";
    this.canvas.setAttribute("aria-hidden", "true");
    const context = this.canvas.getContext("2d");
    if (!context) throw new Error("Celebration canvas unavailable");
    this.ctx = context;
    this.root.append(this.canvas);
    new MutationObserver(() => this.root.hidden ? this.stop() : this.start()).observe(this.root, { attributes:true, attributeFilter:["hidden"] });
    window.addEventListener("resize", () => this.resize());
  }

  private resize() {
    const bounds = this.root.getBoundingClientRect();
    this.mobile = matchMedia("(max-width: 760px), (pointer: coarse)").matches;
    this.width = Math.max(1, Math.round(bounds.width || innerWidth));
    this.height = Math.max(1, Math.round(bounds.height || innerHeight));
    const density = Math.min(devicePixelRatio || 1, this.mobile ? 1.25 : 2);
    this.canvas.width = Math.round(this.width * density);
    this.canvas.height = Math.round(this.height * density);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(density, 0, 0, density, 0, 0);
  }

  private start() {
    this.stop();
    this.resize();
    this.lastFrame = performance.now();
    this.nextLaunch = this.lastFrame + 180;
    this.launchCount = 0;
    this.frameId = requestAnimationFrame(time => this.animate(time));
  }

  private stop() {
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = 0;
    this.sparks = [];
    this.rockets = [];
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  private launchPair(now: number) {
    const targetY = this.mobile ? this.height * .13 : this.height * (.18 + Math.random() * .52);
    const lane = this.mobile ? .15 : .16 + Math.random() * .07;
    const color = PALETTE[this.launchCount % PALETTE.length];
    for (const side of [-1, 1] as const) {
      this.rockets.push({ x:this.width * (side < 0 ? lane : 1 - lane), y:this.height + 30, targetY, speed:this.mobile ? 9.2 : 11 + Math.random() * 2, color:color.glow, side, trail:[] });
    }
    this.launchCount++;
    this.nextLaunch = now + (this.mobile ? 2100 : 1650 + Math.random() * 700);
  }

  private explode(rocket: Rocket) {
    const color = PALETTE[(this.launchCount - 1) % PALETTE.length];
    const count = this.mobile ? 18 : 48;
    const ring = this.launchCount % 3 === 0;
    for (let index = 0; index < count; index++) {
      const angle = Math.PI * 2 * index / count + (Math.random() - .5) * .08;
      const elevation = ring ? (Math.random() - .5) * .24 : Math.acos(2 * Math.random() - 1) - Math.PI / 2;
      const speed = (this.mobile ? 2.2 : 3.2) + Math.random() * (this.mobile ? 1.5 : 2.7);
      const planar = Math.cos(elevation) * speed;
      this.sparks.push({ x:rocket.x, y:rocket.y, z:0, vx:Math.cos(angle)*planar, vy:Math.sin(angle)*planar, vz:Math.sin(elevation)*speed*1.8, gravity:.027+Math.random()*.014, drag:.982, life:1, decay:.008+Math.random()*.006, size:this.mobile?1.25:1.45+Math.random()*1.15, color:index%5===0?color.core:color.glow, side:rocket.side, trail:[] });
    }
  }

  private project(point: TrailPoint) {
    const perspective = 520 / Math.max(260, 520 + point.z);
    const anchor = this.width * (point.x < this.width / 2 ? .18 : .82);
    return { x:anchor+(point.x-anchor)*perspective, y:this.height*.5+(point.y-this.height*.5)*perspective, scale:perspective };
  }

  private clipLane(side: -1|1) {
    this.ctx.beginPath();
    if (this.mobile) this.ctx.rect(side < 0 ? 0 : this.width*.76, 0, this.width*.24, this.height*.42);
    else this.ctx.rect(side < 0 ? 0 : this.width*.7, 0, this.width*.3, this.height);
    this.ctx.clip();
  }

  private drawRocket(rocket: Rocket) {
    this.ctx.save();
    this.clipLane(rocket.side);
    this.ctx.globalCompositeOperation = "lighter";
    if (rocket.trail.length > 1) {
      const gradient = this.ctx.createLinearGradient(rocket.x,rocket.y+65,rocket.x,rocket.y);
      gradient.addColorStop(0,"rgba(255,255,255,0)"); gradient.addColorStop(.72,rocket.color); gradient.addColorStop(1,"#fff");
      this.ctx.strokeStyle=gradient; this.ctx.lineWidth=this.mobile?1.3:2; this.ctx.beginPath();
      rocket.trail.forEach((point,index)=>index?this.ctx.lineTo(point.x,point.y):this.ctx.moveTo(point.x,point.y)); this.ctx.stroke();
    }
    this.ctx.fillStyle="#fff"; this.ctx.shadowColor=rocket.color; this.ctx.shadowBlur=13; this.ctx.beginPath(); this.ctx.arc(rocket.x,rocket.y,this.mobile?1.6:2.2,0,Math.PI*2); this.ctx.fill(); this.ctx.restore();
  }

  private drawSpark(spark: Spark) {
    const point = this.project(spark);
    this.ctx.save(); this.clipLane(spark.side); this.ctx.globalCompositeOperation="lighter"; this.ctx.lineCap="round";
    if (spark.trail.length > 1) {
      this.ctx.strokeStyle=spark.color; this.ctx.globalAlpha=Math.max(0,spark.life*.42); this.ctx.lineWidth=Math.max(.45,spark.size*point.scale*.65); this.ctx.beginPath();
      spark.trail.forEach((trailPoint,index)=>{ const projected=this.project(trailPoint); index?this.ctx.lineTo(projected.x,projected.y):this.ctx.moveTo(projected.x,projected.y); }); this.ctx.stroke();
    }
    this.ctx.globalAlpha=Math.max(0,spark.life*Math.min(1.15,point.scale)); this.ctx.fillStyle=spark.color; this.ctx.shadowColor=spark.color; this.ctx.shadowBlur=this.mobile?5:9*point.scale; this.ctx.beginPath(); this.ctx.arc(point.x,point.y,Math.max(.55,spark.size*point.scale),0,Math.PI*2); this.ctx.fill(); this.ctx.restore();
  }

  private animate(now: number) {
    const delta=Math.min(2.2,Math.max(.35,(now-this.lastFrame)/16.67)); this.lastFrame=now; this.ctx.clearRect(0,0,this.width,this.height);
    const sequenceLength=this.mobile?2:5;
    if (this.launchCount<sequenceLength&&now>=this.nextLaunch) this.launchPair(now);
    for (let index=this.rockets.length-1;index>=0;index--) {
      const rocket=this.rockets[index]; rocket.trail.unshift({x:rocket.x,y:rocket.y}); rocket.trail.length=Math.min(rocket.trail.length,12); rocket.y-=rocket.speed*delta; this.drawRocket(rocket);
      if (rocket.y<=rocket.targetY) { this.explode(rocket); this.rockets.splice(index,1); }
    }
    for (let index=this.sparks.length-1;index>=0;index--) {
      const spark=this.sparks[index]; spark.trail.unshift({x:spark.x,y:spark.y,z:spark.z}); spark.trail.length=Math.min(spark.trail.length,this.mobile?3:6);
      spark.x+=spark.vx*delta; spark.y+=spark.vy*delta; spark.z+=spark.vz*delta; spark.vx*=Math.pow(spark.drag,delta); spark.vy=spark.vy*Math.pow(spark.drag,delta)+spark.gravity*delta; spark.vz*=Math.pow(spark.drag,delta); spark.life-=spark.decay*delta; this.drawSpark(spark);
      if (spark.life<=0) this.sparks.splice(index,1);
    }
    const finished=this.launchCount>=sequenceLength&&!this.rockets.length&&!this.sparks.length;
    if (!finished&&!this.root.hidden) this.frameId=requestAnimationFrame(time=>this.animate(time)); else this.frameId=0;
  }
}
