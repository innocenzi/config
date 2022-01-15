import { definePreset, extractTemplates, installPackages } from '@preset/core'

export default definePreset({
	name: 'innocenzi:config',
	flags: {
		install: true,
		editor: true,
		eslint: true,
		php: false
	},
	handler: async ({ options }) => {
		for (const type of ['editor', 'eslint', 'php']) {
			if (options[type]) {
				await extractTemplates({ from: type, title: `extract ${type} config` })
			}
		}

		if (options.install) {
			if (options.eslint) {
				await installPackages({ for: 'node', install: ['eslint', '@innocenzi/eslint-config'], dev: true, title: 'install eslint' })
			}
			
			if (options.php) {
				await installPackages({ for: 'php', install: ['friendsofphp/php-cs-fixer'], dev: true, title: 'install php-cs-fixer' })
			}
		}
	}
})
