# Zyren Cloud PACS — Landing Page Spec

> **Competition brief:** Frontend only, 1 hour, best design wins.

---

## 🎨 Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary Blue | `#0066FF` | CTAs, links, accents |
| Accent Teal | `#00D4AA` | Secondary buttons, highlights |
| Dark Navy | `#0A1628` | Hero bg, footer |
| Light Gray | `#F8FAFC` | Section backgrounds |
| Text Dark | `#1E293B` | Headings |
| Text Muted | `#64748B` | Body, captions |
| White | `#FFFFFF` | Cards, text on dark |

### Typography
- **Font:** Inter (or Satoshi for headings)
- **H1:** 56–64px, Bold
- **H2:** 36–42px, Semibold
- **H3:** 24px, Semibold
- **Body:** 16–18px, Regular
- **Small:** 14px, Regular

### Spacing
- Section padding: `py-24` (96px)
- Container max-width: `max-w-7xl` (1280px)
- Card padding: `p-8`

### Shadows & Radius
- Cards: `shadow-lg`, `rounded-2xl`
- Buttons: `rounded-full` or `rounded-lg`
- Subtle shadow: `shadow-sm`

---

## 📐 Page Structure

```
┌─────────────────────────────────────────┐
│  NAVBAR                                 │
├─────────────────────────────────────────┤
│  HERO (full viewport, dark)             │
├─────────────────────────────────────────┤
│  LOGO BAR (trusted by)                  │
├─────────────────────────────────────────┤
│  FEATURES GRID (6 cards)                │
├─────────────────────────────────────────┤
│  PRODUCT SHOWCASE (alternating)         │
├─────────────────────────────────────────┤
│  STATS BAR (accent bg)                  │
├─────────────────────────────────────────┤
│  TESTIMONIAL                            │
├─────────────────────────────────────────┤
│  PRICING (3 tiers)                      │
├─────────────────────────────────────────┤
│  CTA BANNER                             │
├─────────────────────────────────────────┤
│  FOOTER                                 │
└─────────────────────────────────────────┘
```

---

## 1. Navbar

**Layout:** Sticky, transparent on hero → solid on scroll

```
[Logo: Zyren]                    [Features] [Pricing] [Security] [Docs]    [Login] [Get Started →]
```

- Logo: Text "Zyren" or simple medical cross icon
- Links: `text-white/80 hover:text-white`
- CTA button: `bg-accent text-dark font-semibold px-6 py-2 rounded-full`

---

## 2. Hero Section

**Background:** Dark gradient  
`bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900`

**Layout:** Two columns on desktop, stacked on mobile

### Left Column (text)
```
Medical Imaging.
Anywhere. Instantly.

Cloud PACS built for modern radiology.
Zero hardware. Zero footprint. Total control.

[Start Free Trial]  [Watch Demo ▶]

✓ HIPAA Compliant  ✓ 99.99% Uptime  ✓ SOC 2 Type II
```

**Styles:**
- H1: `text-5xl md:text-7xl font-bold text-white leading-tight`
- Subtitle: `text-xl text-slate-300 mt-6 max-w-lg`
- Primary CTA: `bg-accent text-slate-900 font-semibold px-8 py-4 rounded-full`
- Secondary CTA: `border border-white/30 text-white px-8 py-4 rounded-full`
- Trust badges: `text-sm text-slate-400 flex gap-6 mt-8`

### Right Column (visual)
- Floating DICOM viewer mockup with subtle glow
- Or: Abstract gradient mesh / medical imagery
- Slight parallax or float animation

---

## 3. Logo Bar

**Background:** `bg-white` or `bg-slate-50`

```
Trusted by leading healthcare institutions

[Logo] [Logo] [Logo] [Logo] [Logo] [Logo]
```

- Logos: Grayscale, `opacity-60 hover:opacity-100`
- Use placeholder medical/hospital logos
- `flex justify-center items-center gap-12`

