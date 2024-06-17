<script setup lang="ts">
useHead({ title: 'Homepage' })

const version = useProperty('version')
</script>

<template>
	<section class="grid h-full w-full place-items-center">
		<div class="flex flex-col items-center">
			<p class="text-gray-400 mb-1 text-2xl">
				Welcome to <span class="text-gray-200 font-medium">Vertical Slices Laravel</span>
			</p>
			<span class="text-gray-600 tracking-widest">PHP {{ version }}</span>
		</div>
	</section>
</template>
