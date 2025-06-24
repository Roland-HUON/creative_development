const canvas = document.getElementById('canvas');
const width = canvas.clientWidth*2;
const height = canvas.clientHeight*2;

canvas.width = width;
canvas.height = height;

const context = canvas.getContext('2d');

const zealot = {
    src: 'images/protoss/zealot.png',
    size: 500,
}

const hero = [
    {
        src: 'images/protoss/hero.png',
        size: 100,
    },
    {
        src: 'images/protoss/hero.png',
        size: 100,
    },
    {
        src: 'images/protoss/hero.png',
        size: 100,
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

const drawRandomAssets = (images) => {
    const count = Math.floor(Math.random() * 45) + 1;

    for (let i = 0; i < count; i++) {
        const img = images[Math.floor(Math.random() * images.length)];
        const x = Math.random() * (canvas.width - img.size);
        const y = Math.random() * (canvas.height - img.size);
        const size = img.size + Math.random() * 30;
        context.drawImage(img, x, y, size, size);
    }
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

const baseColor1 = "#000000";
const baseColor2 = "#191970";

const drawBasePlanetaryStation = async () => {
    return new Promise((resolve, reject) => {
        const texture = new Image();
        texture.src = 'images/textures/moon_texture.jpg';
        texture.onload = () => {
            const pattern = context.createPattern(texture, 'repeat');

            const x = canvas.width / 2;
            const y = canvas.height;
            const radiusX = canvas.width / 1.5;
            const radiusY = radiusX * 0.6;

            context.beginPath();
            context.fillStyle = pattern;
            context.strokeStyle = "#d8dfe3";
            context.lineWidth = 10; 
            context.ellipse(x, y, radiusX, radiusY, 0, Math.PI, 2 * Math.PI);
            context.closePath();
            context.fill();
            context.stroke();
            resolve({ x, y, radiusX, radiusY });
        };
        texture.onerror = reject;
    });
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
            y = planet.y + r * planet.radiusY * Math.sin(angle);
            tries++;
        } while ((x < 0 || x > canvas.width || y < canvas.height - planet.radiusY - 100) && tries < 20);

        const size = img.size + Math.random() * 20;
        context.drawImage(img, x - size / 2, y - size / 2, size, size);
    }
};

const drawStellarParticles = (planet) => {
    const count = Math.floor(Math.random() * 1500) + 500;

    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (planet.y - planet.radiusY);
        const radius = Math.random() * 1.5 + 0.5;

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
        context.fill();
    }
};

const drawRandomAssetsOnPlanet = (images, planet) => {
    const count = Math.floor(Math.random() * 45) + 1;

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
        context.drawImage(img, x, y, size, size);
    }
};

const draw = async () => {
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const bgColor = randomColorBetween(baseColor1, baseColor2);

    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    try {
        const images = await loadImages(allAssets);
        const planet = await drawBasePlanetaryStation();
        await drawStellarParticles(planet);
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