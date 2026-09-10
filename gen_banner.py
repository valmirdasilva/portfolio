# Gera banner.svg — pixel/glitch, paleta do portfolio. SVG estatico (renderiza no GitHub).
W, H = 1200, 320
VOID="#0B0E0A"; TOX="#A6C22E"; CYAN="#4C9C93"; BLOOD="#D5451F"; BONE="#DAD7C6"
P = 12  # tamanho do "pixel" das letras

FONT = {
"V":["X...X","X...X","X...X","X...X",".X.X.",".X.X.","..X.."],
"A":[".XXX.","X...X","X...X","XXXXX","X...X","X...X","X...X"],
"L":["X....","X....","X....","X....","X....","X....","XXXXX"],
"M":["X...X","XX.XX","X.X.X","X.X.X","X...X","X...X","X...X"],
"I":["XXXXX","..X..","..X..","..X..","..X..","..X..","XXXXX"],
"R":["XXXX.","X...X","X...X","XXXX.","X.X..","X..X.","X...X"],
}
word = "VALMIR"
GAP = P*2               # espaco entre letras
lw = 5*P + GAP
total = len(word)*lw - GAP
x0 = (W - total)//2
y0 = 92

def letters(dx, dy, color, op=1.0):
    out=[]
    for li,ch in enumerate(word):
        gx = x0 + li*lw + dx
        for r,row in enumerate(FONT[ch]):
            for c,v in enumerate(row):
                if v=="X":
                    out.append(f'<rect x="{gx+c*P}" y="{y0+r*P+dy}" width="{P}" height="{P}" fill="{color}" opacity="{op}"/>')
    return "\n".join(out)

# skyline (fixo)
import math
sky=[]
xs=0; seed=[3,7,2,9,5,1,8,4,6,3,7,9,2,5,8,1,4,7,3,6,9,2,5,8,4,1,7,3,9,6,2,8,5,1,4]
i=0; x=-10
while x < W+20:
    bw = 22 + (seed[i%len(seed)]*7)
    bh = 40 + (seed[(i*3)%len(seed)]*16)
    sky.append(f'<rect x="{x}" y="{H-bh}" width="{bw}" height="{bh}" fill="#14201f"/>')
    # janelinhas neon
    for wy in range(H-bh+14, H-8, 26):
        if (i*wy) % 5 == 0:
            col = TOX if (i+wy)%2 else CYAN
            sky.append(f'<rect x="{x+8}" y="{wy}" width="6" height="10" fill="{col}" opacity="0.5"/>')
    x += bw + 10
    i += 1

# barras de glitch
glitch=[
 f'<rect x="0" y="{y0+P*2}" width="{W}" height="{P}" fill="{CYAN}" opacity="0.10"/>',
 f'<rect x="0" y="{y0+P*5}" width="{W}" height="{P//2}" fill="{BLOOD}" opacity="0.12"/>',
 f'<rect x="{x0-40}" y="{y0+P*4}" width="120" height="{P}" fill="{TOX}" opacity="0.18"/>',
 f'<rect x="{x0+total-90}" y="{y0-P}" width="140" height="{P//2}" fill="{BONE}" opacity="0.12"/>',
]

svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="VALMIR — desenvolvedor com IA no fluxo">
<defs>
<radialGradient id="glow" cx="50%" cy="38%" r="65%">
  <stop offset="0%" stop-color="#1a2416"/><stop offset="60%" stop-color="{VOID}"/><stop offset="100%" stop-color="{VOID}"/>
</radialGradient>
<pattern id="scan" width="3" height="3" patternUnits="userSpaceOnUse">
  <rect width="3" height="1" fill="#000" opacity="0.30"/>
</pattern>
</defs>
<rect width="{W}" height="{H}" fill="url(#glow)"/>
{chr(10).join(sky)}
<rect x="0" y="0" width="{W}" height="{H}" fill="#0e1a1a" opacity="0.18"/>
{chr(10).join(glitch)}
<!-- glitch chroma -->
{letters(-4, 2, CYAN, 0.55)}
{letters(4, -2, BLOOD, 0.5)}
{letters(0, 0, TOX, 1)}
<rect x="{x0}" y="{y0+P*3}" width="{total}" height="3" fill="{BONE}" opacity="0.35"/>
<text x="{W//2}" y="{y0+7*P+40}" text-anchor="middle" fill="{BONE}" opacity="0.85"
 font-family="'Courier New',ui-monospace,monospace" font-size="20" letter-spacing="3">DESENVOLVEDOR COM IA NO FLUXO</text>
<rect width="{W}" height="{H}" fill="url(#scan)"/>
<rect width="{W}" height="{H}" fill="none" stroke="{TOX}" stroke-width="2" opacity="0.5"/>
</svg>'''
open("banner.svg","w",encoding="utf-8").write(svg)
print("banner.svg", len(svg), "bytes")
