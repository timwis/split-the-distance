/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_TRAVEL_TIME_APP_ID: string
	readonly VITE_TRAVEL_TIME_API_KEY: string
	readonly VITE_TRAVEL_TIME_BASE_URL: string
	readonly VITE_MAPBOX_API_KEY: string
	readonly VITE_SENTRY_DSN: string
	readonly VITE_SENTRY_SAMPLE_RATE: number
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
