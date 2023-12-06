<script>
	import EnergyChart from '$lib/components/Chart.svelte';
	import Table from '$lib/components/Table.svelte';
	export let data;
	let { prices, energy, intensity } = data;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Terra.do capstone home page" />
</svelte:head>

<main>
	<EnergyChart {energy} {intensity} {prices} />
	<Table {energy} {intensity} {prices} />
</main>
