import { Children, isValidElement, type ComponentProps } from 'react';
import { Tabs as BaseTabs, Tab } from 'fumadocs-ui/components/tabs';

type TabsProps = ComponentProps<typeof BaseTabs>;

/** Tabs whose labels come from each child's `<Tab value>`, so they're never written twice. */
export function Tabs({ items, children, ...props }: TabsProps) {
  items ??= Children.toArray(children)
    .filter(isValidElement<{ value?: string }>)
    .map((child) => child.props.value)
    .filter((v): v is string => typeof v === 'string');
  return (
    <BaseTabs items={items} {...props}>
      {children}
    </BaseTabs>
  );
}

/** Language switcher: one choice shared by every LangTabs on the site. */
export function LangTabs(props: TabsProps) {
  return <Tabs groupId="lang" persist {...props} />;
}

export { Tab };
