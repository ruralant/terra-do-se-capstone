import { json } from '@sveltejs/kit';
const headers = new Headers();
const apiKey = import.meta.env.VITE_API_KEY;

export const GET = async () => {
	headers.append('Authorization', `Basic ${btoa(apiKey)}`);
	const response = await fetch(
		'https://octopus.energy/api/v1/tracker/E-1R-SILVER-FLEX-22-11-25-H/daily/past/30/0',
		{
			method: 'GET',
			headers: headers
		}
	);

	const prices = await response.json();

	// find the position of the object with the today date
	const today = new Date().toISOString().split('T')[0];
	const todayIndex = prices.periods.findIndex((period) => period.date === today);
	// remove future dates
	prices.periods = prices.periods.slice(0, todayIndex + 1);
	//keep only the last 30 days
	prices.periods = prices.periods.slice(-30);

	const data = prices.periods.map((period) => {
		return {
			date: new Date(period.date),
			unitRate: period.unit_rate
		};
	});

	return json(data);
};
