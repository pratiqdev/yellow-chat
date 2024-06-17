import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App';

// bare minimum test case as an example
describe('App', () => {
    afterEach(() => {
        vi.clearAllMocks();
        window.localStorage.clear();
    });

    it('renders correctly', () => {
        const { getByText } = render(<App />);
        const linkElement = getByText(/built with pubnub and react/i);
        expect(linkElement).toBeTruthy();
    });

})

// TODO: test updating username
// TODO: test creating channel
// TODO: test leaving channel
// TODO: test deleting channel
// TODO: test send message
// TODO: test recieve message?
// TODO: test user join
// TODO: test user leave/timeout
// TODO: test user metadata updates