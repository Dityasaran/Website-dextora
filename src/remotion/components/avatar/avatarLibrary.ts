// Avatar Library — 3 distinct avatar presets with different appearances
// Each avatar uses the same 10-layer structure but with different colors/styles

export interface AvatarPreset {
    id: string;
    name: string;
    thumbnail: string; // emoji for now, can be replaced with images
    skinBase: string;
    skinHighlight: string;
    skinShadow: string;
    hairColor: string;
    hairHighlight: string;
    eyeColor: string;
    shirtColor: string;
    shirtHighlight: string;
    collarColor: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
    {
        id: "alex",
        name: "Alex",
        thumbnail: "👨‍💼",
        skinBase: "#E8B49E",
        skinHighlight: "#F0C1B0",
        skinShadow: "#D9A18B",
        hairColor: "#2E2420",
        hairHighlight: "#3D302A",
        eyeColor: "#3A2A1E",
        shirtColor: "#242732",
        shirtHighlight: "#2D313F",
        collarColor: "#1C1E26",
    },
    {
        id: "priya",
        name: "Priya",
        thumbnail: "👩‍💼",
        skinBase: "#C68642",
        skinHighlight: "#D4965A",
        skinShadow: "#A0693A",
        hairColor: "#1A1110",
        hairHighlight: "#2A1F1E",
        eyeColor: "#2C1810",
        shirtColor: "#5B21B6",
        shirtHighlight: "#6D35CC",
        collarColor: "#4C1D95",
    },
    {
        id: "jordan",
        name: "Jordan",
        thumbnail: "🧑‍💻",
        skinBase: "#FDDBB4",
        skinHighlight: "#FEE8CF",
        skinShadow: "#E8C9A0",
        hairColor: "#8B6914",
        hairHighlight: "#A67C1A",
        eyeColor: "#2D6A4F",
        shirtColor: "#1E3A5F",
        shirtHighlight: "#274B73",
        collarColor: "#162D4A",
    },
];

export const getAvatarPreset = (id: string): AvatarPreset => {
    return AVATAR_PRESETS.find(a => a.id === id) || AVATAR_PRESETS[0];
};

// Generate SVG strings dynamically based on avatar preset colors
export function generateAvatarHead(p: AvatarPreset): string {
    return `<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <path d="M 50 100 C 50 200, 150 200, 150 100 C 150 20, 50 20, 50 100" fill="${p.skinBase}"/>
  <path d="M 55 105 C 55 190, 145 190, 145 105 C 145 35, 55 35, 55 105" fill="${p.skinHighlight}"/>
  <path d="M 40 100 C 40 10, 160 10, 160 100 C 155 70, 140 40, 100 40 C 60 40, 45 70, 40 100" fill="${p.hairColor}"/>
  <path d="M 40 100 C 50 50, 90 30, 140 40 C 160 50, 165 90, 160 100 Z" fill="${p.hairHighlight}"/>
  <ellipse cx="45" cy="110" rx="10" ry="15" fill="${p.skinShadow}"/>
  <ellipse cx="155" cy="110" rx="10" ry="15" fill="${p.skinShadow}"/>
  <path d="M 100 110 L 95 140 L 105 140 Z" fill="${p.skinShadow}"/>
  <path d="M 90 145 Q 100 155 110 145" fill="none" stroke="${p.skinShadow}" stroke-width="2"/>
</svg>`;
}

export function generateAvatarEyebrows(p: AvatarPreset): string {
    return `<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <path d="M 65 90 Q 80 80 95 90" fill="none" stroke="${p.hairColor}" stroke-width="5" stroke-linecap="round"/>
  <path d="M 105 90 Q 120 80 135 90" fill="none" stroke="${p.hairColor}" stroke-width="5" stroke-linecap="round"/>
</svg>`;
}

export function generateAvatarEyes(p: AvatarPreset): string {
    return `<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <path d="M 65 105 Q 80 100 90 105 Q 80 110 65 105" fill="#FFFFFF"/>
  <path d="M 110 105 Q 120 100 135 105 Q 120 110 110 105" fill="#FFFFFF"/>
  <circle cx="78" cy="105" r="4" fill="${p.eyeColor}"/>
  <circle cx="122" cy="105" r="4" fill="${p.eyeColor}"/>
  <circle cx="77" cy="104" r="1.5" fill="#FFFFFF"/>
  <circle cx="121" cy="104" r="1.5" fill="#FFFFFF"/>
</svg>`;
}

export function generateAvatarMouthClosed(p: AvatarPreset): string {
    return `<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <path d="M 85 170 Q 100 174 115 170" fill="none" stroke="${p.skinShadow}" stroke-width="3" stroke-linecap="round"/>
</svg>`;
}

export function generateAvatarMouthSmallOpen(): string {
    return `<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <path d="M 87 170 Q 100 178 113 170 Q 100 168 87 170" fill="#4A201A"/>
  <path d="M 89 170 Q 100 173 111 170" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="1.5"/>
</svg>`;
}

export function generateAvatarMouthMediumOpen(): string {
    return `<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <path d="M 85 170 Q 100 185 115 170 Q 100 165 85 170" fill="#4A201A"/>
  <path d="M 88 170 Q 100 174 112 170" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="2"/>
  <path d="M 92 178 Q 100 172 108 178" fill="#D36B69"/>
</svg>`;
}

export function generateAvatarMouthWideOpen(): string {
    return `<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <path d="M 82 170 Q 100 195 118 170 Q 100 160 82 170" fill="#4A201A"/>
  <path d="M 86 170 Q 100 175 114 170" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="2.5"/>
  <path d="M 92 185 Q 100 175 108 185" fill="#D36B69"/>
</svg>`;
}

export function generateAvatarBody(p: AvatarPreset): string {
    return `<svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <path d="M 285 0 L 315 0 L 320 60 L 280 60 Z" fill="${p.skinShadow}"/>
  <path d="M 265 60 Q 300 90 335 60 L 360 80 L 240 80 Z" fill="${p.collarColor}"/>
  <path d="M 240 80 L 360 80 L 400 200 L 410 400 L 190 400 L 200 200 Z" fill="${p.shirtColor}"/>
  <path d="M 250 120 Q 300 140 350 120" fill="none" stroke="${p.shirtHighlight}" stroke-width="1.5"/>
  <path d="M 260 200 Q 300 230 340 200" fill="none" stroke="${p.shirtHighlight}" stroke-width="1.5"/>
</svg>`;
}

export function generateAvatarArmLeft(p: AvatarPreset): string {
    return `<svg width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
  <path d="M 200 80 Q 150 100 140 220 L 200 210 Z" fill="${p.shirtColor}"/>
  <path d="M 140 220 L 130 360 L 180 350 L 200 210 Z" fill="${p.skinShadow}"/>
  <path d="M 130 360 C 100 370, 100 400, 140 400 C 180 400, 190 380, 180 350 Z" fill="${p.skinHighlight}"/>
</svg>`;
}

export function generateAvatarArmRight(p: AvatarPreset): string {
    return `<svg width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
  <path d="M 100 80 Q 150 100 160 220 L 100 210 Z" fill="${p.shirtColor}"/>
  <path d="M 160 220 L 170 360 L 120 350 L 100 210 Z" fill="${p.skinShadow}"/>
  <path d="M 170 360 C 200 370, 200 400, 160 400 C 120 400, 110 380, 120 350 Z" fill="${p.skinHighlight}"/>
  <path d="M 175 365 L 185 340 L 195 345 L 180 375 Z" fill="${p.skinHighlight}"/>
</svg>`;
}
