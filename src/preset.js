const { Preset } = require('@use-preset/preset');

module.exports = Preset.make({
	name: 'dotfiles',
	actions: () => [
		{
			type: 'copy',
			strategy: 'ask',
		},
	],
});
