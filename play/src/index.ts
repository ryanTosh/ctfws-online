const canvas = document.getElementById("display") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

let pxScale = 1;

function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    pxScale = Math.sqrt((canvas.width / 1920) * (canvas.height / 1080));
}

onResize();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000000";

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

function frame() {
    draw();

    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);