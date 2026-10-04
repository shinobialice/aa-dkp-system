export type SynthesisPool = Record<number, number>;

export type SynthesisLevel = [percent: number, slots: SynthesisPool[]];

export type ItemSynthesis = Record<number, SynthesisLevel[]>;
