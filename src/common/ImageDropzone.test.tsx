import { render, screen, act } from '@testing-library/react'
import { useDropzone } from 'react-dropzone'
import ImageDropzone from './ImageDropzone'

vi.mock('react-dropzone', () => ({
  useDropzone: vi.fn()
}))

// Partial mock: keep real MUI components but stub useTheme to avoid needing ThemeProvider.
vi.mock('@mui/material', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mui/material')>()
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        primary: { dark: '#1565c0', light: '#e3f2fd', contrastText: '#fff' },
        grey: { 500: '#9e9e9e' },
        background: { paper: '#fff' },
        text: { primary: '#000' },
      }
    }),
  }
})

const mockUseDropzone = vi.mocked(useDropzone)

describe('ImageDropzone', () => {
  let capturedOnDrop: ((accepted: File[], rejected: any[]) => void) | undefined

  beforeEach(() => {
    capturedOnDrop = undefined
    mockUseDropzone.mockImplementation(({ onDrop }: any) => {
      capturedOnDrop = onDrop
      return {
        getRootProps: () => ({}),
        getInputProps: () => ({}),
        isDragActive: false,
      } as any
    })
  })

  afterEach(() => vi.clearAllMocks())

  it('shows initial upload instructions when no file is selected', () => {
    render(<ImageDropzone onFileSelected={vi.fn()} />)
    expect(screen.getByText('Drag and drop an image here, or click to select')).toBeInTheDocument()
  })

  it('shows the file size limit hint', () => {
    render(<ImageDropzone onFileSelected={vi.fn()} />)
    expect(screen.getByText('Maximum file size is 3 megabytes')).toBeInTheDocument()
  })

  it('shows "Drop your image here" while a file is being dragged over', () => {
    mockUseDropzone.mockImplementation(({ onDrop }: any) => {
      capturedOnDrop = onDrop
      return { getRootProps: () => ({}), getInputProps: () => ({}), isDragActive: true } as any
    })
    render(<ImageDropzone onFileSelected={vi.fn()} />)
    expect(screen.getByText('Drop your image here')).toBeInTheDocument()
  })

  it('calls onFileSelected and shows a success alert when a valid file is dropped', () => {
    const onFileSelected = vi.fn()
    render(<ImageDropzone onFileSelected={onFileSelected} />)

    const file = new File(['image content'], 'photo.jpg', { type: 'image/jpeg' })
    act(() => capturedOnDrop!([file], []))

    expect(onFileSelected).toHaveBeenCalledWith(file)
    expect(screen.getByText(/photo\.jpg/)).toBeInTheDocument()
  })

  it('shows "Drag and drop a different image" after a file has been selected', () => {
    render(<ImageDropzone onFileSelected={vi.fn()} />)
    act(() => capturedOnDrop!([new File([''], 'photo.jpg', { type: 'image/jpeg' })], []))
    expect(screen.getByText('Drag and drop a different image here, or click to select')).toBeInTheDocument()
  })

  it('shows an error alert when a file is rejected', () => {
    render(<ImageDropzone onFileSelected={vi.fn()} />)
    act(() => capturedOnDrop!([], [{ errors: [{ message: 'File is too large' }] }]))
    expect(screen.getByText('File is too large')).toBeInTheDocument()
  })

  it('clears the error when a valid file is subsequently dropped', () => {
    render(<ImageDropzone onFileSelected={vi.fn()} />)
    act(() => capturedOnDrop!([], [{ errors: [{ message: 'File is too large' }] }]))
    expect(screen.getByText('File is too large')).toBeInTheDocument()
    act(() => capturedOnDrop!([new File([''], 'good.jpg', { type: 'image/jpeg' })], []))
    expect(screen.queryByText('File is too large')).not.toBeInTheDocument()
  })
})
