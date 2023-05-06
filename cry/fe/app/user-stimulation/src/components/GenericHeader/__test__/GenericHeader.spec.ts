// @ts-nocheck
jest.mock('@/services/user');
jest.mock('@/config/app.utils');

import { fetchCurrentUser } from '@/services/user';
import { render, waitFor, fireEvent } from '@testing-library/vue';
import GenericHeader from '../GenericHeader.vue';
import { getDefaultAvatarFromConfig } from '@/config/app.utils';

describe('GenericHeader', () => {
  it('should render an avatar and name of user', async () => {
    fetchCurrentUser.mockResolvedValue({
      status: 'success',
      user: {
        userid: 'user_id',
        name: 'username',
        email: 'user@yidian-inc.com',
        avatar: 'https://avatar.com',
      },
    });

    const { getByAltText, getByText } = render(GenericHeader);

    await waitFor(() => {
      expect(getByAltText("username's avatar")).toBeInTheDocument();
    });
    expect(getByAltText("username's avatar")).toHaveAttribute('src', 'https://avatar.com');
    expect(getByText('username'));
  });

  it('should render a default avatar for user who does not have an avatar', async () => {
    fetchCurrentUser.mockResolvedValue({
      status: 'success',
      user: {
        userid: 'user_id',
        name: 'username',
        email: 'user@yidian-inc.com',
        avatar: '',
      },
    });

    getDefaultAvatarFromConfig.mockReturnValue('https://default.avatar.com');
    const { getByAltText } = render(GenericHeader);
    await waitFor(() => {
      expect(getByAltText("username's avatar")).toHaveAttribute(
        'src',
        'https://default.avatar.com',
      );
    });
  });

  it('should fire a toggle menu event, when click the toggle menu button', async () => {
    const toggleMenuListener = jest.fn();
    const { getByTestId } = render(GenericHeader, {
      listeners: {
        toggleMenu: toggleMenuListener,
      },
    });

    expect(getByTestId('toggle-menu')).toHaveAttribute('aria-label', 'icon: menu-fold');
    // fold the menu
    fireEvent.click(getByTestId('toggle-menu'));
    expect(toggleMenuListener).toBeCalled();
    await waitFor(() => {
      expect(getByTestId('toggle-menu')).toHaveAttribute('aria-label', 'icon: menu-unfold');
    });

    // unfold the menu
    fireEvent.click(getByTestId('toggle-menu'));
    expect(toggleMenuListener).toBeCalledTimes(2);

    await waitFor(() => {
      expect(getByTestId('toggle-menu')).toHaveAttribute('aria-label', 'icon: menu-fold');
    });
  });
});
