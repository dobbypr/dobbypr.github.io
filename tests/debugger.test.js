const { MachineDebugger } = require('../js/debugger');

describe('MachineDebugger', () => {
    test('retains the latest logs up to the max limit', () => {
        const debuggerInstance = new MachineDebugger({ maxLogs: 3, autoAttach: false });
        debuggerInstance.info('A');
        debuggerInstance.warn('B');
        debuggerInstance.error('C');
        debuggerInstance.info('D');

        expect(debuggerInstance.logs).toHaveLength(3);
        expect(debuggerInstance.logs[0].message).toBe('B');
        expect(debuggerInstance.logs[2].message).toBe('D');
    });

    test('returns a fallback string for unserialisable context', () => {
        const debuggerInstance = new MachineDebugger({ autoAttach: false });
        const context = {};
        context.self = context;

        const result = MachineDebugger.stringifyContext(context);
        expect(result).toBe('[Unserializable context]');
    });
});
