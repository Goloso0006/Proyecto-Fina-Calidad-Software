import { useRef, useCallback } from "react";

export interface VozOptions {
	lang?: string;
	rate?: number;
	pitch?: number;
	volume?: number;
}

export function useVoz(
	defaultEnabled: boolean = false,
	options: VozOptions = {}
) {
	const enabledRef = useRef(defaultEnabled);
	const lastSpokenTextRef = useRef("");
	const lastSpokenTimeRef = useRef(0);
	const DEBOUNCE_MS = 300; // Evitar repetir el mismo texto en 300ms

	const synth: SpeechSynthesis | null =
		typeof window !== "undefined" && "speechSynthesis" in window
			? window.speechSynthesis
			: null;

	const base: Required<VozOptions> = {
		lang: options.lang || "es-ES",
		rate: options.rate ?? 1,
		pitch: options.pitch ?? 1,
		volume: options.volume ?? 1,
	};

	const speak = useCallback(
		(texto: string) => {
			if (!enabledRef.current || !synth || !texto) return;

			// Evitar repetir el mismo texto muy rápido (debounce)
			const now = Date.now();
			if (
				texto === lastSpokenTextRef.current &&
				now - lastSpokenTimeRef.current < DEBOUNCE_MS
			) {
				return; // Ignorar si es el mismo texto en menos de 300ms
			}

			lastSpokenTextRef.current = texto;
			lastSpokenTimeRef.current = now;

			try {
				// Cancelar solo si hay algo hablando actualmente
				if (synth.speaking || synth.pending) {
					synth.cancel();
				}

				// Usar requestAnimationFrame para asegurar que el navegador esté listo
				requestAnimationFrame(() => {
					if (!enabledRef.current || !synth) return;
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
		},
		[synth, base.lang, base.rate, base.pitch, base.volume]
	);

	const stop = useCallback(() => {
		if (synth) {
			try {
				synth.cancel();
				// Limpiar el historial de texto hablado al detener
				lastSpokenTextRef.current = "";
				lastSpokenTimeRef.current = 0;
			} catch {
				/* ignore */
			}
		}
	}, [synth]);

	const setEnabled = useCallback(
		(v: boolean) => {
			enabledRef.current = v;
			if (!v && synth) {
				try {
					synth.cancel();
				} catch {
					/* ignore */
				}
			}
		},
		[synth]
	);

	return {
		speak,
		stop,
		setEnabled,
	};
}
