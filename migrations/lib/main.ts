import { AppDataSource } from './ormconfig';

(async function executeMigrations() {
    try {
        await AppDataSource.initialize();
        await AppDataSource.runMigrations();
        console.info('Migrations executed successfully');

    } catch (err) {
        console.log(err);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
})();

