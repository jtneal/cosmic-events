classDiagram
    class Event {
        +string id
        +string title
        +string subtitle
        +string description
        +Date startDate
        +Date endDate
        +string location
        +number price
        +string type
        +string userId
        +bool isActive
        +bool isPublished
        +string image
        +string marketingPoster
        +string organizerName
        +string organizerUrl
        +string purchaseLink
        +string website
        +Panel[] panels
        +Speaker[] speakers
    }

    class Panel {
        +string id
        +string title
        +string description
        +string userId
        +Event event
    }

    class Speaker {
        +string id
        +string name
        +string title
        +string description
        +string image
        +string userId
        +Event event
    }

    class EventService {
        +incrementImpressions(filters: EventFilters)
        +incrementViews(eventId: string)
        +incrementOrganizerUrlClicks(eventId: string)
        +incrementPurchaseLinkClicks(eventId: string)
        +incrementWebsiteClicks(eventId: string)
        +incrementEventClicks(eventId: string)
        +getEvents(filters: EventFilters)
        +getEvent(eventId: string)
        +getUserEvents(userId: string)
        +getUserEvent(userId: string, eventId: string)
        +postEvent(userId: string, event: Event)
        +deleteEvent(userId: string, eventId: string)
    }

    Event "1" -- "many" Panel : has
    Event "1" -- "many" Speaker : has
    Panel "many" -- "1" Event : references
    Speaker "many" -- "1" Event : references
    EventService ..> Event : operates on
    EventService ..> Panel : operates on
    EventService ..> Speaker : operates on
