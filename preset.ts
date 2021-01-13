import { Preset } from 'use-preset';

Preset.setName('innocenzi/config');
Preset.option('php', true);

Preset.extract('default');
Preset.extract('php').ifOption('php');
