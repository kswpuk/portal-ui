//// Applications

interface ApplicationHead {
  /**
   * First name of the applicant
   */
  firstName: string

  /**
   * Surname of the applicant
   */
  surname: string
}

interface Application extends ApplicationHead {
  /**
   * Membership number of the applicant
   */
  membershipNumber: string

  /**
   * Date of birth of the applicant, in YYYY-MM-DD format
   */
  dateOfBirth: string

  /**
   * E-mail address of the applicant
   */
  email: string

  /**
   * Telephone number of the applicant
   */
  telephone: string

  /**
   * Address of the applicant
   */
  address: string

  /**
   * Postcode of the applicant
   */
  postcode: string

  /**
   * The date the applicant received their QSA or KSA, in YYYY-MM format
   */
  qsaReceived: string

  /**
   * The timestamp that the application was submitted, as a Unix timestamp (seconds)
   */
  submittedAt: number
}

interface ApplicationWithStatus extends Application {
  /**
   * Status of the application
   */
  applicationStatus: ApplicationReferenceStatus
}

type ReferenceStatus = "SUBMITTED" | "ACCEPTED" | null

interface ApplicationReferenceStatus {
  /**
   * Whether a reference where the referree has known the applicant for more than 5 years has been submitted, accepted, or not yet received (null)
   */
  fiveYears: ReferenceStatus

  /**
   * Whether a Scouting reference has been submitted, accepted, or not yet received (null)
   */
  scouting: ReferenceStatus

  /**
   * Whether a Non-Scouting reference has been submitted, accepted, or not yet received (null)
   */
  nonScouting: ReferenceStatus
}

interface ApplicationStatus {
  /**
   * Membership number of the applicant
   */
  membershipNumber: string

  /**
   * The timestamp that the application was submitted, as a Unix timestamp (seconds)
   */
  submittedAt: number

  /**
   * Status of references
   */
  status: ApplicationReferenceStatus
}

interface Reference {
  /**
   * Name of the referee
   */
  referenceName: string
  
  /**
   * E-mail address of the referee
   */
  referenceEmail: string
  
  /**
   * Whether the referee knows the applicant through Scouting or outside of Scouting
   */
  relationship?: "scouting" | "nonScouting"
  
  /**
   * How long the referee has known the applicant
   */
  howLong?: "lessThan5" | "moreThan5"
  
  /**
   * The timestamp that the reference was submitted, as a Unix timestamp (seconds)
   */
  submittedAt?: number
  
  /**
   * Whether the reference has been accepted (true) or not (false or null)
   */
  accepted?: boolean
}

interface ReferenceDetail extends Reference {
  /**
   * The capacity in which the referee knows the applicant
   */
  capacityKnown: string

  /**
   * Statement of support from the referee
   */
  statementOfSupport: string

  /**
   * If the referee knows any reason why the applicant should _not_ be considered.
   * True means the referee has concerns, false means they have no concerns.
   */
  notConsidered: boolean

  /**
   * Maturity level (1-5)
   */
  maturity: number

  /**
   * Responsibility level (1-5)
   */
  responsibility: number

  /**
   * Self Motivation level (1-5)
   */
  selfMotivation: number

  /**
   * Ability to motivate others level (1-5)
   */
  motivateOthers: number

  /**
   * Commitment level (1-5)
   */
  commitment: number

  /**
   * Trustworthiness level (1-5)
   */
  trustworthiness: number

  /**
   * Ability to Work with Adults level (1-5)
   */
  workWithAdults: number

  /**
   * Respect for Others level (1-5)
   */
  respectForOthers: number
}

//// Events

// TODO: Can we simplify types, as there's a lot of repeated stuff!

type EventType = "event" | "social" | "no_impact"
type EventLocationType = "physical" | "virtual"
type AllocationStatus = "REGISTERED" | "ALLOCATED" | "RESERVE" | "DROPPED_OUT" | "ATTENDED" | "NO_SHOW" | "NOT_ALLOCATED" // TODO: Use an enum, and then replace usage of the constants with the enum
type AttendanceCriteria = "active" | "over25" | "under25"
type EventWeighting = "under_25" | "over_25" | "joined_1yr" | "joined_2yr" | "joined_3yr" | "joined_5yr" | "attended" | "attended_1yr" | "attended_2yr" | "attended_3yr" | "attended_5yr" | "droppedout_6mo" | "droppedout_1yr" | "droppedout_2yr" | "droppedout_3yr" | "noshow_6mo" | "noshow_1yr" | "noshow_2yr" | "noshow_3yr"
type PayableTo =  "_qswp" | "_organiser"

interface EventListItem {
  /**
   * Event Instance ID
   */
  eventId: string

