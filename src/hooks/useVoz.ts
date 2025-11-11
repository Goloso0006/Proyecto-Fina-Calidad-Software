export interface VozOptions {
	lang?: string;
	rate?: number;
	pitch?: number;
	volume?: number;
}

export function useVoz(defaultEnabled: boolean = false, options: VozOptions = {}) {
	let enabled = defaultEnabled;
	let lastSpokenText = '';
	let lastSpokenTime = 0;
	const DEBOUNCE_MS = 300; // Evitar repetir el mismo texto en 300ms
	
	const synth: SpeechSynthesis | null = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;

	const base: Required<VozOptions> = {
		lang: options.lang || "es-ES",
		rate: options.rate ?? 1,
		pitch: options.pitch ?? 1,
		volume: options.volume ?? 1,
	};

	const speak = (texto: string) => {
		if (!enabled || !synth || !texto) return;
		
		// Evitar repetir el mismo texto muy rápido (debounce)
		const now = Date.now();
		if (texto === lastSpokenText && (now - lastSpokenTime) < DEBOUNCE_MS) {
			return; // Ignorar si es el mismo texto en menos de 300ms
		}
		
		lastSpokenText = texto;
		lastSpokenTime = now;
		
		try {
			// Cancelar solo si hay algo hablando actualmente
			if (synth.speaking || synth.pending) {
				synth.cancel();
			}
			
			// Usar requestAnimationFrame para asegurar que el navegador esté listo
			requestAnimationFrame(() => {
				if (!enabled || !synth) return;
				try {
					const u = new SpeechSynthesisUtterance(texto);
					u.lang = base.lang;
					u.rate = base.rate;
					u.pitch = base.pitch;
					u.volume = base.volume;
					synth.speak(u);
				} catch {
					/* ignore */
				}
			});
		} catch {
			/* ignore */
		}
	};

	const stop = () => {
		if (synth) {
			try {
				synth.cancel();
				// Limpiar el historial de texto hablado al detener
				lastSpokenText = '';
				lastSpokenTime = 0;
			} catch {
				/* ignore */
			}
		}
	};

	const setEnabled = (v: boolean) => {
		enabled = v;
		if (!v) stop();
	};

	return { speak, stop, setEnabled, get enabled() { return enabled; } };
}
