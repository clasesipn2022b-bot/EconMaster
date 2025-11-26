export type TermType = 'good' | 'bad';

export interface GameTerm {
  id: string;
  text: string;
  type: TermType;
  x: number;
  y: number;
  speed: number;
}

export const TERMS_DB = {
  good: ['Ahorro', 'Inversión', 'Dividendo', 'Activo', 'Superávit', 'Interés Compuesto', 'Ganancia', 'Rentabilidad'],
  bad: ['Deuda', 'Inflación', 'Bancarrota', 'Pasivo', 'Déficit', 'Impago', 'Fraude', 'Embargo']
};
