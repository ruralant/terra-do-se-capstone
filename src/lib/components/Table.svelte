<script>
	import { format, parseISO } from 'date-fns';

	export let headers = [
		'Date',
		'kWh',
		'Grid Intensity (gCO2eq/kWh)',
		'Unit Rate (p/kWh)',
		'Daily Energy Cost',
		'Carbon Emis (kWh * gCO2eq/kWh)'
	];
	export let energy;
	export let intensity;
	export let prices;

	// combine data from energy, intensity and prices into one array of objects and combine every single object by date (if they have the same date) amd remove the item if it doesn't have all the properties
	const data = energy.map((item) => {
		const intensityItem = intensity.find((intensityItem) => intensityItem.date === item.date);
		const pricesItem = prices.find((pricesItem) => pricesItem.date === item.date);

		return {
			...item,
			...intensityItem,
			...pricesItem
		};
	});

	data.pop();

	//remove last item from array

	// add a new property to each object in the array called average and calculate the average of the consumption and intensity
	const dataWithAverage = data.map((item) => {
		const cost = (item.consumption * item.unitRate) / 100;
		return {
			...item,
			carbonScore: item.consumption + item.intensity,
			dailyEnergyCost: `£${cost.toFixed(2)}`
		};
	});

	// loop through the dataWithAverage, find the items with the lowest carbonScore and add a new property to the item called lowestCarbonScore and set it to true
	const dataWithLowestCarbonScore = dataWithAverage.map((item) => {
		const lowestCarbonScore = dataWithAverage.reduce((acc, curr) => {
			if (curr.carbonScore < acc.carbonScore) {
				return curr;
			}
			return acc;
		});

		const lowestPriceScore = dataWithAverage.reduce((acc, curr) => {
			if (curr.dailyEnergyCost < acc.dailyEnergyCost) {
				return curr;
			}
			return acc;
		});

		if (item.date === lowestCarbonScore.date) {
			return {
				...item,
				lowestCarbonScore: true
			};
		}

		if (item.date === lowestPriceScore.date) {
			return {
				...item,
				lowestPriceScore: true
			};
		}

		return item;
	});
</script>

<table id="table">
	<thead>
		<tr class="table-header-row">
			{#each headers as header}
				<th class="table-header">{header}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each dataWithLowestCarbonScore as item}
			<tr>
				<td>{format(parseISO(item.date), 'dd/MM/yyy')}</td>
				<td>{item.consumption.toFixed(2)}</td>
				<td>{item.intensity}</td>
				<td>{item.unitRate.toFixed(2)}</td>
				<td>
					<div class="carbon-score">
						<span>{item.dailyEnergyCost}</span> <span>{item.lowestPriceScore ? '💰' : ''}</span>
					</div>
				</td>
				<td>
					<div class="carbon-score">
						<span>{item.carbonScore.toFixed(0)}</span>
						<span>{item.lowestCarbonScore ? '🌲' : ''}</span>
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		border-collapse: collapse;
	}

	th,
	td {
		border: 1px solid black;
		padding: 8px;
	}

	#table {
		margin-top: 50px;
		width: 100%;
	}

	.table-header-row {
		padding-bottom: 30px;
	}

	.table-header {
		text-align: left;
	}

	.carbon-score {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
</style>
