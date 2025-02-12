import { Tabs } from 'nextra/components'

export function SDKTabs({ children }: { children: React.ReactNode }) {
    return <Tabs items={["TypeScript", "Unity (C#)", "Defold (Lua)", "Haxe"]} storageKey='sdk-tabs'>
        {children}
    </Tabs>
}
