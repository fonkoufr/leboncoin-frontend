import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AnnonceCard from './AnnonceCard'
import type { Annonce } from '../services/api'

describe('AnnonceCard', () => {
  const mockAnnonce: Annonce = {
    id: 1,
    titre: 'iPhone 15 Neuf',
    description: 'iPhone 15 couleur noir, très bon état',
    prix: 999,
    ville: 'Paris',
    imageUrl: 'https://example.com/iphone.jpg',
    userId: 123
  }

  it('should render annonce title', () => {
    render(<AnnonceCard annonce={mockAnnonce} />)
    expect(screen.getByText('iPhone 15 Neuf')).toBeInTheDocument()
  })

  it('should render annonce price with euro sign', () => {
    render(<AnnonceCard annonce={mockAnnonce} />)
    expect(screen.getByText('999 €')).toBeInTheDocument()
  })

  it('should render annonce ville with location emoji', () => {
    render(<AnnonceCard annonce={mockAnnonce} />)
    expect(screen.getByText('📍 Paris')).toBeInTheDocument()
  })

  it('should render annonce image with correct src', () => {
    render(<AnnonceCard annonce={mockAnnonce} />)
    const img = screen.getByAltText('iPhone 15 Neuf') as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img.src).toBe('https://example.com/iphone.jpg')
  })

  it('should use placeholder image when imageUrl is not provided', () => {
    const annonceWithoutImage = { ...mockAnnonce, imageUrl: undefined }
    render(<AnnonceCard annonce={annonceWithoutImage} />)
    const img = screen.getByAltText('iPhone 15 Neuf') as HTMLImageElement
    expect(img.src).toContain('placeholder')
  })

  it('should handle different prices', () => {
    const annonceCheap = { ...mockAnnonce, prix: 10.50, titre: 'Livre d\'occasion' }
    render(<AnnonceCard annonce={annonceCheap} />)
    expect(screen.getByText('10.5 €')).toBeInTheDocument()
  })

  it('should display correct alt text for image', () => {
    render(<AnnonceCard annonce={mockAnnonce} />)
    const img = screen.getByAltText('iPhone 15 Neuf')
    expect(img).toBeInTheDocument()
  })

  it('should handle different villes', () => {
    const annonceNice = { ...mockAnnonce, ville: 'Nice' }
    render(<AnnonceCard annonce={annonceNice} />)
    expect(screen.getByText('📍 Nice')).toBeInTheDocument()
  })

  it('should have card container with proper structure', () => {
    const { container } = render(<AnnonceCard annonce={mockAnnonce} />)
    const card = container.querySelector('.card')
    expect(card).toBeInTheDocument()
  })

  it('should contain h3 heading with title', () => {
    const { container } = render(<AnnonceCard annonce={mockAnnonce} />)
    const heading = container.querySelector('h3')
    expect(heading?.textContent).toBe('iPhone 15 Neuf')
  })
})
