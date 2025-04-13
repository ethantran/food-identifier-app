/**
 * Plugin interface that all plugins must implement
 */
export interface Plugin {
    id: string;
    name: string;
    version: string;
    register(): void;
    unregister?(): void;
}

/**
 * Plugin Registry - Mermaid Sequence Diagram
 * ```mermaid
 * sequenceDiagram
 *     participant App
 *     participant Registry
 *     participant Plugin
 *     
 *     App->>Registry: registerPlugin(plugin)
 *     Registry->>Plugin: plugin.register()
 *     Plugin->>Registry: Registered
 *     App->>Registry: getPlugin(id)
 *     Registry->>App: Return Plugin
 * ```
 */
export class PluginRegistry {
    private static instance: PluginRegistry;
    private plugins: Map<string, Plugin> = new Map();

    private constructor() { }

    /**
     * Get singleton instance of PluginRegistry
     */
    public static getInstance(): PluginRegistry {
        if (!PluginRegistry.instance) {
            PluginRegistry.instance = new PluginRegistry();
        }
        return PluginRegistry.instance;
    }

    /**
     * Register a plugin
     */
    public registerPlugin(plugin: Plugin): void {
        if (this.plugins.has(plugin.id)) {
            console.warn(`Plugin with ID ${plugin.id} is already registered. Skipping.`);
            return;
        }

        try {
            plugin.register();
            this.plugins.set(plugin.id, plugin);
            console.log(`Plugin ${plugin.name} v${plugin.version} registered successfully.`);
        } catch (error) {
            console.error(`Failed to register plugin ${plugin.name}:`, error);
        }
    }

    /**
     * Unregister a plugin by ID
     */
    public unregisterPlugin(pluginId: string): boolean {
        const plugin = this.plugins.get(pluginId);

        if (!plugin) {
            console.warn(`Plugin with ID ${pluginId} is not registered.`);
            return false;
        }

        try {
            if (plugin.unregister) {
                plugin.unregister();
            }
            this.plugins.delete(pluginId);
            console.log(`Plugin ${plugin.name} unregistered successfully.`);
            return true;
        } catch (error) {
            console.error(`Failed to unregister plugin ${plugin.name}:`, error);
            return false;
        }
    }

    /**
     * Get a plugin by ID
     */
    public getPlugin<T extends Plugin>(pluginId: string): T | undefined {
        return this.plugins.get(pluginId) as T | undefined;
    }

    /**
     * Get all registered plugins
     */
    public getAllPlugins(): Plugin[] {
        return Array.from(this.plugins.values());
    }
} 