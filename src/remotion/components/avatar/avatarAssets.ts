export const avatarHead = `
<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <!-- Realistic Head Base -->
  <path d="M 50 100 C 50 200, 150 200, 150 100 C 150 20, 50 20, 50 100" fill="#E8B49E"/>
  <path d="M 55 105 C 55 190, 145 190, 145 105 C 145 35, 55 35, 55 105" fill="#F0C1B0"/>
  
  <!-- Hair -->
  <path d="M 40 100 C 40 10, 160 10, 160 100 C 155 70, 140 40, 100 40 C 60 40, 45 70, 40 100" fill="#2E2420"/>
  <path d="M 40 100 C 50 50, 90 30, 140 40 C 160 50, 165 90, 160 100 Z" fill="#3D302A"/>
  
  <!-- Ears -->
  <ellipse cx="45" cy="110" rx="10" ry="15" fill="#D9A18B"/>
  <ellipse cx="155" cy="110" rx="10" ry="15" fill="#D9A18B"/>
  
  <!-- Nose -->
  <path d="M 100 110 L 95 140 L 105 140 Z" fill="#D49982"/>
  <path d="M 90 145 Q 100 155 110 145" fill="none" stroke="#C58972" stroke-width="2"/>
</svg>
`;

export const avatarEyebrows = `
<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <!-- Eyebrows -->
  <path d="M 65 90 Q 80 80 95 90" fill="none" stroke="#2E2420" stroke-width="5" stroke-linecap="round"/>
  <path d="M 105 90 Q 120 80 135 90" fill="none" stroke="#2E2420" stroke-width="5" stroke-linecap="round"/>
</svg>
`;

export const avatarEyes = `
<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <!-- Eyes -->
  <path d="M 65 105 Q 80 100 90 105 Q 80 110 65 105" fill="#FFFFFF"/>
  <path d="M 110 105 Q 120 100 135 105 Q 120 110 110 105" fill="#FFFFFF"/>
  
  <!-- Pupils -->
  <circle cx="78" cy="105" r="4" fill="#3A2A1E"/>
  <circle cx="122" cy="105" r="4" fill="#3A2A1E"/>
  
  <!-- Iris highlights -->
  <circle cx="77" cy="104" r="1.5" fill="#FFFFFF"/>
  <circle cx="121" cy="104" r="1.5" fill="#FFFFFF"/>
</svg>
`;

export const avatarMouthClosed = `
<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <!-- Closed Mouth -->
  <path d="M 85 170 Q 100 174 115 170" fill="none" stroke="#A76E5B" stroke-width="3" stroke-linecap="round"/>
  <path d="M 90 170 Q 100 168 110 170" fill="none" stroke="#D18770" stroke-width="2"/>
</svg>
`;

export const avatarMouthSmallOpen = `
<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <!-- Small Open Mouth -->
  <path d="M 87 170 Q 100 178 113 170 Q 100 168 87 170" fill="#4A201A"/>
  <!-- Teeth -->
  <path d="M 89 170 Q 100 173 111 170" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="1.5"/>
</svg>
`;

export const avatarMouthMediumOpen = `
<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <!-- Medium Open Mouth -->
  <path d="M 85 170 Q 100 185 115 170 Q 100 165 85 170" fill="#4A201A"/>
  <!-- Teeth -->
  <path d="M 88 170 Q 100 174 112 170" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="2"/>
  <!-- Tongue -->
  <path d="M 92 178 Q 100 172 108 178" fill="#D36B69"/>
</svg>
`;

export const avatarMouthWideOpen = `
<svg width="200" height="250" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
  <!-- Wide Open Mouth -->
  <path d="M 82 170 Q 100 195 118 170 Q 100 160 82 170" fill="#4A201A"/>
  <!-- Teeth -->
  <path d="M 86 170 Q 100 175 114 170" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="2.5"/>
  <!-- Tongue -->
  <path d="M 92 185 Q 100 175 108 185" fill="#D36B69"/>
</svg>
`;

export const avatarBody = `
<svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Neck -->
  <path d="M 285 0 L 315 0 L 320 60 L 280 60 Z" fill="#D9A18B"/>
  
  <!-- T-shirt collar -->
  <path d="M 265 60 Q 300 90 335 60 L 360 80 L 240 80 Z" fill="#1C1E26"/>
  
  <!-- Torso (Black T-shirt) -->
  <path d="M 240 80 L 360 80 L 400 200 L 410 400 L 190 400 L 200 200 Z" fill="#242732"/>
  
  <!-- T-shirt highlights -->
  <path d="M 250 120 Q 300 140 350 120" fill="none" stroke="#2D313F" stroke-width="1.5"/>
  <path d="M 260 200 Q 300 230 340 200" fill="none" stroke="#2D313F" stroke-width="1.5"/>
</svg>
`;

export const avatarArmLeft = `
<svg width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Left Shoulder/Sleeve -->
  <path d="M 200 80 Q 150 100 140 220 L 200 210 Z" fill="#242732"/>
  
  <!-- Left Forearm -->
  <path d="M 140 220 L 130 360 L 180 350 L 200 210 Z" fill="#D9A18B"/>
  
  <!-- Left Hand (Open) -->
  <path d="M 130 360 C 100 370, 100 400, 140 400 C 180 400, 190 380, 180 350 Z" fill="#F0C1B0"/>
</svg>
`;

export const avatarArmRight = `
<svg width="300" height="400" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Right Shoulder/Sleeve -->
  <path d="M 100 80 Q 150 100 160 220 L 100 210 Z" fill="#242732"/>
  
  <!-- Right Forearm -->
  <path d="M 160 220 L 170 360 L 120 350 L 100 210 Z" fill="#D9A18B"/>
  
  <!-- Right Hand (Explaining) -->
  <path d="M 170 360 C 200 370, 200 400, 160 400 C 120 400, 110 380, 120 350 Z" fill="#F0C1B0"/>
  <!-- Pointing finger -->
  <path d="M 175 365 L 185 340 L 195 345 L 180 375 Z" fill="#F0C1B0"/>
</svg>
`;
