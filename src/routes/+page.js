// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;

export const load = async ({ fetch }) => {
	const response = await fetch('/api/prices.json');
	const response2 = await fetch('/api/energy.json');
	const response3 = await fetch('/api/intensity.json');
	const prices = await response.json();
	const energy = await response2.json();
	const intensity = await response3.json();
	return { prices, energy, intensity };
};
