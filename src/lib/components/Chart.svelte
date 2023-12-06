<script>
	import { format, parseISO } from 'date-fns';
	import { Line } from 'svelte-chartjs';
	export let energy;
	export let intensity;
	export let prices;

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	} from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	const labels = energy.map((item) => format(parseISO(item.date), 'dd/MM/yy')).reverse();

	const data = {
		labels: labels,
		datasets: [
			{
				label: 'Energy Consumption (kWh)',
				yAxisID: 'energy',
				data: energy.map((item) => item.consumption).reverse(),
				fill: false,
				borderColor: '#749BC2',
				tension: 0.1
			},
			{
				label: 'Grid Intensity (gCO2eq/kWh)',
				yAxisID: 'intensity',
				data: intensity.map((item) => item.intensity).reverse(),
				fill: false,
				borderColor: '#E57C23',
				tension: 0.1
			},
			{
				label: 'Unit Rate (p/kWh)',
				yAxisID: 'prices',
				data: prices.map((item) => item.unitRate).reverse(),
				fill: false,
				borderColor: '#495E57',
				tension: 0.1
			}
		]
	};

	const options = {
		responsive: true,
		scales: {
			energy: {
				type: 'linear',
				display: false,
				position: 'left'
			},
			intensity: {
				type: 'linear',
				display: false,
				position: 'right'
			},
			prices: {
				type: 'linear',
				display: false,
				position: 'right'
			}
		}
	};
</script>

<Line {data} {options} />
