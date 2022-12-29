export default definePreset({
	name: 'innocenzi:config',
	options: {
		install: true,
		editor: true,
		eslint: false,
		vue: false,
		php: false,
		rust: false,
		ghRelease: false,
	},
	handler: async({ options }) => {
		for (const type of ['editor', 'eslint', 'php', 'vue', 'rust']) {
			if (options[type]) {
				await extractTemplates({ from: type, title: `extract ${type} config` })
			}
		}

		if (options.ghRelease) {
			await extractTemplates({
				title: 'extract release action',
				from: 'github/release.yml',
				to: '.github/workflows',
				flatten: true,
			})
		}

		if (options.install) {
			if (options.eslint) {
				await installPackages({ for: 'node', install: ['eslint', '@innocenzi/eslint-config', 'typescript'], dev: true, title: 'install eslint' })
			}

			if (options.php) {
				await group({
					title: 'install php-cs-fixer',
					handler: async() => {
						await installPackages({ for: 'php', install: ['friendsofphp/php-cs-fixer'], dev: true })
						await editFiles({
							title: 'ignore php-cs-fixer cache file',
							files: '.gitignore',
							operations: {
								skipIf: (content) => content.includes('.php-cs-fixer.cache'),
								type: 'add-line',
								position: 'append',
								lines: ['.php-cs-fixer.cache'],
							},
						})
						await editFiles({
							title: 'add "style" composer script',
							files: 'composer.json',
							operations: {
								type: 'edit-json',
								merge: {
									scripts: {
										style: [
											'php-cs-fixer fix --allow-risky=yes',
										],
									},
								},
							},
						})
					},
				})
			}
		}
	},
})
