export interface VozOptions {
	lang?: string;
	rate?: number;
	pitch?: number;
	volume?: number;
}

export function useVoz(defaultEnabled: boolean = false, options: VozOptions = {}) {
	let enabled = defaultEnabled;
	const synth: SpeechSynthesis | null = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;

	const base: Required<VozOptions> = {
		lang: options.lang || "es-ES",
		rate: options.rate ?? 1,
		pitch: options.pitch ?? 1,
		volume: options.volume ?? 1,
	};

	const speak = (texto: string) => {
		if (!enabled || !synth) return;
		try {
			synth.cancel();
			const u = new SpeechSynthesisUtterance(texto);
			u.lang = base.lang;
			u.rate = base.rate;
			u.pitch = base.pitch;
			u.volume = base.volume;
        synth.speak(u);
    } catch {
        /* ignore */
    }
	};

	const stop = () => {
		if (synth) synth.cancel();
	};

	const setEnabled = (v: boolean) => {
		enabled = v;
		if (!v) stop();
	};

	return { speak, stop, setEnabled, get enabled() { return enabled; } };
}
