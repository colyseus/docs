import { Tabs } from 'nextra/components'

export function SDKTabs({ children }: { children: React.ReactNode }) {
    return <Tabs items={["TypeScript", "Unity/Mono (C#)", "Defold (Lua)", "Haxe", "Godot (GDScript)"]} storageKey='sdk-tabs'>
        {children}
    </Tabs>
}
