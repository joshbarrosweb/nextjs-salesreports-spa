import Link from 'next/link';

export const Menu: React.FC = () => {
  return (
    <aside className="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile">
      <p className="menu-label is-hidden-touch">
        My Sales
      </p>
      <ul className="menu-list">
        <MenuItem href="/" label="Home" />
        <MenuItem href="/list/products" label="Submissions" />
        <MenuItem href="/" label="Configuration" />
        <MenuItem href="/exit" label="Exit" />
      </ul>
    </aside>
  )
}

interface MenuItemProps {
  href: string;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps) => {
  return (
    <li>
      <Link href={props.href}>
        <a>
          <span className="icon"></span> { props.label }
        </a>
      </Link>
    </li>
  )
}