  /**
   * Event Series ID
   */
  eventSeriesId: string

  /**
   * Combined Event Series and Event Instance IDs, separated by a forward slash
   */
  combinedEventId: string

  /**
   * The name of the event, taken from the Event Series
   */
  name: string

  /**
   * A description of the event, taken from the Event Series
   */
  description: string

  /**
   * The event type
   */
  type: EventType

  /**
   * The registration deadline, YYYY-MM-DD format
   */
  registrationDate: string

  /**
   * The start datetime of the event, YYYY-MM-DD'T'hh:mm:ss format
   */
  startDate: string

  /**
   * The end datetime of the event, YYYY-MM-DD'T'hh:mm:ss format
   */
  endDate: string

  /**
   * Whether the event is physical or virtual
   */
  locationType: EventLocationType

  /**
   * The location of the event
   */
  location: string

  /**
   * The location postcode
   */
  postcode: string

  /**
   * The current user's allocation status for this event
   */
  allocation: AllocationStatus | null
}

interface EventSeriesListItem {
  /**
   * ID of the event series
   */
  eventSeriesId: string

  /**
   * Description of the event series
   */
  description: string

  /**
   * Display name of the event series
   */
  name: string

  /**
   * Event type
   */
  type: EventType
}

interface EventSeriesDetailedListItem extends EventSeriesListItem {
  /**
   * Instances within an event series
   */
  instances: {
    /**
     * Instance ID
     */
    eventId: string

    /**
     * Event Series ID
     */
    eventSeriesId: string

    /**
     * The start datetime of the event, YYYY-MM-DD'T'hh:mm:ss format
     */
    startDate: string

    /**
     * The end datetime of the event, YYYY-MM-DD'T'hh:mm:ss format
     */
    endDate: string

    /**
     * Whether the event is physical or virtual
     */
    locationType: EventLocationType

    /**
     * The location of the event
     */
    location: string

    /**
     * The location postcode
     */
    postcode: string
  }[]
}

interface EligibilityRule {
  /**
   * Name of the rule
   */
  id: string

  /**
   * Whether the current member passes this eligibility rule or not
   */
  passed: boolean
}

interface EventAllocationBase {
  /** Combined Event Series and Event Instance ID */
  combinedEventId: string

  /** Membership Number */
  membershipNumber: string

  /** Allocation status */
  allocation: AllocationStatus
}

interface EventAllocation extends EventAllocationBase {
  /** Event name */
  name: string

  /** Event start date and time, in ISO format */
  startDate: string
}

interface EventDetailsAllocation {
  /** Membership Number */
  membershipNumber: string

  /** Allocation status */
  allocation: AllocationStatus

  /** Member's first name */
  firstName: string

  /** Member's preferred name */
  preferredName: string

  /** Member's surname */
  surname: string

  /** Member's e-mail address */
  email?: string

  /** True if the member has already received a necker */
  receivedNecker?: boolean
}

interface EventBody {
  /** Event type */
  type: EventType

  /** Event Name (from Event Series) */
  name: string

  /** Event Description (from Event Series) */
  description: string

  /** Event Details (specific to this instance) */
  details: string

  /** Event URL */
  eventUrl: string

  /** Location name */
  location: string

  /** Location postcode */
  postcode: string

  /** Location type */
  locationType: EventLocationType

  /** Registration deadline (YYYY-MM-DD) */
  registrationDate: string

  /** Event start date, in ISO format */
  startDate: string

  /** Event end date, in ISO format */
  endDate: string

  /** Cost of attending the event */
  cost: number

  /** Who any cost would be payable too */
  payee: PayableTo

  /** If true, then allocation is done by payment rather than by other means */
  allocationOnPayment: boolean

  /** List of current allocations for the event */
  allocations: EventDetailsAllocation[]

  /** Attendance limit (0 for none) */
  attendanceLimit: number

  /** Event attendance criteria */
  attendanceCriteria: AttendanceCriteria[]

  /** Weighting criteria for the event - TODO: Make this more explicit*/
  weightingCriteria: {[criteria in EventWeighting]: number}

  /** Current member's eligiibility to attend the event */
  eligibility: {
    /** Whether the member meets all eligibility criteria */
    eligible: boolean

    /** Specific attendance criteria, and whether they met them or not */
    rules: {
      /** Criteria */
      id: AttendanceCriteria

      /** Whether they met the criteria */
      passed: boolean
    }[]
  }
}

interface EventDetails extends EventBody {
    /** Event Series ID */
  eventSeriesId: string

  /** Event Instance ID */
  eventId: string
}

interface EventSeries {
  eventSeriesId: string
  name: string
  description: string
  type: EventType
}

