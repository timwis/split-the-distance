import * as Sentry from '@sentry/browser'
import { BrowserTracing } from '@sentry/tracing'

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
const SENTRY_SAMPLE_RATE = import.meta.env.VITE_SENTRY_SAMPLE_RATE || 1.0

Sentry.init({
	dsn: SENTRY_DSN,
	integrations: [new BrowserTracing()],
	tracesSampleRate: SENTRY_SAMPLE_RATE
})

export default Sentry
