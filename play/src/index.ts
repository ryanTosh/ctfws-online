import { Controls } from "./controls";

const canvas = document.getElementById("display") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const controls = new Controls(canvas);

let pxScale = 1;

function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    pxScale = Math.sqrt((canvas.width / 1920) * (canvas.height / 1080));
}

onResize();

let px = 0;
let py = 0;

const img = new Image();
img.src = "/BP-B-ABUS-Base.png";

function draw() {
    const facingDir = controls.pointingDir() ?? 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "hsl(350, 100%, 40%)";
    ctx.strokeStyle = "hsl(350, 100%, 40%)";
    ctx.lineWidth = 2.25;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(pxScale, pxScale);

    ctx.drawImage(img, -px - 816 * 2, -py - 528 * 2, 1632 * 2, 1056 * 2);

    ctx.beginPath();
    ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 10.875, 0, Math.PI * 2);
    ctx.stroke();

    const visualFov = 75 / 180 * Math.PI;

    const grad = ctx.createRadialGradient(0, 0, 15, 0, 0, 45);
    grad.addColorStop(0, "hsla(350, 100%, 40%, 50%)");
    grad.addColorStop(1, "hsla(350, 100%, 40%, 0%)");
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(Math.cos(facingDir - visualFov / 2) * 15, Math.sin(facingDir - visualFov / 2) * 15);
    ctx.lineTo(Math.cos(facingDir - visualFov / 2) * 45, Math.sin(facingDir - visualFov / 2) * 45);
    ctx.arc(0, 0, 45, facingDir - visualFov / 2, facingDir + visualFov / 2, false);
    ctx.lineTo(Math.cos(facingDir + visualFov / 2) * 15, Math.sin(facingDir + visualFov / 2) * 15);
    ctx.arc(0, 0, 15, facingDir + visualFov / 2, facingDir - visualFov / 2, true);
    ctx.fill();

    ctx.restore();

    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;

    ctx.save();
    ctx.scale(pxScale, pxScale);
    ctx.strokeRect(12, 12, 192, 128);
    ctx.restore();

    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    ctx.font = Math.round(12 * pxScale) + "px 'Poppins'";
    ctx.fillText("You're currently in:", 108 * pxScale, 30 * pxScale);

    ctx.font = "bold " + Math.round(18 * pxScale) + "px 'Poppins'";
    ctx.fillText("Doherty Hall", 108 * pxScale, 54 * pxScale);

    ctx.font = Math.round(15 * pxScale) + "px 'Poppins'";
    ctx.fillText("Floor D - D272", 108 * pxScale, 78 * pxScale);

    ctx.fillStyle = "hsl(350, 100%, 45%)";
    ctx.font = "bold " + Math.round(18 * pxScale) + "px 'Poppins'";
    ctx.fillText("\u25cf Red \u25cf", 108 * pxScale, 102 * pxScale);
}

window.addEventListener("resize", function() {
    onResize();
});

let lastFrameTime: number | undefined = undefined;

const speed = 175;

function frame(frameTime: number | undefined) {
    const frameTimeDiff = lastFrameTime !== undefined && frameTime !== undefined ? frameTime - lastFrameTime : 0;
    lastFrameTime = frameTime;

    const northDown = controls.isBindDown("north");
    const southDown = controls.isBindDown("south");
    const westDown = controls.isBindDown("west");
    const eastDown = controls.isBindDown("east");

    const facingDir = controls.pointingDir() ?? 0;
    const dirDotProd = (Number(southDown) - Number(northDown)) * Math.sin(facingDir) + (Number(eastDown) - Number(westDown)) * Math.cos(facingDir);

    const frameSpeed = speed * (dirDotProd / 2 + 1) * (controls.isBindDown("sprint") ? 1.75 : 1) * ((northDown != southDown) && (westDown != eastDown) ? Math.SQRT1_2 : 1) * frameTimeDiff / 1000;

    if (northDown) py -= frameSpeed;
    if (southDown) py += frameSpeed;
    if (westDown) px -= frameSpeed;
    if (eastDown) px += frameSpeed;

    draw();

    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);