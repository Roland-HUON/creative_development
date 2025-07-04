const canvas3 = document.getElementById('canvas3');
const width3 = canvas3.clientWidth * 2;
const height3 = canvas3.clientHeight * 2;

canvas3.width = width3;
canvas3.height = height3;

const context3 = canvas3.getContext('2d');

const mouseTrail = [];

canvas3.addEventListener('mousemove', (e) => {
    const rect = canvas3.getBoundingClientRect();
    const scaleX = width3 / rect.width;
    const scaleY = height3 / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    mouseTrail.push({ x, y });
    if (mouseTrail.length > 30) mouseTrail.shift();
});

canvas3.addEventListener('mouseleave', () => {
    mouseTrail.length = 0;
});

function drawFlameTrail() {
    context3.clearRect(0, 0, width3, height3);

    for (let i = 0; i < mouseTrail.length; i++) {
        const trail = mouseTrail[i];
        const progress = i / mouseTrail.length;

        const flameSize = 8 + (1 - progress) * 15;
        const alpha = 0.3 + 0.5 * (1 - progress);
        const flicker = Math.sin(performance.now() / 100 + i) * 4;

        const grad = context3.createRadialGradient(
            trail.x + flicker, trail.y + flicker, 0,
            trail.x, trail.y, flameSize
        );
        grad.addColorStop(0, currentFlame.core[0]);
        console.log(currentFlame.core[0]);
        grad.addColorStop(0.5, currentFlame.core[1]);
        grad.addColorStop(1, currentFlame.core[2]);

        context3.globalAlpha = alpha;
        context3.fillStyle = grad;
        context3.beginPath();
        context3.arc(trail.x + flicker, trail.y + flicker, flameSize, 0, Math.PI * 2);
        context3.fill();
    }

    context3.globalAlpha = 1;
    requestAnimationFrame(drawFlameTrail);
}

drawFlameTrail();

const canvas2 = document.getElementById('canvas2');
const width2 = canvas2.clientWidth * 2;
const height2 = canvas2.clientHeight * 2;

canvas2.width = width2;
canvas2.height = height2;

const context2 = canvas2.getContext('2d');

let time = 0;
const centerX = width2 / 2 - 100;
const centerY = height2 - 300;
const swordHeight = Math.sqrt(height2 * height2 + width2 * width2);
const swordWidth = width2 * 0.18;

const swordAngle = -230;
const flareCount = 15;
const flares = [];

const flamePresets = [
    {
        core: ['rgba(180, 240, 255, 1)', 'rgba(100, 180, 255, 0.6)', 'rgba(50, 120, 255, 0.2)'], // Bleu
        glow: ['rgba(0,150,255,0.5)', 'rgba(0,120,255,0.3)', 'rgba(0,80,200,0.0)'],
        pulse: 'rgba(100,200,255,'
    },
    {
        core: ['rgba(220, 180, 255, 1)', 'rgba(160, 100, 255, 0.6)', 'rgba(100, 50, 200, 0.2)'], // Violet
        glow: ['rgba(180,0,255,0.4)', 'rgba(140,0,200,0.2)', 'rgba(80,0,150,0.0)'],
        pulse: 'rgba(180,100,255,'
    },
    {
        core: ['rgba(180, 255, 180, 1)', 'rgba(100, 255, 100, 0.6)', 'rgba(50, 200, 50, 0.2)'], // Vert
        glow: ['rgba(0,255,150,0.4)', 'rgba(0,200,100,0.2)', 'rgba(0,150,80,0.0)'],
        pulse: 'rgba(100,255,180,'
    },
    {
        core: ['rgba(255, 255, 180, 1)', 'rgba(255, 200, 100, 0.6)', 'rgba(255, 150, 50, 0.2)'], // Jaune
        glow: ['rgba(255,220,0,0.4)', 'rgba(200,150,0,0.2)', 'rgba(150,100,0,0.0)'],
        pulse: 'rgba(255,200,100,'
    }
];

let currentFlame = flamePresets[Math.floor(Math.random() * flamePresets.length)];

for (let i = 0; i < flareCount; i++) {
    flares.push({
        offsetY: -Math.random() * swordHeight,
        lifetime: Math.random() * 60 + 30,
        age: 0,
        side: Math.random() < 0.5 ? -1 : 1
    });
}

