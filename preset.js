const { Preset } = require('use-preset');

module.exports = Preset.make({
	actions: () => [
		{
			type: 'copy',
			files: '*',
			strategy: 'ask',
		},
	],
});
