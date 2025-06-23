export default definePreset({
	name: 'innocenzi:config',
	options: {
		install: true,
		dprint: true,
		rust: false,
		ghRelease: false,
		tasks: false,
		laravel: false,
		php: false,
	},
	handler: async ({ options, prompts }) => {
		for (const type of ['rust', 'php', 'dprint']) {
			if (options[type]) {
				await extractTemplates({ from: type, title: `extract ${type} files` })
			}
		}

		if (options.tasks) {
			await extractTemplates({
				title: 'extract tasks file',
				from: 'vscode/tasks.json',
				to: '.vscode',
				flatten: true,
				whenConflict: 'skip',
			})

			await editFiles({
				title: 'add Vite task',
				files: '.vscode/tasks.json',
				operations: {
					type: 'edit-json',
					merge: {
						tasks: [
							{
								label: 'Run Vite',
								type: 'shell',
								command: 'npm run dev',
								presentation: {
									reveal: 'always',
									panel: 'new',
								},
								runOptions: {
									runOn: 'folderOpen',
								},
							},
						],
					},
				},
			})
		}

		if (options.laravel) {
			await applyNestedPreset({
				title: 'install hybridly',
				preset: 'hybridly/preset',
			})

			await extractTemplates({ from: 'laravel', title: 'extract laravel files', whenConflict: 'override' })

			await prompt({
				text: 'What is the application name?',
				name: 'appname',
				default: 'App',
			})

			await deletePaths({
				title: 'remove unused files and directories',
				paths: [
					'app',
					'database/factories',
					'routes',
					'package.lock',
					'teests/Feature',
					'tests/Unit',
					'tests/TestCase.php',
				],
			})

			await editFiles({
				title: 'update phpunit config',
				files: 'phpunit.xml',
				operations: {
					type: 'update-content',
					update: (content) =>
						content
							.replace(
								'<!-- <env name="DB_CONNECTION" value="sqlite"/> -->',
								'<env name="DB_CONNECTION" value="pgsql"/>',
							)
							.replace(
								'<!-- <env name="DB_DATABASE" value=":memory:"/> -->',
								'<env name="DB_DATABASE" value="testing"/>',
							),
				},
			})

			await editFiles({
				title: 'update composer.json scripts',
				files: 'composer.json',
				operations: [
					{
						type: 'edit-json',
						delete: ['scripts', 'autoload'],
					},
					{
						type: 'edit-json',
						merge: {
							autoload: {
								'psr-4': {
									'@@namespace\\': 'src/',
									'Infrastructure\\': 'src/Infrastructure/',
									'Support\\': 'src/Support/',
									'Database\\Seeders\\': 'database/seeders/',
								},
								'files': [
									'src/Support/functions.php',
								],
							},
							scripts: {
								'test': '@php artisan test --ci --order-by random',
								'post-update-cmd': '@php artisan vendor:publish --tag=laravel-assets --ansi --force',
								'post-root-package-install': "@php -r \"file_exists('.env') || copy('.env.example', '.env');\"",
								'post-autoload-dump': [
									'Illuminate\\Foundation\\ComposerScripts::postAutoloadDump',
									'@php artisan package:discover --ansi',
									'([ $COMPOSER_DEV_MODE -eq 1 ] && composer autocomplete) || true',
								],
								'autocomplete': [
									'@php artisan ide-helper:eloquent || true',
									'@php artisan ide-helper:generate || true',
									'@php artisan ide-helper:meta || true',
									'@php artisan ide-helper:models -M --dir=\\"src\\" || true',
								],
								fmt: 'mago fmt',
								lint: 'mago lint --fix && mago lint',
								qa: [
									'composer fmt',
									'composer lint',
									'composer test',
								],
							},
						},
					},
				],
			})

			await editFiles({
				title: 'update config',
				files: ['config/*.php'],
				operations: {
					type: 'update-content',
					update: (content) => content.replaceAll("'DB_CONNECTION', 'sqlite'", "'DB_CONNECTION', 'pgsql'"),
				},
			})

			await editFiles({
				title: 'replace variables',
				files: ['.env.example', '.env', 'composer.json', 'src/**/*.php', 'bootstrap/**/*.php', 'tests/**/*.php'],
				operations: {
					type: 'replace-variables',
					variables: {
						appname: prompts.appname,
						lowerappname: prompts.appname.toLowerCase().replaceAll(' ', ''),
						namespace: prompts.appname.replaceAll(' ', ''),
					},
				},
			})

			await editFiles({
				title: 'ignore ide helper files',
				files: '.gitignore',
				operations: [
					{
						skipIf: (content) => content.includes('_ide_helper*'),
						type: 'add-line',
						position: 'append',
						lines: ['_ide_helper*', '.phpstorm.meta.php'],
					},
				],
			})
		}

		if (options.install) {
			const phpPackages: string[] = []

			if (options.dprint) {
				await installPackages({
					for: 'node',
					install: ['dprint'],
					dev: true,
				})
			}

			if (options.php) {
				await executeCommand({
					title: 'add mago plugin',
					command: 'composer',
					arguments: ['config', 'allow-plugins.carthage-software/mago', 'true'],
				})

				phpPackages.push('carthage-software/mago')
			}

			if (options.laravel) {
				phpPackages.push('barryvdh/laravel-ide-helper')
			}

			if (phpPackages.length) {
				await installPackages({ for: 'php', install: phpPackages, dev: true })

				if (options.laravel) {
					await executeCommand({
						title: 'generate artisan key',
						command: 'php',
						arguments: ['artisan', 'key:generate'],
					})
				}
			}
		}
	},
})