---

## 4. Features Grid

**Background:** `bg-slate-50`

**Layout:** 3 columns × 2 rows on desktop

| Icon | Title | Description |
|------|-------|-------------|
| ⚡ | **Instant Access** | Open studies in seconds. Zero-footprint viewer works on any device. |
| 🔒 | **Bank-Grade Security** | End-to-end encryption. HIPAA, GDPR, and SOC 2 compliant. |
| 🤖 | **AI-Powered Workflows** | Smart worklist prioritization. Integrated diagnostic insights. |
| 🌍 | **Access Anywhere** | View from clinic, home, or on the go. All you need is a browser. |
| 📊 | **Analytics Dashboard** | Track turnaround times, volume trends, and team productivity. |
| 🔗 | **Seamless Integration** | HL7 FHIR, DICOM, and EMR connectors out of the box. |

**Card styles:**
```css
bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition
```

**Icon:** `text-4xl mb-4` (use emoji or Lucide icons)  
**Title:** `text-xl font-semibold text-slate-900`  
**Desc:** `text-slate-600 mt-2`

---

## 5. Product Showcase

**Layout:** Alternating image/text sections

### Section A: Viewer
```
┌──────────────────┬──────────────────┐
│                  │                  │
│   [SCREENSHOT]   │  The Viewer      │
│   Viewer UI      │  Radiologists    │
│                  │  Love            │
│                  │                  │
│                  │  Familiar tools. │
│                  │  Modern UX.      │
│                  │                  │
│                  │  • Window/level  │
│                  │  • Measurements  │
│                  │  • Annotations   │
│                  │  • Multi-monitor │
│                  │                  │
└──────────────────┴──────────────────┘
```

### Section B: Reporting
```
┌──────────────────┬──────────────────┐
│                  │                  │
│  Reporting       │   [SCREENSHOT]   │
│  That Flows      │   Report Editor  │
│                  │                  │
│  Structured      │                  │
│  templates.      │                  │
│  One-click       │                  │
│  sign-off.       │                  │
│                  │                  │
│  • Templates     │                  │
│  • Auto-fill     │                  │
│  • PDF export    │                  │
│                  │                  │
└──────────────────┴──────────────────┘
```

**Screenshot treatment:**
- Rounded corners: `rounded-2xl`
- Shadow: `shadow-2xl`
- Optional: Slight rotation `rotate-1` or `-rotate-1`
- Border: `ring-1 ring-slate-200`

---

## 6. Stats Bar

**Background:** `bg-primary` (blue) or `bg-accent` (teal)

```
       2M+              150+              99.99%           <3s
   Studies Stored    Clinics Trust Us    Uptime      Avg Load Time
```

**Layout:** `grid grid-cols-2 md:grid-cols-4 gap-8 py-16`

**Styles:**
- Number: `text-5xl font-bold text-white`
- Label: `text-white/80 text-sm uppercase tracking-wide mt-2`

---

## 7. Testimonial

**Background:** `bg-white`

**Layout:** Centered, max-width constrained

```
"Zyren cut our reporting turnaround time by 40%. 
 The zero-footprint viewer is a game changer for our remote radiologists."

 Dr. Sarah Chen
 Chief of Radiology, Metro Health System

 ⭐⭐⭐⭐⭐
```

**Styles:**
- Quote: `text-2xl md:text-3xl text-slate-700 italic max-w-3xl mx-auto`
- Author: `font-semibold text-slate-900 mt-8`
- Title: `text-slate-500`
- Stars: `text-yellow-400 text-xl mt-4`

**Optional:** Add avatar image circle

---

## 8. Pricing

**Background:** `bg-slate-50`

**Layout:** 3 cards, center one highlighted

### Starter
```
STARTER
$99/month

Up to 500 studies/mo

✓ Single location
✓ Email support
✓ Basic viewer
✓ DICOM upload

[Start Free Trial]
```

