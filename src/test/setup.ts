import '@testing-library/jest-dom'

// jsdom doesn't implement scrollTo
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })
