import { ReactNode } from 'react';
import { Menu } from './menu';
import { Message } from 'components';
import { Alert } from 'components/common/message';

interface LayoutProps {
  id?: number;
  title?: string;
  children?: ReactNode;
  msgs?: Array<Alert>;
}

export const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  return (
    <div className="">
      <section className="main-content columns is-fullheight">
          <Menu />

          <div className="container column is-10">
            <div className="section">
              <div className="card">
                <div className="card-header">
                  <p className="card-header-title">
                    { props.title }
                  </p>
                </div>
                <div className="card-content">
                  <div className="content">
                    {props.msgs &&
                      props.msgs.map((msg, i) =>  <Message key={i + 1} {...msg} />)
                      }

                    { props.children }
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>
    </div>
  )
}