### Pro (HIGHLIGHTED)
```
PRO ← MOST POPULAR
$299/month

Up to 5,000 studies/mo

✓ Multi-site
✓ Priority support
✓ AI features
✓ API access
✓ Custom templates

[Start Free Trial]
```

### Enterprise
```
ENTERPRISE
Custom pricing

Unlimited studies

✓ Dedicated CSM
✓ Custom SLAs
✓ SSO / SAML
✓ On-prem option
✓ BAA included

[Contact Sales]
```

**Card styles:**
- Default: `bg-white rounded-2xl p-8 shadow-sm`
- Highlighted: `bg-white rounded-2xl p-8 shadow-xl ring-2 ring-primary scale-105`
- Badge: `bg-primary text-white text-xs px-3 py-1 rounded-full`

**Button styles:**
- Primary: `bg-primary text-white w-full py-3 rounded-lg font-semibold`
- Secondary: `border border-slate-300 text-slate-700 w-full py-3 rounded-lg`

---

## 9. CTA Banner

**Background:** `bg-primary`

```
Ready to modernize your imaging workflow?

[Start Your Free 14-Day Trial — No Credit Card Required]
```

**Styles:**
- Heading: `text-3xl md:text-4xl font-bold text-white text-center`
- Button: `bg-white text-primary font-semibold px-8 py-4 rounded-full mt-8`

---

## 10. Footer

**Background:** `bg-slate-900`

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Logo]                Product    Company    Legal    Help  │
│                                                             │
│  Cloud PACS for        Features   About      Privacy  Docs  │
│  modern radiology.     Pricing    Careers    Terms    API   │
│                        Security   Blog       HIPAA    FAQ   │
│                        Viewer     Contact    BAA            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  © 2025 Zyren Health, Inc.        [Twitter] [LinkedIn] [GitHub] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Styles:**
- Logo/tagline: `text-white`
- Column headers: `text-white font-semibold mb-4`
- Links: `text-slate-400 hover:text-white`
- Bottom bar: `border-t border-slate-800 mt-12 pt-8`
- Social icons: `text-slate-400 hover:text-white text-xl`

---

## 🚀 Quick Implementation Tips

### Stack
- **Next.js 14** (App Router) or plain **Vite + React**
- **Tailwind CSS** for styling
- **Framer Motion** for scroll animations
- **Lucide React** for icons

### Speed Hacks
1. Use `shadcn/ui` Button, Card components
2. Copy Tailwind gradients from [hypercolor.dev](https://hypercolor.dev)
3. Placeholder images from [unsplash.com](https://unsplash.com) (search: "radiology", "medical")
4. Screenshot mockups: Use browser frame from [browserframe.com](https://browserframe.com)

### Animations (Framer Motion)
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  {/* content */}
</motion.div>
```

### Responsive Breakpoints
- Mobile first: Base styles
- `md:` (768px): Tablet
- `lg:` (1024px): Desktop

---

## 📸 Assets Needed

| Asset | Source | Notes |
|-------|--------|-------|
| Logo | Create simple text logo | "Zyren" in Inter Bold |
| Viewer screenshot | Your actual product | Crop nicely |
| Report screenshot | Your actual product | Show template |
| Hospital logos | Placeholder | Grayscale generic |
| Avatar | Generated or stock | For testimonial |
| Hero visual | Abstract/gradient | Or product mockup |

---

## ✅ Checklist

- [ ] Navbar (sticky, transparent→solid)
- [ ] Hero (gradient bg, CTA buttons)
- [ ] Logo bar
- [ ] Features grid (6 cards)
- [ ] Product showcase (2 sections)
- [ ] Stats bar
- [ ] Testimonial
- [ ] Pricing (3 tiers)
- [ ] CTA banner
- [ ] Footer
- [ ] Mobile responsive
- [ ] Scroll animations

---

**Good luck! Go win this. 🔥**