//// Members

type MembershipStatus = "ACTIVE" | "INACTIVE"
type CommitteeRole = "MANAGER" | "EVENTS" | "MONEY" | "MEMBERS" | "PORTAL" | "MEDIA" | "SOCIALS"
type MembershipRole = CommitteeRole | ""

interface MemberName {
  /** Membership number */
  membershipNumber: string

  /** First name */
  firstName: string,

  /** Surname */
  surname: string
}

interface MemberListItem extends MemberName{
  /** Preferred name - if blank, then use their first name */
  preferredName: string

  /** E-mail address */
  email?: string

  /** Member's current age */
  age?: number

  /** Member's current membership status */
  status: MembershipStatus

  /** Member's current role within the KSWP */
  role: MembershipRole

}

interface Member extends MemberName {
  /** Preferred name - if blank, then use their first name */
  preferredName: string

  /** Date of Birth, as YYYY-MM-DD */
  dateOfBirth: string

  /** E-mail address */
  email: string

  /** Telephone number, formatted */
  telephone: string

  /** Postal address, without the postcode */
  address: string

  /** Postcode */
  postcode: string

  /** Full name of emeregency contact */
  emergencyContactName: string

  /** Telephone number of emergency contact, formatted */
  emergencyContactTelephone: string

  /** Any dietary requirements (blank for none) */
  dietaryRequirements: string

  /** Any relevant medical information (blank for none) */
  medicalInformation: string

  /** Whether the member has received a KSWP necker or not */
  receivedNecker: boolean

  /** Nationality */
  nationality: string

  /** Place of Birth */
  placeOfBirth: string

  /** Date the member joined the KSWP, as YYYY-MM-DD */
  joinDate: string

  /** Date the member's current membership expires, as YYYY-MM-DD */
  membershipExpires: string

  /** Member's current membership status */
  status: MembershipStatus

  /** Member's current role within the KSWP */
  role: MembershipRole

  /** If true, then the member is suspended. The member is not suspended otherwise */
  suspended?: boolean

  /** Timestamp (Unix epoch) of when the member last updated their details */
  lastUpdated: number
}

interface MemberComparisonResult {
  membershipNumber: string,
  name: string,
  action: "NONE" | "NONE_GRACE" | "ADD_TO_COMPASS" | "REMOVE_FROM_COMPASS"
}

// Reports

type ReportCount = {[key: string]: number}
type AgeReportCount = {[age in AgeCategories]: number}
type AgeCategories = "UNDER_18" | "18_25" | "25_35" | "35_45" | "45_55" | "55_65" | "OVER_65"

interface EventsReport { 
  /** Stats for events */
  events: EventStats

  /** Stats for socials */
  socials: EventStats
}

interface EventStats {
  /** Date of the next event */
  next: string | null

  /** Number of days until the next event */
  nextDays: number | null

  /** Counts */
  counts: {
    /** Start dates by month */
    startDates: ReportCount

    /** Number of events in the past year */
    pastYear: number

    /** Number of volunteer hours in the past year (rounded) */
    pastYearHours: number

    /** Number of events that were oversubscribed in the past year */
    pastYearOversubscribed: number

    /** Number events by postcode over the past year */
    postcodesPastYear: ReportCount

    /** Number of upcoming events */
    upcoming: number
  }
}

interface EventAttendanceReport {
  /** Number of members who have attended at least this number of days */
  days: {[num: string]: number}

  /** For each allocation status, the number of members who at least this number of events */
  counts: {[status in AllocationStatus]: ReportCount}
}

interface ApplicationsReport {
  /** The number of applications */
  count: number

  counts: {
    /** Number of applications per postcode */
    postcode: ReportCount
  }

  /** Date of the newest (most recent) application */
  newest: string

  /** Days since the newest (most recent) application */
  newestDays: number

  /** Date of the oldest application */
  oldest: string

  /** Days since the oldest application */
  oldestDays: number
}

interface MembersReport {
  /** The number of members */
  count: number

  counts: {
    /** Count of members by status (ACTIVE or INACTIVE) */
    status: ReportCount

    /** Count of members who have been in the KSWP for X years */
    time: ReportCount

    /** Count of members by age category */
    age: AgeReportCount

    /** Count of ACTIVE members by age category */
    ageActive: AgeReportCount

    /** Count of INACTIVE members by age category */
    ageInactive: AgeReportCount

    /** Count of ACTIVE members by postcode */
    postcodesActive: ReportCount
  }

  /** Date the most recent member joined */
  newest: string

  /** Days since the most recent member joined */
  newestDays: number

  /** Date the least recent member joined */
  oldest: string

  /** Days since the least recent member joined */
  oldestDays: number
}