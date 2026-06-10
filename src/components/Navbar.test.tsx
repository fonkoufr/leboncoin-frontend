import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './Navbar'

const renderNavbar = (props = {}) => {
  return render(
    <BrowserRouter>
      <Navbar {...props} />
    </BrowserRouter>
  )
}

describe('Navbar', () => {
  it('should render logo', () => {
    renderNavbar()
    expect(screen.getByText(/YOUM'S/i)).toBeInTheDocument()
  })

  it('should render search input with placeholder', () => {
    renderNavbar()
    const input = screen.getByPlaceholderText(/Rechercher une annonce/i)
    expect(input).toBeInTheDocument()
  })

  it('should render search icon', () => {
    renderNavbar()
    expect(screen.getByText('🔍')).toBeInTheDocument()
  })

  describe('when not logged in', () => {
    it('should render login button', () => {
      renderNavbar({ isLoggedIn: false })
      expect(screen.getByText('Connexion')).toBeInTheDocument()
    })

    it('should not render logout button', () => {
      renderNavbar({ isLoggedIn: false })
      expect(screen.queryByText('Déconnexion')).not.toBeInTheDocument()
    })

    it('should not render post button', () => {
      renderNavbar({ isLoggedIn: false })
      expect(screen.queryByText(/Déposer/i)).not.toBeInTheDocument()
    })
  })

  describe('when logged in', () => {
    it('should render logout button', () => {
      renderNavbar({ isLoggedIn: true })
      expect(screen.getByText('Déconnexion')).toBeInTheDocument()
    })

    it('should render post button', () => {
      renderNavbar({ isLoggedIn: true })
      expect(screen.getByText(/Déposer/i)).toBeInTheDocument()
    })

    it('should not render login button', () => {
      renderNavbar({ isLoggedIn: true })
      const loginButtons = screen.queryAllByText('Connexion')
      expect(loginButtons).toHaveLength(0)
    })

    it('should call onLogout when logout button is clicked', () => {
      const onLogout = vi.fn()
      renderNavbar({ isLoggedIn: true, onLogout })
      
      const logoutBtn = screen.getByText('Déconnexion')
      fireEvent.click(logoutBtn)
      
      expect(onLogout).toHaveBeenCalledTimes(1)
    })
  })

  it('should not crash with undefined onLogout prop', () => {
    renderNavbar({ isLoggedIn: true, onLogout: undefined })
    expect(screen.getByText('Déconnexion')).toBeInTheDocument()
  })

  it('should have search input of type text', () => {
    renderNavbar()
    const input = screen.getByPlaceholderText(/Rechercher une annonce/i) as HTMLInputElement
    expect(input.type).toBe('text')
  })
})
