import { Children, isValidElement } from 'react'
import { Tabs } from 'nextra/components'

// append new languages: the stored tab index must keep its meaning
const SDK_LANGUAGES = ["TypeScript", "C#", "Lua", "Haxe", "GDScript", "Dart", "GML"]

export function SDKTabs({ children }: { children: React.ReactNode }) {
    // GML only shows on groups that carry a seventh pane
    const panes = Children.toArray(children).filter(isValidElement).length
    return <Tabs items={SDK_LANGUAGES.slice(0, Math.max(panes, 6))} storageKey='sdk-tabs'>
        {children}
    </Tabs>
}