function drawFlameShape(context, baseX, baseY, height, width, timeOffset, flip = 1) {
    context.beginPath();
    context.moveTo(baseX, baseY);

    const segments = 5;
    for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const y = baseY - height * t;
        const wobble = Math.sin(time * 5 + timeOffset + i) * 4 * (1 - t);
        const x = baseX + flip * (wobble + width * Math.sin(t * Math.PI));
        context.lineTo(x, y);
    }

    context.lineTo(baseX, baseY - height);

    for (let i = segments; i >= 0; i--) {
        const t = i / segments;
        const y = baseY - height * t;
        const wobble = Math.sin(time * 5 + timeOffset + i + 2.5) * 4 * (1 - t);
        const x = baseX - flip * (wobble + width * Math.sin(t * Math.PI));
        context.lineTo(x, y);
    }

    context.closePath();
}

// 🔥 Nouvelles flammes dynamiques plasma-like
function drawDynamicFlame(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI * 2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const radius = size + Math.sin(time * 2 + i) * 8;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.4 + Math.random() * 0.4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.restore();
}

function drawZealotSwordFlame() {
    context2.clearRect(0, 0, width2, height2);
    context2.save();
    context2.translate(centerX, centerY);
    context2.rotate(swordAngle);

    // Flamme périphérique
    const flameGradient = context2.createRadialGradient(0, 0, 0, 0, 0, swordHeight * 1.2);
    flameGradient.addColorStop(0.0, currentFlame.glow[0]);
    flameGradient.addColorStop(0.4, currentFlame.glow[1]);
    flameGradient.addColorStop(1, currentFlame.glow[2]);

    context2.fillStyle = flameGradient;
    context2.shadowColor = currentFlame.glow[0];
    context2.shadowBlur = 40;
    context2.globalCompositeOperation = 'soft-light';

    context2.beginPath();
    context2.moveTo(0, 0);
    for (let y = 0; y >= -swordHeight; y -= 12) {
        const progress = -y / swordHeight;
        const wave = Math.sin((y + time * 60) / 25 + progress * 5) * 6 * progress;
        const offsetX = -swordWidth * 1.5 * progress + wave;
        context2.lineTo(offsetX, y);
    }
    for (let y = -swordHeight; y <= 0; y += 12) {
        const progress = -y / swordHeight;
        const wave = Math.sin((y + time * 60 + Math.PI) / 25 + progress * 5) * 6 * progress;
        const offsetX = swordWidth * 1.5 * progress + wave;
        context2.lineTo(offsetX, y);
    }
    context2.closePath();
    context2.fill();
    context2.globalCompositeOperation = 'source-over';

    // Cœur de l’épée
    const innerGradient = context2.createLinearGradient(0, 0, 0, -swordHeight);
    innerGradient.addColorStop(0, currentFlame.core[0]);
    innerGradient.addColorStop(0.6, currentFlame.core[1]);
    innerGradient.addColorStop(1, currentFlame.core[2]);

    context2.fillStyle = innerGradient;
    context2.shadowBlur = 0;
    context2.beginPath();
    context2.moveTo(0, 0);
    context2.lineTo(-swordWidth / 2, -swordHeight);
    context2.lineTo(swordWidth / 2, -swordHeight);
    context2.closePath();
    context2.fill();

    // Flammes dynamiques épaisses
    for (let flare of flares) {
        const progress = flare.age / flare.lifetime;
        const alpha = Math.sin(progress * Math.PI);
        const flareHeight = 40 + Math.sin(time * 2 + flare.offsetY / 20) * 10;
        const flareWidth = 6;

        const progressY = -flare.offsetY / swordHeight;
        const wave = Math.sin((flare.offsetY + time * 60) / 25 + progressY * 5) * 6 * progressY;
        const baseX = (swordWidth * 1.5 * progressY + wave) * flare.side;
        const baseY = flare.offsetY + Math.sin(time * 3 + flare.offsetY / 15) * 5;

        drawFlameShape(context2, baseX, baseY, flareHeight, flareWidth, flare.offsetY / 30, flare.side);

        context2.fillStyle = `${currentFlame.glow[0].replace('0.5', `${0.5 * alpha}`)}`;
        context2.shadowColor = currentFlame.glow[0];
        context2.shadowBlur = 12;
        context2.fill();

        flare.age++;
        if (flare.age > flare.lifetime) {
            flare.offsetY = -Math.random() * swordHeight;
            flare.lifetime = Math.random() * 60 + 30;
            flare.age = 0;
            flare.side = Math.random() < 0.5 ? -1 : 1;
        }
    }

    // ✨ Flammes périphériques organiques supplémentaires
    for (let i = 0; i < 5; i++) {
        const offsetX = (Math.random() - 0.5) * swordWidth * 2;
        const offsetY = -Math.random() * swordHeight;
        drawDynamicFlame(context2, offsetX, offsetY, 15 + Math.random() * 10, currentFlame.glow[0]);
    }

    // Pulsation lumineuse à la base
    const pulse = Math.sin(time * 3) * 0.2 + 0.8;
    const pulseGradient = context2.createRadialGradient(0, 0, 0, 0, 0, 40);
    pulseGradient.addColorStop(0, `${currentFlame.pulse}${0.4 * pulse})`);
    pulseGradient.addColorStop(1, 'rgba(0,0,0,0)');
    context2.fillStyle = pulseGradient;
    context2.beginPath();
    context2.arc(0, 0, 40, 0, Math.PI * 2);
    context2.fill();

    context2.restore();
    time += 0.08;
    requestAnimationFrame(drawZealotSwordFlame);
}

