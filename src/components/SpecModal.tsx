import React, { useState } from 'react';
import { Copy, Check, Download, BookOpen, Code2, Database } from 'lucide-react';

export const SpecModal: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSpecSection, setActiveSpecSection] = useState<'equations' | 'algo' | 'params' | 'sources'>('equations');

  const copyFullSpecToClipboard = () => {
    const specText = `# SPÉCIFICATION TECHNIQUE DU MODÈLE SCIENTIFIQUE (CLIMATOPEDY)

## 1. Modèle Climatique Réduit FaIR v1.1
- Équation différentielle des 4 réservoirs : dR_i/dt = a_i * E_CO2(t) - R_i / (alpha(t) * tau_i)
- Saturation non-linéaire : alpha(t) = exp((0.00032 * C_acc + 0.019 * T1) / 0.20)
- CO2 atmosphérique : C_CO2(t) = 278 + sum(R_i) / 2.123
- Forçage radiatif : Delta_F(t) = 5.35 * ln(C_CO2 / 278) + Delta_F_aux
- Modèle 2 couches : 
  C_th1 * dT1/dt = Delta_F - lambda * T1 - gamma * (T1 - T2)
  C_th2 * dT2/dt = gamma * (T1 - T2)

## 2. Élévation du Niveau Marin (Vermeer & Rahmstorf 2009)
- dH_sl/dt = a * (T1 - T0_sl) + b * dT1/dt
- a = 3.4 mm/an/°C, b = 18.0 mm/°C, T0_sl = -0.5°C

## 3. Thermomètre Mouillé de Roland Stull (2011)
- Tw = Ta * atan(0.151977 * sqrt(RH + 8.313659)) + atan(Ta + RH) - atan(RH - 1.676331) + 0.00391838 * (RH^1.5) * atan(0.023101 * RH) - 4.686035
- Seuil physiologique létal : Tw > 31.0°C en 6h

## 4. Métabolisme Industriel & Falaise de l'EROI
- EROI(t) = EROI_0 * (1 - Q(t) / Q_inf)^1.35
- E_net(t) = E_gross(t) * (1 - 1 / EROI(t))
- Cannibalisme énergétique sous EROI < 10:1

## 5. Rendements Céréaliers (Zhao et al. 2017)
- Dégradation thermique composite : Maïs (-7.4%/°C), Blé (-6.0%/°C), Riz (-3.2%/°C), Soja (-3.1%/°C)
- Couplage aux intrants Haber-Bosch : Psi_inputs = (E_net / E_net0)^0.65 * (x_fert / x_fert0)^0.35`;

    navigator.clipboard.writeText(specText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-xl bg-[#090d15] border border-slate-800 p-6 shadow-2xl flex flex-col gap-5">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 uppercase">
              Spécifications Mathématiques &amp; Algorithmes
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">
              Formulations analytiques exactes pour intégration numérique
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Cahier des Charges Biophysique &amp; Références Scientifiques
          </h2>
        </div>

        {/* Bouton de copie / export */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyFullSpecToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Spécification Copiée !' : 'Copier les Formules'}</span>
          </button>
        </div>
      </div>

      {/* Onglets de sections */}
      <div className="flex items-center gap-2 border-b border-slate-800 text-xs pb-2">
        <button
          onClick={() => setActiveSpecSection('equations')}
          className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
            activeSpecSection === 'equations'
              ? 'text-cyan-400 border-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Équations Différentielles (ODEs)</span>
        </button>

        <button
          onClick={() => setActiveSpecSection('algo')}
          className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
            activeSpecSection === 'algo'
              ? 'text-amber-400 border-amber-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Algorithme d'Intégration Temporelle</span>
        </button>

        <button
          onClick={() => setActiveSpecSection('params')}
          className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
            activeSpecSection === 'params'
              ? 'text-purple-400 border-purple-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Constantes de Calibrage &amp; Données</span>
        </button>
      </div>

      {/* CONTENU DE LA SECTION */}
      <div className="bg-[#0b101b] rounded-xl border border-slate-800 p-5 font-mono text-xs text-slate-300 space-y-4 overflow-x-auto">
        {activeSpecSection === 'equations' && (
          <div className="space-y-4">
            <div className="bg-[#101726] p-4 rounded-lg border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-2 font-sans">
                1. Cycle du Carbone FaIR v1.1 (4 Réservoirs Atmosphériques) :
              </span>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto">
{`dR_i / dt = a_i * E_CO2(t) - R_i / (alpha(t) * tau_i)     pour i ∈ {0, 1, 2, 3}

a = [0.2173, 0.2240, 0.2838, 0.2749]
tau = [1.0e6, 394.4, 36.54, 4.304] années

alpha(t) = exp( (r_0 + r_C * C_acc(t) + r_T * T_1(t)) / r_T0 )
C_CO2(t) = 278.0 + (sum(R_i) / 2.123)  [ppm]
Delta_F(t) = 5.35 * ln(C_CO2 / 278.0) + Delta_F_aux`}
              </pre>
            </div>

            <div className="bg-[#101726] p-4 rounded-lg border border-slate-800">
              <span className="text-amber-400 font-bold block mb-2 font-sans">
                2. Modèle Océanique Deux Couches &amp; Niveau Marin (Vermeer-Rahmstorf) :
              </span>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto">
{`C_th,1 * (dT_1 / dt) = Delta_F(t) - lambda * T_1(t) - gamma * (T_1(t) - T_2(t))
C_th,2 * (dT_2 / dt) = gamma * (T_1(t) - T_2(t))

Élévation marine semi-empirique :
dH_sl / dt = a * (T_1(t) - T_0,sl) + b * (dT_1 / dt)
a = 0.0034 m/an/°C,  b = 0.0180 m/°C,  T_0,sl = -0.5°C`}
              </pre>
            </div>

            <div className="bg-[#101726] p-4 rounded-lg border border-slate-800">
              <span className="text-rose-400 font-bold block mb-2 font-sans">
                3. Thermomètre Mouillé de Roland Stull (2011) &amp; Survie Humaine :
              </span>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto">
{`Tw = Ta * atan(0.151977 * sqrt(RH + 8.313659))
   + atan(Ta + RH)
   - atan(RH - 1.676331)
   + 0.00391838 * (RH^1.5) * atan(0.023101 * RH)
   - 4.686035

* Note : Tous les arguments trigonométriques atan sont strictement évalués en radians.
* Seuil critique d'hyperthermie létale : Tw > 31.0°C
Surmortalité thermique : mu_thermal = 0.40 / (1 + exp(-1.8 * (Tw_peak - 31.0)))`}
              </pre>
            </div>

            <div className="bg-[#101726] p-4 rounded-lg border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-2 font-sans">
                4. Rendements Céréaliers (Zhao et al. 2017) &amp; EROI :
              </span>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto">
{`Y_c,k(t) = Y_0,c,k * (1 - beta_c * Delta_T_k) * Psi_inputs(t)

beta_maize = 7.4%/°C,  beta_wheat = 6.0%/°C,  beta_rice = 3.2%/°C,  beta_soy = 3.1%/°C
Psi_inputs(t) = (E_net(t) / E_net(0))^0.65 * (x_fert(t) / x_fert(0))^0.35

Falaise d'énergie nette :
EROI(t) = EROI_0 * (1 - Q(t) / Q_inf)^1.35
E_net(t) = E_gross(t) * (1 - 1 / EROI(t))`}
              </pre>
            </div>
          </div>
        )}

        {activeSpecSection === 'algo' && (
          <div className="space-y-3">
            <span className="text-amber-400 font-sans font-bold block">
              Boucle d'Intégration d'un Pas Temporel (Discrétisation Euler / RK4) :
            </span>
            <pre className="text-slate-300 bg-[#101726] p-4 rounded-lg border border-slate-800 leading-relaxed overflow-x-auto">
{`def step_simulation(state, dt):
    # Phase 1 : Extraction pétrolière et EROI
    eroi = max(1.1, eroi_0 * ((1.0 - state.Q / Q_inf) ** 1.35))
    net_fraction = 1.0 - (1.0 / eroi)
    extraction = active_pop * 4.2 * sqrt(net_fraction)
    state.Q += extraction * dt
    
    # Phase 2 : FaIR carbone et forçage radiatif
    emissions = extraction * 1.15e-10 + 4.5 * net_fraction
    c_acc = state.cumul_emissions - sum(state.carbon_pools)
    alpha = exp((0.00032 * c_acc + 0.019 * state.T1) / 0.20)
    for i in range(4):
        state.carbon_pools[i] += (a[i]*emissions - state.carbon_pools[i]/(alpha*tau[i])) * dt
    co2 = 278.0 + sum(state.carbon_pools) / 2.123
    forcing = 5.35 * log(co2 / 278.0) + 0.85
    
    # Phase 3 : Deux couches océaniques
    dt1 = (forcing - 1.13*state.T1 - 0.73*(state.T1 - state.T2)) / 8.2
    dt2 = (0.73*(state.T1 - state.T2)) / 105.0
    state.T1 += dt1 * dt
    state.T2 += dt2 * dt
    state.sea_level += (0.0034*(state.T1 + 0.5) + 0.0180*dt1) * dt
    
    # Phase 4 : Par pays (Tw Stull, Rendements Zhao, Surmortalités)
    for country in state.countries:
        ta = country.base_ta + state.T1 * country.pattern_scaling
        tw = stull_wet_bulb(ta, country.humidity)
        yield_loss = compute_zhao_loss(country.crop_mix, ta - country.base_ta)
        cal = country.base_cal * (1 - yield_loss) * (net_fraction ** 0.65)
        
        mu_thermal = 0.40 / (1 + exp(-1.8*(tw_peak - 31.0)))
        mu_famine = 0.50 * max(0, 1 - cal / 2100)**2
        # Transition des cohortes (0-14, 15-64, 65+)
        update_cohorts(country, mu_thermal + mu_famine)`}
            </pre>
          </div>
        )}

        {activeSpecSection === 'params' && (
          <div className="space-y-3">
            <span className="text-purple-400 font-sans font-bold block">
              Tableau des Constantes Biophysiques Calibrées (Horizon 2026) :
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-800 font-sans">
                <thead className="bg-[#141b2a] text-slate-300 border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="p-2">Paramètre</th>
                    <th className="p-2">Symbole</th>
                    <th className="p-2">Valeur 2026</th>
                    <th className="p-2">Unité</th>
                    <th className="p-2">Source / Référence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-[11px] font-mono text-slate-300">
                  <tr>
                    <td className="p-2 font-sans font-medium text-white">CO2 initial atmosphérique</td>
                    <td className="p-2 text-cyan-400">C_CO2(0)</td>
                    <td className="p-2">424.5</td>
                    <td className="p-2">ppm</td>
                    <td className="p-2 font-sans text-slate-400">Observatoire Mauna Loa</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium text-white">Sensibilité climatique (ECS)</td>
                    <td className="p-2 text-cyan-400">ECS</td>
                    <td className="p-2">3.0</td>
                    <td className="p-2">°C / 2xCO2</td>
                    <td className="p-2 font-sans text-slate-400">GIEC AR6 (SSP5-8.5)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium text-white">Réserves ultimes récupérables</td>
                    <td className="p-2 text-amber-400">Q_inf</td>
                    <td className="p-2">2.8 × 10¹²</td>
                    <td className="p-2">barils équiv.</td>
                    <td className="p-2 font-sans text-slate-400">Synthèse AIE &amp; USGS</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium text-white">Extraction cumulée passée</td>
                    <td className="p-2 text-amber-400">Q(0)</td>
                    <td className="p-2">1.45 × 10¹²</td>
                    <td className="p-2">barils</td>
                    <td className="p-2 font-sans text-slate-400">Bilan 1859–2026</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium text-white">EROI initial du pétrole</td>
                    <td className="p-2 text-amber-400">EROI_0</td>
                    <td className="p-2">32.0</td>
                    <td className="p-2">ratio sans unité</td>
                    <td className="p-2 font-sans text-slate-400">Cleveland, Hall et al.</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium text-white">Seuil critique thermomètre mouillé</td>
                    <td className="p-2 text-rose-400">Tw_crit</td>
                    <td className="p-2">31.0</td>
                    <td className="p-2">°C</td>
                    <td className="p-2 font-sans text-slate-400">Sherwood &amp; Huber (2010), Stull (2011)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium text-white">Besoin calorique vital par personne</td>
                    <td className="p-2 text-emerald-400">Cal_req</td>
                    <td className="p-2">2 100</td>
                    <td className="p-2">kcal / j / pers</td>
                    <td className="p-2 font-sans text-slate-400">Seuil standard FAO / OMS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
