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
        size: 100,
        unit_type: 'ground',
    },
    {
        src: 'images/terran/Raven.png',
        size: 100,
        unit_type: 'ground',
    },
    {
        src: 'images/terran/banshee.png',
        size: 100,
        unit_type: 'flying',
    },
    {
        src: 'images/terran/battlecruiser.webp',
        size: 150,
        unit_type: 'flying',
    },
    {
        src: 'images/terran/reaper.png',
        size: 75,
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


const draw = async () => {
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const bgColor = randomColorBetween(baseColor1, baseColor2);

    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    try {
        const images = await loadImages(allAssets);
        drawRandomAssets(images);
        const zealotImg = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = zealot.src;
        });

        const x = canvas.width - zealot.size + 25;
        const y = canvas.height - zealot.size;
        context.drawImage(zealotImg, x, y, zealot.size, zealot.size);
    } catch (error) {
        console.error('Erreur lors du chargement des images', error);
    }
};

draw();