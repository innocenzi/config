const { Preset } = require('use-preset');

module.exports = Preset.make({
	name: 'innocenzi/dotfiles',
	actions: () => [
		{
			type: 'copy',
			files: '**/*.dotfile',
			strategy: 'ask',
		},
	],
});
