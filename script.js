const canvas = document.getElementById('canvas');
const width = canvas.clientWidth*2;
const height = canvas.clientHeight*2;

canvas.width = width;
canvas.height = height;

const context = canvas.getContext('2d');

const protossAssets = [
    {
        src: 'images/protoss/zealot.png',
        size: 75,
    },
    {
        src: 'images/protoss/collosus.png',
        size: 250,
    },
    {
        src: 'images/protoss/phoenix.png',
        size: 100,
    },
    {
        src: 'images/protoss/stalker.png',
        size: 100,
    },
    {
        src: 'images/protoss/tempest.png',
        size: 200,
    },
    {
        src: 'images/protoss/carrier.png',
        size: 200,
    },
]

const zergAssets = [
    {
        src: 'images/zerg/zergling.webp',
        size: 75,
    },
    {
        src: 'images/zerg/hydralisk.png',
        size: 100,
    },
    {
        src: 'images/zerg/queen.webp',
        size: 100,
    },
    {
        src: 'images/zerg/mutalisk.png',
        size: 150,
    },
    {
        src: 'images/zerg/broodlord.webp',
        size: 200,
    },
    {
        src: 'images/zerg/ultralisk.png',
        size: 150,
    },
    {
        src: 'images/zerg/Overlord.webp',
        size: 100,
    }
]

const terranAssets = [
    {
        src: 'images/terran/marine.png',
        size: 100,
    },
    {
        src: 'images/terran/goliath.png',
        size: 150,
    },
    {
        src: 'images/terran/tank.png',
        size: 100,
    },
    {
        src: 'images/terran/Raven.png',
        size: 100,
    },
    {
        src: 'images/terran/banshee.png',
        size: 100,
    },
    {
        src: 'images/terran/battlecruiser.webp',
        size: 150,
    },
    {
        src: 'images/terran/reaper.png',
        size: 75,
    },
    {
        src: 'images/terran/thor.png',
        size: 200,
    }
]

const allAssets = [...protossAssets, ...zergAssets, ...terranAssets];

const loadImages = (sources) => {
    return Promise.all(sources.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }));
};

const drawRandomAssets = (images) => {
    const count = Math.floor(Math.random() * 75) + 1;

    for (let i = 0; i < count; i++) {
        const img = images[Math.floor(Math.random() * images.length)];
        const x = Math.random() * (canvas.width - 50);
        const y = Math.random() * (canvas.height - 50);
        const size = 40 + Math.random() * 30;
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
    } catch (error) {
        console.error('Erreur lors du chargement des images', error);
    }
};

draw();