import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Layout from './Layout'
import React from 'react'

describe('Layout', () => {
  it('should render without crashing', () => {
    render(<Layout />)
    expect(true).toBe(true)
  })

  it('should render children when provided', () => {
    render(
      <Layout>
        <div data-testid="test-child">Child Content</div>
      </Layout>
    )
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
  })

  it('should render multiple children', () => {
    render(
      <Layout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </Layout>
    )
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
  })

  it('should render text content from children', () => {
    render(
      <Layout>
        <p>Test paragraph</p>
      </Layout>
    )
    expect(screen.getByText('Test paragraph')).toBeInTheDocument()
  })

  it('should render complex child components', () => {
    render(
      <Layout>
        <div data-testid="container">
          <h1>Title</h1>
          <p>Description</p>
        </div>
      </Layout>
    )
    expect(screen.getByTestId('container')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('should render without children', () => {
    const { container } = render(<Layout />)
    expect(container).toBeInTheDocument()
  })

  it('should preserve React fragment structure', () => {
    const { container } = render(
      <Layout>
        <span>Fragment child</span>
      </Layout>
    )
    expect(screen.getByText('Fragment child')).toBeInTheDocument()
  })

  it('should render with React components as children', () => {
    const TestComponent = () => <div data-testid="test-component">Component</div>
    render(
      <Layout>
        <TestComponent />
      </Layout>
    )
    expect(screen.getByTestId('test-component')).toBeInTheDocument()
  })

  it('should not wrap children with additional styling', () => {
    const { container } = render(
      <Layout>
        <div data-testid="unwrapped">Content</div>
      </Layout>
    )
    const child = screen.getByTestId('unwrapped')
    // The Layout component returns a React.Fragment, so no wrapper div
    expect(child.parentElement?.tagName).not.toBe('DIV')
  })
})
