import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { saveAs } from 'file-saver'
import ExportDataCsvButton from './ExportDataCsvButton'

vi.mock('file-saver', () => ({ saveAs: vi.fn() }))

const mockData = [
  { name: 'Alice', age: 30, city: 'London' },
  { name: 'Bob', age: 25, city: 'Manchester' },
]

describe('ExportDataCsvButton', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders an Export button by default', () => {
    render(<ExportDataCsvButton data={mockData} />)
    expect(screen.getByRole('button', { name: /Export/i })).toBeInTheDocument()
  })

  it('renders an icon button when iconButton prop is true', () => {
    render(<ExportDataCsvButton data={mockData} iconButton />)
    expect(screen.getByRole('button', { name: /Export/i })).toBeInTheDocument()
  })

  it('calls saveAs with the given filename on click', async () => {
    const user = userEvent.setup()
    render(<ExportDataCsvButton data={mockData} filename="members" />)
    await user.click(screen.getByRole('button', { name: /Export/i }))
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'members.csv')
  })

  it('defaults to "export.csv" when no filename is provided', async () => {
    const user = userEvent.setup()
    render(<ExportDataCsvButton data={mockData} />)
    await user.click(screen.getByRole('button', { name: /Export/i }))
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'export.csv')
  })

  it('generates CSV with correct headers and row data', async () => {
    const user = userEvent.setup()
    render(<ExportDataCsvButton data={mockData} filename="test" />)
    await user.click(screen.getByRole('button', { name: /Export/i }))

    const blob = vi.mocked(saveAs).mock.calls[0][0] as Blob
    const text = await blob.text()
    expect(text).toContain('name,age,city')
    expect(text).toContain('Alice,30,London')
    expect(text).toContain('Bob,25,Manchester')
  })

  it('wraps string values containing commas in double quotes', async () => {
    const user = userEvent.setup()
    const data = [{ name: 'Smith, John', score: 42 }]
    render(<ExportDataCsvButton data={data} />)
    await user.click(screen.getByRole('button', { name: /Export/i }))

    const blob = vi.mocked(saveAs).mock.calls[0][0] as Blob
    const text = await blob.text()
    expect(text).toContain('"Smith, John"')
  })
})
