// @ts-nocheck
import { render, fireEvent, waitFor } from '@testing-library/vue';
import GenericMenu from '../GenericMenu.vue';
import FakeHome from './fixtures/FakeHome.vue';
import FakeDashboard from './fixtures/FakeDashboard.vue';
import Container from './fixtures/Container.vue';

const routes = [
  {
    path: '/',
    component: FakeHome,
  },
  {
    path: '/dashboard',
    component: FakeDashboard,
  },
];

describe('GenericMenu', () => {
  it('should render menu item with icon specified', () => {
    const { getByText, getByTestId } = render(GenericMenu, {
      routes,
      propsData: {
        menu: [
          {
            path: '/',
            name: '首页',
            icon: 'home',
          },
        ],
      },
    });

    expect(getByText('首页')).toBeInTheDocument();
    expect(getByTestId('icon')).toBeInTheDocument();
  });

  it('should not show icon if icon is not specified', () => {
    const { getByText, queryByTestId } = render(GenericMenu, {
      routes,
      propsData: {
        menu: [
          {
            path: '/dashboard',
            name: '监控台',
          },
        ],
      },
    });

    expect(queryByTestId('icon')).not.toBeInTheDocument();
    expect(getByText('监控台')).toBeInTheDocument();
  });

  it('should show items in sub menu when click sub menu toggle', async () => {
    const { getByText } = render(GenericMenu, {
      routes,
      propsData: {
        menu: [
          {
            path: '/',
            name: '首页',
            subItems: [
              {
                path: '/dashboard',
                name: '监控台',
              },
            ],
          },
        ],
      },
    });

    await fireEvent.click(getByText('首页'));

    expect(getByText('监控台')).toBeInTheDocument();
  });

  it('should navigate to particular page', async () => {
    const { queryByTestId, getByText } = render(Container, {
      routes,
      propsData: {
        menu: [
          {
            path: '/',
            name: '首页',
          },
          {
            path: '/dashboard',
            name: '监控台',
          },
          {
            name: '快捷方式',
            subItems: [
              {
                path: '/',
                name: '返回首页',
              },
            ],
          },
        ],
      },
    });
    await fireEvent.click(getByText('监控台'));
    expect(queryByTestId('router-view')).toHaveTextContent('监控台内容');

    await fireEvent.click(getByText('快捷方式'));
    await waitFor(() => getByText('返回首页'));
    await fireEvent.click(getByText('返回首页'));
    expect(queryByTestId('router-view')).toHaveTextContent('首页内容');
  });
});
