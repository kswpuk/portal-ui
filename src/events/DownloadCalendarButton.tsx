import { CalendarMonth } from "@mui/icons-material"
import { Button } from "@mui/material"
import { saveAs } from "file-saver"
import moment from "moment"

interface EventForCalendar {
  name: string
  description?: string
  startDate: string
  endDate: string
  locationType: EventLocationType
  location: string
  postcode?: string
  eventSeriesId?: string
  eventId?: string
}

interface DownloadCalendarButtonProps {
  event: EventForCalendar
  variant?: "text" | "outlined" | "contained"
  fullWidth?: boolean
}

export default function DownloadCalendarButton({ event, variant = "outlined", fullWidth }: DownloadCalendarButtonProps) {
  const handleDownload = () => {
    const start = moment(event.startDate).utc().format("YYYYMMDDTHHmmss[Z]")
    const end = moment(event.endDate).utc().format("YYYYMMDDTHHmmss[Z]")

    let locationText = event.location || ""
    if (event.locationType === "physical" && event.postcode) {
      locationText = locationText ? `${locationText}, ${event.postcode}` : event.postcode
    }

    const urlText = event.eventSeriesId && event.eventId
      ? `https://portal.kswp.org.uk/events/${event.eventSeriesId}/${event.eventId}`
      : "https://portal.kswp.org.uk/"

    const staticNotice = "Please check the Portal for allocation status and the latest event details."
    const rawDescription = event.description ? `${event.description}\n\n${staticNotice}` : staticNotice
    const descriptionText = rawDescription
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r?\n/g, "\\n")

    // Build iCalendar RFC 5545 string
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//KSWP//Portal//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `SUMMARY:${event.name.replace(/\n/g, " ")} (KSWP Event)`,
      `DESCRIPTION:${descriptionText}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      locationText ? `LOCATION:${locationText.replace(/\n/g, " ")}` : null,
      urlText ? `URL:${urlText}` : null,
      "END:VEVENT",
      "END:VCALENDAR"
    ]
      .filter(Boolean)
      .join("\r\n")

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const safeFilename = event.name.replace(/[^a-zA-Z0-9_-]/g, "_")
    saveAs(blob, `${safeFilename || "event"}.ics`)
  }

  return (
    <Button
      startIcon={<CalendarMonth />}
      variant={variant}
      fullWidth={fullWidth}
      onClick={handleDownload}
    >
      Add to Calendar
    </Button>
  )
}
