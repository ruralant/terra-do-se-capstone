import { json } from '@sveltejs/kit';

export const GET = async () => {
	const headers = new Headers();
	const today = new Date();
	const apiKey = import.meta.env.VITE_API_KEY;
	const meters = import.meta.env.VITE_METERS;
	const meterPoints = import.meta.env.VITE_METER_POINTS;
	const yesterday = new Date(today.setHours(23, 59, 59, 59)).setDate(new Date(today).getDate() - 1);
	const formattedYesterday = new Date(yesterday).toISOString().slice(0, 22) + 'Z';
	// new date 30 days from today date
	const fromDate = new Date(today.setHours(0, 0, 0, 0)).setDate(new Date(today).getDate() - 30);
	const formattedFromDate = new Date(fromDate).toISOString().slice(0, 22) + 'Z';
	const encodedApiKey = Buffer.from(apiKey, 'utf8').toString('base64');
	headers.append('Authorization', 'Basic ' + encodedApiKey);

	const response = await fetch(
		`https://api.octopus.energy/v1/electricity-meter-points/${meterPoints}/meters/${meters}/consumption/?group_by=day&period_from=${formattedFromDate}&period_to=${formattedYesterday}`,
		{
			method: 'GET',
			headers: headers
		}
	);

	const consumption = await response.json();

	const data = consumption.results.map((period) => {
		return {
			date: new Date(period.interval_start),
			consumption: period.consumption
		};
	});

	return json(data);
};
