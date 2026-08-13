import { Tabs } from 'nextra/components'

export function SDKTabs({ children }: { children: React.ReactNode }) {
    return <Tabs items={["TypeScript", "C#", "Lua", "Haxe", "GDScript", "Dart"]} storageKey='sdk-tabs'>
        {children}
    </Tabs>
}
