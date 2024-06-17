export default definePreset({
	name: 'innocenzi:config',
	options: {
		install: true,
		editor: false,
		eslint: false,
		vue: false,
		rust: false,
		bevy: false,
		ghRelease: false,
		tasks: false,
		laravel: false,
	},
	handler: async ({ options, prompts }) => {
		for (const type of ['editor', 'eslint', 'vue', 'rust']) {
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

		if (options.bevy) {
			await editFiles({
				files: 'Cargo.toml',
				operations: [
					{
						type: 'update-content',
						skipIf: (content) => content.includes('bevy ='),
						update: (content) => content.replace('[dependencies]', '[dependencies]\nbevy = { version = "0.9.0", features = ["dynamic"] }'),
					},
					{
						type: 'update-content',
						skipIf: (content) => content.includes('profile.dev'),
						update: (content) => content += `
# Enable a small amount of optimization in debug mode
[profile.dev]
opt-level = 1

# Enable high optimizations for dependencies (incl. Bevy), but not for our code:
[profile.dev.package."*"]
opt-level = 3
`.trimEnd(),
					},
				],
			})
		}

		if (options.ghRelease) {
			await extractTemplates({
				title: 'extract release action',
				from: 'github/release.yml',
				to: '.github/workflows',
				flatten: true,
			})
		}

		if (options.laravel) {
			await applyNestedPreset({
				title: 'install hybridly',
				preset: 'hybridly/preset',
			})

			await extractTemplates({ from: 'laravel', title: 'extract laravel files', whenConflict: 'override' })

			// eslint-disable-next-line no-alert
			await prompt({
				text: 'What is the application name?',
				name: 'appname',
				default: 'App',
			})

			await deletePaths({
				title: 'remove unused files and directories',
				paths: ['app', 'database/factories', 'routes', 'package.lock', 'teests/Feature', 'tests/Unit', 'tests/TestCase.php'],
			})

			await editFiles({
				title: 'update phpunit config',
				files: 'phpunit.xml',
				operations: {
					type: 'update-content',
					update: (content) => content
						.replace('<!-- <env name="DB_CONNECTION" value="sqlite"/> -->', '<env name="DB_CONNECTION" value="pgsql"/>')
						.replace('<!-- <env name="DB_DATABASE" value=":memory:"/> -->', '<env name="DB_DATABASE" value="testing"/>'),
				},
			})

			await editFiles({
				title: 'ignore php-cs-fixer cache file',
				files: '.gitignore',
				operations: [
					{
						skipIf: (content) => content.includes('.php-cs-fixer.cache'),
						type: 'add-line',
						position: 'append',
						lines: ['.php-cs-fixer.cache'],
					},
					{
						skipIf: (content) => content.includes('_ide_helper*'),
						type: 'add-line',
						position: 'append',
						lines: ['_ide_helper*', '.phpstorm.meta.php'],
					},
				],
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
								'test': 'pest',
								'lint': 'php-cs-fixer fix --allow-risky=yes --dry-run',
								'lint:fix': 'php-cs-fixer fix --allow-risky=yes',
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
									'@php artisan ide-helper:models -M || true',
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
		}

		if (options.install) {
			if (options.eslint) {
				await installPackages({ for: 'node', install: ['eslint', '@innocenzi/eslint-config', 'typescript'], dev: true, title: 'install eslint' })
			}

			if (options.laravel) {
				await installPackages({ for: 'php', install: ['friendsofphp/php-cs-fixer', 'barryvdh/laravel-ide-helper'], dev: true })
				await executeCommand({
					title: 'generate artisan key',
					command: 'php',
					arguments: ['artisan', 'key:generate'],
				})
			}
		}
	},
})
