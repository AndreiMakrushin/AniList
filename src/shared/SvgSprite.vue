
<script lang="ts" setup>
interface IconProps {
	icon: string;
	sprite: string;
	width?: number;
	height?: number;
}

const props = defineProps<IconProps>();

const { icon, sprite = '', width = 20, height = 20 } = props;
</script>

<template>
	<span >
		<svg
			class="icon"
			v-bind="$attrs"
			:width="width"
			:height="height"
		>
			<use :xlink:href="`${sprite}#${icon}`" />
		</svg>
	</span>
</template>
