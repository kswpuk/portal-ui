import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi, beforeEach } from "vitest"
import DownloadCalendarButton from "./DownloadCalendarButton"
import { saveAs } from "file-saver"

vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}))

describe("DownloadCalendarButton", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the button with expected label", () => {
    const mockEvent = {
      name: "Camp Weekend",
      description: "Annual scouting camp weekend in the forest.",
      startDate: "2026-09-01T10:00:00Z",
      endDate: "2026-09-03T16:00:00Z",
      locationType: "physical" as const,
      location: "Scout Campsite",
      postcode: "AB12 3CD",
      eventSeriesId: "series-123",
      eventId: "event-456",
    }

    render(<DownloadCalendarButton event={mockEvent} />)

    expect(screen.getByRole("button", { name: /add to calendar/i })).toBeInTheDocument()
  })

  it("generates correct .ics content with built event URL and series description", async () => {
    const mockEvent = {
      name: "Social Gathering",
      description: "A fun gathering for team members.",
      startDate: "2026-10-15T18:00:00Z",
      endDate: "2026-10-15T21:00:00Z",
      locationType: "physical" as const,
      location: "Town Hall",
      postcode: "XY1 2AB",
      eventSeriesId: "socials-1",
      eventId: "instance-99",
    }

    render(<DownloadCalendarButton event={mockEvent} />)

    const button = screen.getByRole("button", { name: /add to calendar/i })
    fireEvent.click(button)

    expect(saveAs).toHaveBeenCalledTimes(1)
    const [blob, filename] = vi.mocked(saveAs).mock.calls[0]
    expect(filename).toBe("Social_Gathering.ics")

    const blobText = await (blob as Blob).text()
    expect(blobText).toContain("BEGIN:VCALENDAR")
    expect(blobText).toContain("PRODID:-//KSWP//Portal//EN")
    expect(blobText).toContain("SUMMARY:Social Gathering")
    expect(blobText).toContain("DESCRIPTION:A fun gathering for team members.\\n\\nPlease check the Portal for allocation status and the latest event details.")
    expect(blobText).toContain("DTSTART:20261015T180000Z")
    expect(blobText).toContain("DTEND:20261015T210000Z")
    expect(blobText).toContain("LOCATION:Town Hall, XY1 2AB")
    expect(blobText).toContain(`URL:${window.location.origin}/events/socials-1/instance-99`)
    expect(blobText).toContain("END:VCALENDAR")
  })

  it("handles description fallback when event series description is missing", async () => {
    const mockEvent = {
      name: "Online Planning Meeting",
      startDate: "2026-11-01T19:00:00Z",
      endDate: "2026-11-01T20:00:00Z",
      locationType: "virtual" as const,
      location: "Microsoft Teams",
      postcode: "",
      eventSeriesId: "series-abc",
      eventId: "event-xyz",
    }

    render(<DownloadCalendarButton event={mockEvent} />)

    fireEvent.click(screen.getByRole("button", { name: /add to calendar/i }))

    expect(saveAs).toHaveBeenCalledTimes(1)
    const [blob, filename] = vi.mocked(saveAs).mock.calls[0]
    expect(filename).toBe("Online_Planning_Meeting.ics")

    const blobText = await (blob as Blob).text()
    expect(blobText).toContain("LOCATION:Microsoft Teams")
    expect(blobText).toContain("DESCRIPTION:Please check the Portal for allocation status and the latest event details.")
    expect(blobText).toContain(`URL:${window.location.origin}/events/series-abc/event-xyz`)
  })
})
