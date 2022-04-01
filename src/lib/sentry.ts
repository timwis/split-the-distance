import Sentry from '@sentry/node'
import '@sentry/tracing'

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
const SENTRY_SAMPLE_RATE = import.meta.env.VITE_SENTRY_SAMPLE_RATE || 1.0

Sentry.init({
	dsn: SENTRY_DSN,
	integrations: [new Sentry.Integrations.Http({ tracing: true })],
	tracesSampleRate: SENTRY_SAMPLE_RATE
})

export default Sentry
