import { initDB, getDB } from '../core/db.js';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import os from 'os';

export function registerResetCommand(program) {
    program
        .command('reset')
        .description('Delete the local SQLite database and start fresh')
        .action(async () => {
            const dbDir = path.join(os.homedir(), '.uptimekit');
            const dbPath = path.join(dbDir, 'uptimekit.db');

            const answer = await new Promise(resolve => {
                process.stdout.write('This will delete all monitors and heartbeat data. Continue? (y/N): ');
                process.stdin.once('data', data => resolve(data.toString().trim().toLowerCase()));
            });

            if (answer !== 'y' && answer !== 'yes') {
                console.log(chalk.yellow('Reset aborted.'));
                return;
            }

            try {
                if (fs.existsSync(dbPath)) {
                    fs.unlinkSync(dbPath);
                }
                await initDB();
                console.log(chalk.green('Database has been reset.'));
            } catch (err) {
                console.error(chalk.red('Failed to reset database:'), err.message);
            }
        });
}