drawZealotSwordFlame();

const canvas = document.getElementById('canvas');
const width = canvas.clientWidth*2;
const height = canvas.clientHeight*2;

canvas.width = width;
canvas.height = height;

const context = canvas.getContext('2d');

const baseColor1 = "#000000";
const baseColor2 = "#191970";

const zealot = {
    src: 'images/protoss/zealot.png',
    size: 500,
}

const hero = [
    {
        src: 'images/heros/kerrigan.png',
        sizeX: 700,
        sizeY: 700,
        color: "#6614b8",
    },
    {
        src: 'images/heros/artanis.png',
        sizeX: 700,
        sizeY: 700,
        color: "#0080ff",
    },
    {
        src: 'images/heros/raynor.png',
        sizeX: 700,
        sizeY: 700,
        color: "#ffffff",
    }
]

const protossAssets = [
    {
        src: 'images/protoss/collosus.png',
        size: 250,
        unit_type: 'ground',
    },
    {
        src: 'images/protoss/phoenix.png',
        size: 100,
        unit_type: 'flying',
    },
    {
        src: 'images/protoss/stalker.png',
        size: 125,
        unit_type: 'ground',
    },
    {
        src: 'images/protoss/tempest.png',
        size: 200,
        unit_type: 'flying',
    },
    {
        src: 'images/protoss/carrier.png',
        size: 200,
        unit_type: 'flying',
    },
]

const zergAssets = [
    {
        src: 'images/zerg/zergling.webp',
        size: 75,
        unit_type: 'ground',
    },
    {
        src: 'images/zerg/hydralisk.png',
        size: 100,
        unit_type: 'ground',
    },
    {
        src: 'images/zerg/queen.webp',
        size: 100,
        unit_type: 'ground',
    },
    {
        src: 'images/zerg/mutalisk.png',
        size: 150,
        unit_type: 'ground',
    },
    {
        src: 'images/zerg/broodlord.webp',
        size: 200,
        unit_type: 'ground',
    },
    {
        src: 'images/zerg/ultralisk.png',
        size: 150,
        unit_type: 'ground',
    },
    {
        src: 'images/zerg/Overlord.webp',
        size: 100,
        unit_type: 'ground',
    }
]

const terranAssets = [
    {
        src: 'images/terran/marine.png',
        size: 100,
        unit_type: 'ground',
    },
    {
        src: 'images/terran/goliath.png',
        size: 150,
        unit_type: 'ground',
    },
    {
        src: 'images/terran/tank.png',
        size: 125,
        unit_type: 'ground',
    },
    {
        src: 'images/terran/Raven.png',
        size: 125,
        unit_type: 'ground',
    },
    {
        src: 'images/terran/banshee.png',
        size: 125,
        unit_type: 'flying',
    },
    {
        src: 'images/terran/battlecruiser.webp',
        size: 150,
        unit_type: 'flying',
    },
    {
        src: 'images/terran/reaper.png',
        size: 100,
        unit_type: 'ground',
    },
    {
        src: 'images/terran/thor.png',
        size: 200,
        unit_type: 'ground',
    }
]

const allAssets = [...protossAssets, ...zergAssets, ...terranAssets];

