import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import App from './App'
import store from './store'

const renderWithProviders = (component) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  )
}

describe('Airbnb Clone App', () => {
  it('renders the navigation', () => {
    renderWithProviders(<App />)
    expect(screen.getByText('Airbnb Clone')).toBeInTheDocument()
  })

  it('renders the home page hero', () => {
    renderWithProviders(<App />)
    expect(screen.getByText('Find your perfect stay')).toBeInTheDocument()
  })

  it('renders property listings', () => {
    renderWithProviders(<App />)
    expect(screen.getByText('Cozy Downtown Apartment')).toBeInTheDocument()
    expect(screen.getByText('Luxury Beach House')).toBeInTheDocument()
    expect(screen.getByText('Mountain Cabin Retreat')).toBeInTheDocument()
  })
});