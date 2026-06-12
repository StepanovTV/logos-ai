---
name: Synthetic Dialectic
colors:
  surface: '#131316'
  surface-dim: '#131316'
  surface-bright: '#39393c'
  surface-container-lowest: '#0e0e11'
  surface-container-low: '#1b1b1e'
  surface-container: '#1f1f22'
  surface-container-high: '#2a2a2d'
  surface-container-highest: '#353438'
  on-surface: '#e4e1e6'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e4e1e6'
  inverse-on-surface: '#303033'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#e9b3ff'
  on-secondary: '#510074'
  secondary-container: '#7d01b1'
  on-secondary-container: '#e5a9ff'
  tertiary: '#f8f4ff'
  on-tertiary: '#2f2e43'
  tertiary-container: '#d9d7f3'
  on-tertiary-container: '#5d5d74'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#f6d9ff'
  secondary-fixed-dim: '#e9b3ff'
  on-secondary-fixed: '#310048'
  on-secondary-fixed-variant: '#7200a3'
  tertiary-fixed: '#e2e0fc'
  tertiary-fixed-dim: '#c6c4df'
  on-tertiary-fixed: '#1a1a2e'
  on-tertiary-fixed-variant: '#45455b'
  background: '#131316'
  on-background: '#e4e1e6'
  surface-variant: '#353438'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style
The design system is engineered for a high-stakes AI debate environment where logic meets speed. The brand personality is **intellectual, analytical, and hyper-modern**, targeting users who value precision and technological sophistication. 

The visual style leverages **Glassmorphism** combined with a **Modern-Tech** aesthetic. This approach uses translucent layers and vibrant background blurs to create a sense of infinite digital depth. The interface must feel like a "Command Center for Intelligence," evoking an emotional response of focus and awe. High-contrast neon accents against a deep obsidian backdrop provide the necessary energy to signify active computation and divergent AI perspectives.

## Colors
The palette is rooted in a **Dark Mode** foundation to reduce eye strain during deep reading and emphasize the luminous UI elements.

- **Primary (Electric Blue):** Assigned to "Agent Alpha." Used for highlights, active state glows, and primary data streams.
- **Secondary (Vibrant Purple):** Assigned to "Agent Beta." Used for contrasting arguments, alternative viewpoints, and secondary logical threads.
- **Surface (Neutral):** A deep, desaturated obsidian (`#0F0F12`) serves as the base layer, while a slightly lighter navy (`#1A1A2E`) provides structural grounding for containers.
- **Functional Colors:** Success (Emerald), Error (Crimson), and Warning (Amber) are used sparingly with high saturation to pierce through the dark aesthetic.

## Typography
The typography strategy balances futuristic character with extreme legibility.

- **Headlines (Sora):** A geometric sans-serif with a technical flair. Used for titles and major section headers to establish the "high-tech" voice.
- **Body (Inter):** A highly functional typeface chosen for its clarity in long-form debate text. It ensures that complex arguments remain readable.
- **Labels & Mono (JetBrains Mono):** Used for metadata, AI confidence scores, timestamps, and configuration settings. The monospaced nature reinforces the "AI/Coding" persona of the platform.

## Layout & Spacing
The design system utilizes a **Fluid Grid** with a 12-column structure for desktop. 

- **Sidebar (Configuration):** Fixed 280px width on the left for debate parameters and AI personality selection.
- **Main Stage (Dialogue):** A centered fluid area that expands to show side-by-side agent comparisons. 
- **History/Data Rail:** A collapsible right-side panel (320px) for evidence logs and historical data.
- **Rhythm:** A 4px baseline grid ensures tight, mathematical alignment. Large 48px (XL) gaps are used to separate major logical blocks, while 16px (MD) is the standard for internal component padding.

## Elevation & Depth
Depth is communicated through **Glassmorphism** and light-refraction rather than traditional shadows.

1.  **Base Layer:** Solid obsidian background.
2.  **Mid Layer (Cards):** Semi-transparent surfaces (10-15% white opacity) with a `background-blur` of 20px. These panels feature a subtle 1px border with a 20% white opacity to define edges.
3.  **Active Layer (Interaction):** Elements currently in focus receive a "Neon Underglow." For Agent Alpha, this is a soft `0 0 15px` outer glow in Electric Blue. For Agent Beta, the same effect in Vibrant Purple.
4.  **Overlays (Modals):** Darker, more opaque glass (40% opacity) to provide clear focus, using heavy backdrop blurs (40px) to obscure the background stream.

## Shapes
The shape language is **Soft (0.25rem - 0.75rem)**. 

While the aesthetic is futuristic, sharp 0px corners feel too aggressive and "retro-brutalist." Minimal rounding (4px for inputs, 8px for cards) provides a sophisticated, precision-engineered feel. Rounding is never excessive (no pill shapes except for status indicators) to maintain a serious, structured tone.

## Components
- **Buttons:** Primary buttons are "ghost-style" with high-saturation neon borders and a subtle glow on hover. Text is uppercase `label-md` for a technical look.
- **Dialogue Cards:** Use the glassmorphism style. Agent Alpha's cards have a left-side 4px border accent in Electric Blue; Agent Beta's cards use a right-side 4px accent in Vibrant Purple.
- **Input Fields:** Minimalist. Bottom-border only by default, expanding to a full 1px glass frame when focused. Use `JetBrains Mono` for typed input.
- **Confidence Gauges:** Circular progress rings using the agent's specific neon color to visualize the strength of an argument.
- **Evidence Chips:** Small, monospaced tags that highlight sources. These use a darker background with a low-opacity color tint corresponding to the agent.
- **Scrollbars:** Custom thin-line scrollbars in 30% white to avoid breaking the glass aesthetic.