const loadImages = (sources) => {
    return Promise.all(sources.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                img.size = src.size;
                img.unit_type = src.unit_type;
                resolve(img);
            };
            img.onerror = reject;
            img.src = src.src;
        });
    }));
};

const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    const bigint = parseInt(hex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

const lerpColor = (color1, color2, t) => {
    return {
        r: Math.round(color1.r + (color2.r - color1.r) * t),
        g: Math.round(color1.g + (color2.g - color1.g) * t),
        b: Math.round(color1.b + (color2.b - color1.b) * t),
    };
}

const randomColorBetween = (hex1, hex2) => {
    const c1 = hexToRgb(hex1);
    const c2 = hexToRgb(hex2);
    const t = Math.random();
    const mixed = lerpColor(c1, c2, t);
    return `rgb(${mixed.r}, ${mixed.g}, ${mixed.b})`;
}

const drawBasePlanetaryStation = async () => {
    return new Promise((resolve, reject) => {
        const texture = new Image();
        texture.src = 'images/textures/moon_texture.jpg';

        texture.onload = () => {
            const x = canvas.width / 2;
            const y = canvas.height;
            const radiusX = canvas.width / 1.5;
            const radiusY = radiusX * 0.6;
            context.save();
            context.beginPath();
            context.ellipse(x, y, radiusX, radiusY, 0, Math.PI, 2 * Math.PI);
            context.closePath();
            context.clip();

            context.drawImage(
                texture,
                x - radiusX,
                y - radiusY,
                radiusX * 2,
                radiusY * 2
            );

            context.restore();

            const gradient = context.createRadialGradient(
                x, y, radiusX * 0.95,
                x, y, radiusX * 1.05
            );
            gradient.addColorStop(0, "rgba(72, 72, 72, 0.5)");
            gradient.addColorStop(0.5, "rgba(72, 72, 72, 0.25)");
            gradient.addColorStop(1, "rgba(72, 72, 72, 0)");

            context.beginPath();
            context.ellipse(x, y, radiusX, radiusY, 0, Math.PI, 2 * Math.PI);
            context.strokeStyle = gradient;
            context.lineWidth = 10;
            context.stroke();

            resolve({ x, y, radiusX, radiusY });
        };

        texture.onerror = reject;
    });
};

const drawMultipleBluePlanetaryStations = async (count = 3) => {
    const promises = [];

    for (let i = 0; i < count; i++) {
        promises.push(new Promise((resolve, reject) => {
            const texture = new Image();
            const randomTexture = Math.floor(Math.random() * 3) + 1;
            texture.src = `images/textures/texture_blue_planetary-${randomTexture}.png`;

            texture.onload = () => {
                const maxRadius = canvas.width / 1.5;
                const radius = maxRadius * (0.3 + Math.random() * 0.7);
                
                const padding = 100;
                const centerX = padding + Math.random() * (canvas.width - radius * 2 - padding * 2);
                const centerY = padding + Math.random() * (canvas.height - radius * 2 - padding * 2);

                const brightness = 0.5 + (i / count) * 0.5;

                context.save();
                context.beginPath();
                context.arc(centerX + radius, centerY + radius, radius, 0, Math.PI * 2);
                context.filter = `brightness(${brightness})`;
                context.closePath();
                context.clip();

                context.drawImage(texture, centerX, centerY, radius * 2, radius * 2);
                context.restore();

                const gradient = context.createRadialGradient(
                    centerX + radius, centerY + radius, radius * 0.95,
                    centerX + radius, centerY + radius, radius * 1.05
                );
                gradient.addColorStop(0, `rgba(0, 0, 255, ${0.5 * brightness})`);
                gradient.addColorStop(0.5, `rgba(0, 0, 255, ${0.25 * brightness})`);
                gradient.addColorStop(1, "rgba(0, 0, 255, 0)");

                context.beginPath();
                context.arc(centerX + radius, centerY + radius, radius, 0, Math.PI * 2);
                context.strokeStyle = gradient;
                context.lineWidth = 20;
                context.stroke();

                resolve();
            };

            texture.onerror = reject;
        }));
    }

    await Promise.all(promises);
};

const drawGroundUnitsOnPlanet = (images, planet) => {
    const groundUnits = images.filter(img => img.unit_type === 'ground');
    const count = Math.floor(Math.random() * 20) + 10;

    for (let i = 0; i < count; i++) {
        const img = groundUnits[Math.floor(Math.random() * groundUnits.length)];

        let x, y;
        let tries = 0;
        do {
            const angle = Math.random() * Math.PI;
            const r = Math.sqrt(Math.random());
            x = planet.x + r * planet.radiusX * Math.cos(angle);
            y = planet.y + r * planet.radiusY * Math.sin(angle) - 300;
            tries++;
        } while ((x < 0 || x > canvas.width || y < canvas.height - planet.radiusY - 100) && tries < 20);

        const size = img.size + Math.random() * 20;
        context.drawImage(img, x - size / 2, y - size / 2, size, size);

        const brightnessFactor = 0.3 + 0.5 * (i / count);

        context.save();
        context.filter = `brightness(${brightnessFactor})`;
        context.drawImage(img, x - size / 2, y - size / 2, size, size);
        context.restore();
    }
};

const drawStellarParticles = () => {
    const count = Math.floor(Math.random() * 1500) + 1000;

    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5 + 0.5;

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
        context.filter = `brightness(0.55)`;
        context.fill();
        context.restore();
        context.filter = `brightness(1)`;   
    }
};

