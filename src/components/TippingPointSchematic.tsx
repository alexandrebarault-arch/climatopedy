import React from 'react';

interface TippingPointSchematicProps {
  elementId: string;
}

const palette = {
  ink: '#16324f',
  muted: '#52677d',
  line: '#cad6e2',
  land: '#d8c5a5',
  rock: '#8b8175',
  ocean: '#d8eef6',
  deepOcean: '#9bcbdc',
  ice: '#f7fbff',
  blue: '#2184b5',
  warm: '#e57845',
  green: '#32845c',
  paleGreen: '#e4f1e8',
  amber: '#bf791e',
  paleAmber: '#fff2d8',
  paleBlue: '#e9f4fa',
  paleRose: '#fbe9e5'
};

const SvgFrame: React.FC<React.PropsWithChildren<{ title: string; description: string }>> = ({
  title,
  description,
  children
}) => (
  <svg
    viewBox="0 0 400 240"
    preserveAspectRatio="xMidYMid meet"
    className="w-full h-full"
    role="img"
    aria-label={title}
  >
    <title>{title}</title>
    <desc>{description}</desc>
    <rect width="400" height="240" fill="#f7fafc" />
    {children}
  </svg>
);

const Label: React.FC<{ x: number; y: number; width: number; text: string; tone?: 'blue' | 'warm' | 'green' | 'ink' }> = ({
  x,
  y,
  width,
  text,
  tone = 'ink'
}) => {
  const color = tone === 'warm' ? '#a94f2c' : tone === 'green' ? '#286b4a' : tone === 'blue' ? '#17648b' : palette.ink;
  const fill = tone === 'warm' ? palette.paleRose : tone === 'green' ? palette.paleGreen : tone === 'blue' ? palette.paleBlue : '#ffffff';
  return (
    <g>
      <rect x={x} y={y} width={width} height="22" rx="6" fill={fill} stroke={palette.line} />
      <text x={x + 8} y={y + 14.5} fill={color} fontSize="10" fontFamily="sans-serif" fontWeight="600">{text}</text>
    </g>
  );
};

