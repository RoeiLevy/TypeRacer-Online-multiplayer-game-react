import { render, screen, fireEvent } from '@testing-library/react';
import { Home } from './Home';
import { Provider } from 'react-redux';
import { store as configureStoreForTesting } from '../../store';
import { MemoryRouter } from 'react-router-dom'; 
import { setCurrWeather } from '../../store/actions/weatherActions';

describe('Home Component', () => {
    const store = configureStoreForTesting

    it('renders without errors', () => {
        render(
            <MemoryRouter>
                <Provider store={store}>
                    <Home />
                </Provider>
            </MemoryRouter>
        );
        const searchContainer = screen.getByTestId('search-container');
        expect(searchContainer).toBeInTheDocument();
    });

    it('renders current weather', () => {
        store.dispatch(setCurrWeather({}));

        render(
            <MemoryRouter>
                <Provider store={store}>
                    <Home />
                </Provider>
            </MemoryRouter>
        );
        const currWeather = screen.getByTestId('curr-weather');
        expect(currWeather).toBeInTheDocument();
    });

    it('toggles favorite', () => {
        store.dispatch(setCurrWeather({}));

        render(
            <MemoryRouter>
                <Provider store={store}>
                    <Home />
                </Provider>
            </MemoryRouter>
        );

        const favoriteIcon = screen.getByTestId('favorite-icon');
        expect(favoriteIcon).toHaveClass('pi-heart');
        
        fireEvent.click(favoriteIcon);
        expect(favoriteIcon).toHaveClass('pi-heart-fill');
    });
});