const drawRandomAssetsOnPlanet = (images, planet) => {
    const count = Math.floor(Math.random() * 60) + 1;

    for (let i = 0; i < count; i++) {
        const img = images[Math.floor(Math.random() * images.length)];
        if (img.unit_type === 'ground') continue;

        let x, y;
        let tries = 0;
        const maxTries = 10;

        do {
            x = Math.random() * (canvas.width - img.size);
            y = Math.random() * (canvas.height - img.size);

            const dx = (x + img.size / 2 - planet.x) / planet.radiusX;
            const dy = (y + img.size / 2 - planet.y) / planet.radiusY;
            const isInsidePlanet = dx * dx + dy * dy <= 1 && (y + img.size / 2) >= planet.y;

            if (!isInsidePlanet) break;

            tries++;
        } while (tries < maxTries);

        const size = img.size + Math.random() * 30;

        const brightnessFactor = 0.3 + 0.5 * (i / count);

        context.save();
        context.filter = `brightness(${brightnessFactor})`;
        context.drawImage(img, x, y, size, size);
        context.restore();
    }
};

const drawHeroes = async (heroes) => {
    const hero = heroes[Math.floor(Math.random() * heroes.length)];
    const { img } = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ img });
        img.onerror = reject;
        img.src = hero.src;
    });

    const x = canvas.width / 2 - hero.sizeX / 2;
    const y = canvas.height / 2 - hero.sizeY / 2 + 100;

    context.save();
    context.globalAlpha = 0.6;
    context.shadowColor = hero.color;
    context.shadowBlur = 30;
    context.drawImage(img, x, y, hero.sizeX, hero.sizeY);
    context.restore();
};

const draw = async () => {
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const bgColor = randomColorBetween(baseColor1, baseColor2);
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'rgba(0, 0, 0, 0.55)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    try {
        drawStellarParticles();
        const images = await loadImages(allAssets);
        const bluePlanetaryRate = Math.random();
        if (bluePlanetaryRate > 0.5) {
            const count = Math.floor(Math.random() * 3) + 1;
            await drawMultipleBluePlanetaryStations(count);
        }
        if (Math.random() > 0.85) {
            await drawHeroes(hero);
        }
        const planet = await drawBasePlanetaryStation();
        await drawGroundUnitsOnPlanet(images, planet);
        await drawRandomAssetsOnPlanet(images, planet);
        const zealotImg = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = zealot.src;
        });

        const x = canvas.width - zealot.size + 25;
        const y = canvas.height - zealot.size;
        context.drawImage(zealotImg, x, y, zealot.size, zealot.size);

        const blizzardImg = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = 'images/starcraft_logo.png';
        });

        const x_logo = canvas.width/2 - 300;
        const y_logo = canvas.height/2 - 400;
        context.drawImage(blizzardImg, x_logo, y_logo, 600, 250);
        
    } catch (error) {
        console.error('Erreur lors du chargement des images', error);
    }
};

draw();

const button = document.getElementById('button');
button.addEventListener('click', () => {
    draw();
    currentFlame = flamePresets[Math.floor(Math.random() * flamePresets.length)];
    for (let flare of flares) {
      flare.offsetY = -Math.random() * swordHeight;
      flare.lifetime = Math.random() * 60 + 30;
      flare.age = 0;
      flare.side = Math.random() < 0.5 ? -1 : 1;
    }
});