const Tree: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({
  x,
  y,
  scale = 1,
  color = palette.green
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M0 0 L0 -27 M-13 -9 L0 -34 L13 -9 Z M-10 -19 L0 -42 L10 -19 Z" fill={color} stroke="#286b4a" strokeWidth="1.4" strokeLinejoin="round" />
  </g>
);

const arrow = (x1: number, y1: number, x2: number, y2: number, color: string, width = 3) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const wing = 7;
  const ax = x2 - wing * Math.cos(angle - Math.PI / 6);
  const ay = y2 - wing * Math.sin(angle - Math.PI / 6);
  const bx = x2 - wing * Math.cos(angle + Math.PI / 6);
  const by = y2 - wing * Math.sin(angle + Math.PI / 6);
  return (
    <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${x1} ${y1} L${x2} ${y2}`} />
      <path d={`M${ax} ${ay} L${x2} ${y2} L${bx} ${by}`} />
    </g>
  );
};

const GreenlandSchematic = () => (
  <SvgFrame
    title="Comment la calotte du Groenland perd de la glace"
    description="Coupe de la calotte : l'eau de fonte s'écoule à la surface, descend par une crevasse puis rejoint l'océan avec le glacier côtier."
  >
    <rect x="0" y="174" width="400" height="66" fill={palette.ocean} />
    <path d="M0 184 Q70 174 125 185 Q170 192 215 180 L278 171 L330 184 L400 185 L400 240 L0 240Z" fill={palette.land} />
    <path d="M14 171 Q42 137 78 127 Q111 112 149 81 Q185 49 222 58 Q262 66 286 100 Q307 128 305 159 L333 174 L278 171 Q210 181 145 169 Q84 159 14 181Z" fill={palette.ice} stroke="#a9c8d9" strokeWidth="2" />
    <ellipse cx="179" cy="105" rx="24" ry="8" fill="#70bfdf" stroke={palette.blue} strokeWidth="1.5" />
    <path d="M179 113 L185 138 L199 155" fill="none" stroke={palette.blue} strokeWidth="3" strokeDasharray="4 3" />
    {arrow(201, 151, 248, 178, palette.blue, 2.5)}
    <path d="M307 159 Q329 159 347 170 L374 177 L400 180 L400 193 Q377 187 351 187 L326 180Z" fill="#eaf5fb" stroke="#a9c8d9" />
    <Label x={18} y={25} width={104} text="Glace continentale" tone="blue" />
    <Label x={135} y={25} width={112} text="Fonte de surface" tone="blue" />
    <Label x={250} y={204} width={137} text="Écoulement vers l'océan" tone="blue" />
    {arrow(191, 53, 191, 72, palette.warm, 2)}
  </SvgFrame>
);

const WaisSchematic = () => (
  <SvgFrame
    title="Pourquoi la glace de l'Antarctique de l'Ouest est vulnérable"
    description="La glace repose sur un socle rocheux situé sous le niveau marin. De l'eau océanique plus chaude circule sous la plateforme flottante et la ligne d'échouage peut reculer."
  >
    <rect x="0" y="119" width="400" height="121" fill={palette.ocean} />
    <path d="M0 176 Q110 180 195 198 Q278 222 400 219 L400 240 L0 240Z" fill={palette.rock} />
    <path d="M0 39 L164 39 Q187 46 196 80 L201 143 Q211 154 242 154 L242 116 L400 116 L400 148 Q321 141 244 151 Q215 153 198 145 L180 169 L0 169Z" fill={palette.ice} stroke="#a9c8d9" strokeWidth="2" />
    <path d="M245 180 Q315 184 380 179" fill="none" stroke={palette.warm} strokeWidth="4" strokeDasharray="7 5" />
    {arrow(374, 179, 302, 181, palette.warm, 3)}
    <circle cx="197" cy="168" r="5" fill={palette.amber} />
    <path d="M190 150 L190 186" stroke={palette.amber} strokeDasharray="3 3" strokeWidth="1.5" />
    <Label x={15} y={16} width={151} text="Glace posée sur le socle" tone="blue" />
    <Label x={252} y={120} width={133} text="Plateforme flottante" tone="blue" />
    <Label x={236} y={204} width={148} text="Eau océanique plus chaude" tone="warm" />
    <text x="203" y="150" fill={palette.amber} fontSize="9" fontFamily="sans-serif" fontWeight="bold">Ligne d'échouage</text>
  </SvgFrame>
);

const CoralSchematic = () => (
  <SvgFrame
    title="Le stress thermique peut faire blanchir les coraux"
    description="Comparaison d'un corail en équilibre avec un corail soumis à une eau trop chaude : il expulse une partie des algues qui vivent avec lui et peut blanchir."
  >
    <rect x="0" y="0" width="200" height="240" fill="#eaf6f7" />
    <rect x="200" y="0" width="200" height="240" fill="#fff2ed" />
    <path d="M200 18 L200 222" stroke={palette.line} strokeWidth="2" />
    <Label x={20} y={15} width={149} text="Eau à température habituelle" tone="green" />
    <Label x={220} y={15} width={157} text="Eau anormalement chaude" tone="warm" />
    <path d="M20 202 Q72 191 120 201 T200 197 L200 240 L20 240Z" fill="#c7e5e8" />
    <path d="M200 202 Q252 191 300 201 T400 197 L400 240 L200 240Z" fill="#f7ded5" />
    <path d="M66 198 L66 169 L50 153 M66 177 L83 157 M83 200 L83 178 L100 163 M112 200 L112 171 L128 154 M112 182 L98 170" fill="none" stroke="#d86c57" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="53" cy="146" r="3" fill="#e9b94f" /><circle cx="100" cy="155" r="3" fill="#e9b94f" /><circle cx="132" cy="145" r="3" fill="#e9b94f" />
    <path d="M266 198 L266 169 L250 153 M266 177 L283 157 M283 200 L283 178 L300 163 M312 200 L312 171 L328 154 M312 182 L298 170" fill="none" stroke="#d6dce1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M235 81 Q250 65 266 81 M272 78 Q287 62 303 78 M315 83 Q330 67 346 83" fill="none" stroke={palette.warm} strokeWidth="2.5" />
    {arrow(346, 117, 363, 146, palette.warm, 2)}
    <Label x={25} y={211} width={147} text="Corail et algues associées" tone="green" />
    <Label x={219} y={211} width={164} text="Blanchissement : algues expulsées" tone="warm" />
  </SvgFrame>
);

const AmazonSchematic = () => (
  <SvgFrame
    title="Comment la forêt amazonienne recycle l'humidité"
    description="Les arbres renvoient de l'eau dans l'atmosphère, qui peut retomber en pluie. La perte de forêt peut perturber ce recyclage régional de l'humidité."
  >
    <rect x="0" y="177" width="400" height="63" fill="#d9e9df" />
    <path d="M0 178 Q42 164 86 178 T172 177 L172 240 L0 240Z" fill="#7cae75" />
    <path d="M172 177 L400 170 L400 240 L172 240Z" fill="#d8c4a3" />
    {[24, 57, 91, 128, 157].map((x, index) => <Tree key={x} x={x} y={178} scale={0.8 + (index % 2) * 0.12} />)}
    <path d="M0 207 Q75 192 145 207 T265 206" fill="none" stroke={palette.blue} strokeWidth="5" />
    <path d="M49 88 Q57 77 69 84 Q79 69 93 82 Q108 80 109 93 L49 93Z" fill="#ffffff" stroke={palette.line} />
    <path d="M67 97 L62 111 M82 97 L78 111 M97 97 L94 111" stroke={palette.blue} strokeWidth="2" strokeDasharray="3 3" />
    {[48, 97, 143].map(x => <g key={x}>{arrow(x, 169, x - 5, 122, palette.green, 2)}</g>)}
    <Label x={13} y={15} width={164} text="Forêt : évaporation et pluie" tone="green" />
    <Label x={218} y={15} width={167} text="Défrichement : moins d'arbres" tone="warm" />
    <Label x={219} y={119} width={153} text="Humidité recyclée perturbée" tone="warm" />
  </SvgFrame>
);

const PermafrostSchematic = () => (
  <SvgFrame
    title="Le dégel du pergélisol transforme le sol et libère du carbone"
    description="Quand le sol gelé se réchauffe, la couche qui dégèle chaque été peut s'épaissir. La glace souterraine fond, le terrain peut s'affaisser et la matière organique se décompose en libérant des gaz à effet de serre."
  >
    <rect x="0" y="63" width="400" height="177" fill="#cdbb9c" />
    <rect x="0" y="91" width="400" height="149" fill="#d9eaf0" />
    <path d="M0 52 Q78 44 153 53 T300 48 L400 55 L400 78 Q322 73 250 79 T95 77 L0 82Z" fill="#77a66e" />
    <path d="M0 78 Q96 73 168 81 T296 77 L400 82 L400 113 Q301 105 228 112 T88 108 L0 112Z" fill="#e7bb81" />
    <path d="M0 118 Q75 113 148 120 T295 115 L400 121 L400 240 L0 240Z" fill="#91bbcf" />
    <path d="M117 115 L132 115 L125 185Z M261 116 L278 116 L269 192Z" fill="#eaf9ff" stroke="#8ab8cb" strokeWidth="2" />
    <path d="M166 64 Q170 92 181 111" fill="none" stroke={palette.warm} strokeWidth="3" strokeDasharray="5 4" />
    {arrow(181, 108, 181, 133, palette.warm, 2)}
    <path d="M231 149 Q223 125 230 102 M246 155 Q256 131 253 111" fill="none" stroke="#9a6b2f" strokeWidth="2" strokeDasharray="3 3" />
    {arrow(230, 108, 230, 88, palette.warm, 2)}
    {arrow(253, 112, 253, 91, palette.warm, 2)}
    <path d="M288 77 Q313 88 338 78 L338 89 Q314 98 288 87Z" fill="#9bcbdc" />
    <Label x={12} y={13} width={147} text="Végétation de surface" tone="green" />
    <Label x={191} y={13} width={180} text="Couche active : dégel saisonnier" tone="warm" />
    <Label x={16} y={128} width={157} text="Sol gelé en profondeur" tone="blue" />
    <Label x={221} y={181} width={166} text="Décomposition et émissions" tone="warm" />
  </SvgFrame>
);

const BarentsSchematic = () => (
  <SvgFrame
    title="La perte de banquise modifie la chaleur absorbée par l'océan"
    description="La glace claire renvoie une partie de la lumière solaire; l'eau sombre libre en absorbe davantage. Des eaux atlantiques plus chaudes peuvent aussi pénétrer dans la mer de Barents."
  >
    <rect x="0" y="103" width="400" height="137" fill={palette.ocean} />
    <path d="M0 124 Q45 119 90 124 T180 124 L180 149 L0 149Z" fill={palette.ice} stroke="#a9c8d9" strokeWidth="2" />
    <path d="M0 150 Q75 146 180 151 L180 240 L0 240Z" fill="#b9dce7" />
    <path d="M180 120 Q235 112 290 121 T400 120 L400 240 L180 240Z" fill="#76b4cb" />
    <path d="M190 150 Q244 145 300 151 T400 150" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
    <path d="M205 175 Q260 167 315 175 T400 174" fill="none" stroke="#8bd0e1" strokeWidth="2" />
    <path d="M285 226 Q268 199 244 184" fill="none" stroke={palette.warm} strokeWidth="5" strokeDasharray="7 5" />
    {arrow(286, 226, 244, 184, palette.warm, 3)}
    <path d="M81 88 L72 56 M100 89 L100 50 M119 88 L129 56" stroke={palette.amber} strokeWidth="2" />
    {arrow(72, 60, 64, 39, palette.amber, 1.7)}
    <path d="M236 71 L244 95 M268 70 L276 95" stroke={palette.amber} strokeWidth="2" />
    {arrow(244, 91, 249, 105, palette.amber, 1.7)}
    <Label x={12} y={14} width={145} text="Banquise : lumière renvoyée" tone="blue" />
    <Label x={213} y={14} width={172} text="Eau libre : plus de chaleur absorbée" tone="warm" />
    <Label x={191} y={187} width={192} text="Arrivée d'eau atlantique plus chaude" tone="warm" />
  </SvgFrame>
);

const AmocSchematic = () => (
  <SvgFrame
    title="La circulation océanique relie les eaux de surface et de profondeur"
    description="Dans l'Atlantique, des eaux chaudes circulent vers le nord en surface. Dans les régions nordiques, une partie devient plus dense et plonge; des eaux plus froides repartent en profondeur vers le sud."
  >
    <rect x="0" y="66" width="400" height="174" fill="#cce8f1" />
    <path d="M0 66 L0 143 Q105 130 195 143 T400 136 L400 66Z" fill="#e8f5f8" />
    <path d="M337 38 Q352 55 368 38 L380 66 L327 66Z" fill="#cbd5e1" />
    <path d="M0 145 Q77 132 158 143 T320 139" fill="none" stroke={palette.warm} strokeWidth="8" strokeLinecap="round" />
    {arrow(248, 140, 322, 139, palette.warm, 3)}
    <path d="M322 142 Q347 161 335 190 L313 214 Q223 224 133 210 L31 213" fill="none" stroke={palette.blue} strokeWidth="7" strokeLinecap="round" />
    {arrow(122, 211, 42, 213, palette.blue, 3)}
    {arrow(336, 153, 335, 188, palette.blue, 3)}
    <Label x={15} y={15} width={164} text="Atlantique tropical" tone="warm" />
    <Label x={238} y={15} width={148} text="Nord : l'eau plonge" tone="blue" />
    <Label x={97} y={176} width={187} text="Retour en profondeur vers le sud" tone="blue" />
    <text x="62" y="125" fill="#a94f2c" fontSize="10" fontFamily="sans-serif" fontWeight="600">Eau chaude en surface vers le nord</text>
  </SvgFrame>
);

const BorealForestSchematic = () => (
  <SvgFrame
    title="Sécheresses et incendies peuvent fragiliser les forêts boréales"
    description="Une forêt boréale soumise à la chaleur et au manque d'eau devient plus vulnérable aux incendies et au dépérissement. Les effets durables dépendent aussi de la repousse."
  >
    <rect x="0" y="0" width="400" height="240" fill="#f3f7f3" />
    <rect x="0" y="181" width="400" height="59" fill="#d6c4a5" />
    <path d="M0 180 Q55 168 111 181 T220 179 L220 240 L0 240Z" fill="#a5c493" />
    <path d="M220 181 Q302 169 400 181 L400 240 L220 240Z" fill="#c9b99c" />
    <Tree x={35} y={181} scale={1.25} /><Tree x={81} y={181} scale={1.5} /><Tree x={132} y={181} scale={1.3} /><Tree x={182} y={181} scale={1.1} />
    <path d="M253 180 L253 137 M246 159 L238 149 M253 168 L263 154 M310 181 L310 147 M305 163 L296 154 M310 170 L321 158" stroke="#77736c" strokeWidth="5" strokeLinecap="round" />
    <path d="M286 172 Q275 152 286 137 Q299 151 292 171Z" fill="#e77845" />
    <path d="M354 179 L354 155 M346 165 L354 145 L362 165Z" stroke={palette.green} strokeWidth="3" fill="#94bd82" />
    <circle cx="344" cy="45" r="17" fill="#f6d789" />
    <path d="M332 70 Q344 76 356 70" fill="none" stroke={palette.amber} strokeWidth="2" strokeDasharray="4 3" />
    <Label x={12} y={13} width={138} text="Forêt en bon état" tone="green" />
    <Label x={174} y={13} width={204} text="Sécheresse et incendie" tone="warm" />
    <Label x={235} y={201} width={151} text="Repousse : variable" tone="green" />
    <text x="236" y="115" fill="#a94f2c" fontSize="9.5" fontFamily="sans-serif" fontWeight="600">Arbres morts ou brûlés</text>
  </SvgFrame>
);

const WilkesSchematic = () => (
  <SvgFrame
    title="Le bassin de Wilkes retient une glace reposant sous le niveau marin"
    description="Le socle rocheux du bassin de Wilkes se trouve sous le niveau de la mer. L'eau océanique peut atteindre le dessous de la glace flottante; si la ligne d'échouage recule, davantage de glace peut être exposée au retrait."
  >
    <rect x="0" y="102" width="400" height="138" fill={palette.ocean} />
    <path d="M0 188 Q72 174 146 188 Q211 207 260 216 Q327 199 400 211 L400 240 L0 240Z" fill={palette.rock} />
    <path d="M0 50 L131 50 Q171 56 198 91 L233 128 Q248 143 268 151 L268 102 L400 102 L400 126 Q339 122 268 127 Q244 127 220 143 L184 91 Q164 69 144 68 L0 68Z" fill={palette.ice} stroke="#a9c8d9" strokeWidth="2" />
    <path d="M399 183 Q355 177 313 172 Q292 169 277 163" fill="none" stroke={palette.warm} strokeWidth="5" strokeDasharray="7 5" />
    {arrow(376, 180, 296, 169, palette.warm, 3)}
    <circle cx="274" cy="162" r="5" fill={palette.amber} />
    {arrow(265, 159, 224, 137, palette.amber, 2.5)}
    <Label x={12} y={14} width={177} text="Glace de l'Antarctique de l'Est" tone="blue" />
    <Label x={221} y={101} width={158} text="Plateforme flottante" tone="blue" />
    <Label x={13} y={204} width={161} text="Bassin rocheux sous le niveau marin" tone="ink" />
    <Label x={220} y={205} width={169} text="Eau plus chaude sous la glace" tone="warm" />
    <text x="181" y="184" fill="#9a5f17" fontSize="9" fontFamily="sans-serif" fontWeight="600">Ligne d'échouage</text>
  </SvgFrame>
);

export const TippingPointSchematic: React.FC<TippingPointSchematicProps> = ({ elementId }) => {
  switch (elementId) {
    case 'greenland':
      return <GreenlandSchematic />;
    case 'wais':
      return <WaisSchematic />;
    case 'corals':
      return <CoralSchematic />;
    case 'amazon':
      return <AmazonSchematic />;
    case 'permafrost':
      return <PermafrostSchematic />;
    case 'barents_ice':
    case 'barents':
    case 'arctic_summer_ice':
      return <BarentsSchematic />;
    case 'amoc':
      return <AmocSchematic />;
    case 'boreal_forest':
    case 'boreal':
      return <BorealForestSchematic />;
    case 'wilkes_basin':
      return <WilkesSchematic />;
    default:
      return <GreenlandSchematic />;
  }
};
