import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ChatBot from './ChatBot'
import userEvent from '@testing-library/user-event'

describe('ChatBot', () => {
  it('should render chat button initially', () => {
    render(<ChatBot />)
    const chatBtn = screen.getByRole('button', { name: /🤖/ })
    expect(chatBtn).toBeInTheDocument()
  })

  it('should toggle chat window when button is clicked', () => {
    render(<ChatBot />)
    const chatBtn = screen.getByRole('button', { name: /🤖/ })
    
    expect(screen.queryByText(/Fonky's AI Assistant/i)).not.toBeInTheDocument()
    
    fireEvent.click(chatBtn)
    expect(screen.getByText(/Fonky's AI Assistant/i)).toBeInTheDocument()
    
    fireEvent.click(chatBtn)
    expect(screen.queryByText(/Fonky's AI Assistant/i)).not.toBeInTheDocument()
  })

  it('should display initial bot message', () => {
    render(<ChatBot />)
    fireEvent.click(screen.getByRole('button', { name: /🤖/ }))
    
    expect(screen.getByText(/Je suis l'IA de Fonky's/i)).toBeInTheDocument()
  })

  it('should have search input with placeholder', () => {
    render(<ChatBot />)
    fireEvent.click(screen.getByRole('button', { name: /🤖/ }))
    
    const input = screen.getByPlaceholderText(/Parlez-moi/i)
    expect(input).toBeInTheDocument()
  })

  it('should display close button (✕) when chat is open', () => {
    render(<ChatBot />)
    const chatBtn = screen.getByRole('button', { name: /🤖/ })
    
    fireEvent.click(chatBtn)
    expect(screen.getByRole('button', { name: /✕/ })).toBeInTheDocument()
  })

  it('should send user message', async () => {
    render(<ChatBot />)
    fireEvent.click(screen.getByRole('button', { name: /🤖/ }))
    
    const input = screen.getByPlaceholderText(/Parlez-moi/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'bonjour' } })
    
    const submitBtn = screen.getByRole('button', { name: /➤/ })
    fireEvent.click(submitBtn)
    
    expect(screen.getByText('bonjour')).toBeInTheDocument()
    expect(input.value).toBe('')
  })

  it('should not send empty message', () => {
    render(<ChatBot />)
    fireEvent.click(screen.getByRole('button', { name: /🤖/ }))
    
    const submitBtn = screen.getByRole('button', { name: /➤/ })
    fireEvent.click(submitBtn)
    
    // Should still have only the initial bot message
    const messages = screen.getAllByText(/Je suis l'IA de Fonky's|bonjour/i)
    expect(messages.length).toBe(1)
  })

  it('should respond with spotify when user mentions musique', async () => {
    vi.useFakeTimers()
    render(<ChatBot />)
    fireEvent.click(screen.getByRole('button', { name: /🤖/ }))
    
    const input = screen.getByPlaceholderText(/Parlez-moi/i)
    fireEvent.change(input, { target: { value: 'musique' } })
    
    const submitBtn = screen.getByRole('button', { name: /➤/ })
    fireEvent.click(submitBtn)
    
    expect(screen.getByText('musique')).toBeInTheDocument()
    expect(screen.getByText(/Fonky's AI écrit/i)).toBeInTheDocument()
    
    vi.advanceTimersByTime(1500)
    
    await waitFor(() => {
      expect(screen.getByText(/Voici une playlist 'Vibes Shopping'/i)).toBeInTheDocument()
    })
    
    vi.useRealTimers()
  })

  it('should respond with spotify when user mentions vélo', async () => {
    vi.useFakeTimers()
    render(<ChatBot />)
    fireEvent.click(screen.getByRole('button', { name: /🤖/ }))
    
    const input = screen.getByPlaceholderText(/Parlez-moi/i)
    fireEvent.change(input, { target: { value: 'vélo' } })
    
    const submitBtn = screen.getByRole('button', { name: /➤/ })
    fireEvent.click(submitBtn)
    
    vi.advanceTimersByTime(1500)
    
    await waitFor(() => {
      expect(screen.getByText(/Pour vos sorties sportives/i)).toBeInTheDocument()
    })
    
    vi.useRealTimers()
  })

  it('should respond with generic message for unknown keywords', async () => {
    vi.useFakeTimers()
    render(<ChatBot />)
    fireEvent.click(screen.getByRole('button', { name: /🤖/ }))
    
    const input = screen.getByPlaceholderText(/Parlez-moi/i)
    fireEvent.change(input, { target: { value: 'test inconnu' } })
    
    const submitBtn = screen.getByRole('button', { name: /➤/ })
    fireEvent.click(submitBtn)
    
    vi.advanceTimersByTime(1500)
    
    await waitFor(() => {
      expect(screen.getByText(/Je peux vous aider à trouver des articles/i)).toBeInTheDocument()
    })
    
    vi.useRealTimers()
  })

  it('should display online status', () => {
    render(<ChatBot />)
    fireEvent.click(screen.getByRole('button', { name: /🤖/ }))
    
    expect(screen.getByText(/En ligne/i)).toBeInTheDocument()
  })

  it('should handle multiple messages in conversation', async () => {
    vi.useFakeTimers()
    render(<ChatBot />)
    fireEvent.click(screen.getByRole('button', { name: /🤖/ }))
    
    const input = screen.getByPlaceholderText(/Parlez-moi/i) as HTMLInputElement
    
    // First message
    fireEvent.change(input, { target: { value: 'message 1' } })
    fireEvent.click(screen.getByRole('button', { name: /➤/ }))
    expect(input.value).toBe('')
    
    vi.advanceTimersByTime(1500)
    
    await waitFor(() => {
      expect(screen.getByText('message 1')).toBeInTheDocument()
    })
    
    vi.useRealTimers()
  })

  it('should have input with autoFocus when chat is open', () => {
    render(<ChatBot />)
    fireEvent.click(screen.getByRole('button', { name: /🤖/ }))
    
    const input = screen.getByPlaceholderText(/Parlez-moi/i)
    expect(input).toHaveFocus()
  })

  it('should clear input after submitting', () => {
    render(<ChatBot />)
    fireEvent.click(screen.getByRole('button', { name: /🤖/ }))
    
    const input = screen.getByPlaceholderText(/Parlez-moi/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'test message' } })
    
    const submitBtn = screen.getByRole('button', { name: /➤/ })
    fireEvent.click(submitBtn)
    
    expect(input.value).toBe('')
  })
})
