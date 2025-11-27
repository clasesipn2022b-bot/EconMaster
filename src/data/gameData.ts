export type TermType = 'good' | 'bad';

export interface GameTerm {
  id: string;
  text: string;
  type: TermType;
  x: number;
  y: number;
  speed: number;
}

// Nueva base de datos con tus conceptos y emojis integrados
export const TERMS_DB = {
  good: [
    "💰🤝 ¡RECIBIR LA TANDA!", "🎄🎁 ¡AGUINALDO!", "🗓️✨ ¡MESES SIN INTERESES!",
    "🚫💸 ¡SIN PAGO COMISIONES!", "💳🆓 ¡NO ANUALIDAD TDC!", "📝✅ ¡DEDUCCIÓN IMPUESTOS!",
    "⏱️👍 ¡PAGO ANTICIPADO!", "🔄 ¡CARGO AUTOMÁTICO!", "🌟 ¡PAGO CON PUNTOS!",
    "🎟️ ¡CUPONES!", "👴👵 ¡PENSIÓN DE VEJEZ!", "💵💨 ¡PAGO DE CONTADO!",
    "🏷️% ¡COMPRA CON DESCUENTO!", "⚖️ ¡VENTAS JUSTAS!", "💰🚀 ¡UTILIDADES!",
    "➕💵 ¡SUPERÁVIT!", "🚨💰 ¡FONDO DE EMERGENCIA!"
  ],
  bad: [
    "👮‍♂️ ¡MULTAS!", "📈😡 ¡RECARGOS!", "👺 ¡FRAUDE!", "🏳️ ¡BANCARROTA!",
    "📉😫 ¡DÉFICIT!", "💸🤏 ¡PAGO DE COMISIONES!", "❓📝 ¡MAL BURÓ DE CRÉDITO!",
    "🙈 ¡NO SEGUIR PRESUPUESTO!", "🤕 ¡PÉRDIDAS!", "💣💳 ¡SOBREENDEUDAMIENTO!",
    "🕳️ ¡AGUJERO FINANCIERO!", "⚠️ ¡RIESGO CREDITICIO!", "🚫💵 ¡IMPAGO!",
    "📵 ¡NO AHORRAR!", "💤 ¡OLVIDAR PAGAR!", "🎈 ¡INFLACIÓN!",
    "💀 ¡QUIEBRA!",   "⛈️ ¡DEVALUACIÓN!", "⬇️ ¡RECESIÓN!",
    "💸🔥 ¡DERROCHAR!",  "🎰 ¡ESPECULACIÓN DE PRECIOS!", "👨‍⚖️¡JUICIO FISCAL!"
  ]
};