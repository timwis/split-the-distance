import Sentry from '$lib/sentry/server'

/** @type {import('@sveltejs/kit').HandleError} */
export async function handleError({ error }) {
	Sentry.captureException(error)
}
