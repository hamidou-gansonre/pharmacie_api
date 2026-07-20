import { Server } from "node:http";

export const registerProcessHandlers = (server: Server) => {
    process.on('unhandledRejection', (reason: unknown) => {
        console.error('[Unhandled Rejection]:', reason);
    });

    process.on('uncaughtException', (error: Error) => {
        console.error('[Uncaught Exception]:', error);
        process.exit(1);
    });

    process.on('SIGTERM', () => {
        console.log('[SIGTERM] Shutting down gracefully...');
        server.close(() => process.exit(0));
    });
}