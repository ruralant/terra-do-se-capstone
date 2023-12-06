import { json } from '@sveltejs/kit';

export const GET = async () => {
	const today = new Date();
	const yesterday = new Date(today.setHours(23, 59, 59, 59)).setDate(new Date(today).getDate() - 1);
	const formattedYesterday = new Date(yesterday).toISOString().slice(0, 22) + 'Z';
	// new date 30 days from today date
	const fromDate = new Date(today.setHours(0, 0, 0, 0)).setDate(new Date(today).getDate() - 30);
	const formattedFromDate = new Date(fromDate).toISOString().slice(0, 22) + 'Z';

	const response = await fetch(
		`https://api.carbonintensity.org.uk/intensity/${formattedFromDate}/${formattedYesterday}`
	);

	const intensity = await response.json();

	const { data } = intensity;

	const days = data.reduce((acc, curr) => {
		const date = curr.from.split('T')[0];
		if (!acc.length) {
			acc = [
				{
					date,
					intensity: []
				}
			];
			acc[0].intensity.push(curr.intensity.actual);
		} else {
			const last = acc.at(-1);
			if (last.date === date) {
				last.intensity.push(curr.intensity.actual);
			} else {
				const newDataPoint = {
					date,
					intensity: []
				};
				newDataPoint.intensity.push(curr.intensity.actual);
				acc.push(newDataPoint);
			}
		}
		return acc;
	}, {});
	// calculate average intensity for each day
	days.forEach((day) => {
		day.date = new Date(day.date);
		const { intensity } = day;
		const sum = intensity.reduce((acc, curr) => acc + curr, 0);
		const average = sum / intensity.length;
		// average without floating point
		day.intensity = Math.round(average);
	});

	return json(days);
};
