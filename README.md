# Canary Films Check-In System

A touchscreen-optimized web application for checking in guests at Canary Films premiere events. Designed for use on touchscreen laptops, Raspberry Pi Touch Display 2, or any modern web browser.

## Features

- **Guest List Management**: Load guest lists from customizable JSON template files
- **Check-In Functionality**: Easy one-tap check-in that moves guests from pending to arrived list
- **Search Function**: Quickly find guests by name, email, or company
- **Dual Lists**: Separate views for pending guests and arrived guests
- **Touchscreen Optimized**: Large buttons and touch-friendly interface
- **Persistent Storage**: Guest data is saved locally in browser (survives page refreshes)
- **Real-time Counts**: Live counters showing pending and arrived guest numbers
- **Arrival Timestamps**: Records the exact time each guest checks in

## Getting Started

### Quick Start

1. Open `index.html` in a web browser
2. Click "Load Guest List" and select your guest list JSON file
3. Start checking in guests as they arrive!

### Creating Your Guest List

Use the provided `guest-list-template.json` as a template. The format is:

```json
{
  "event": "Event Name",
  "date": "YYYY-MM-DD",
  "venue": "Venue Name",
  "guests": [
    {
      "name": "Guest Name",
      "email": "guest@example.com",
      "company": "Company Name",
      "partySize": 1
    }
  ]
}
```

**Guest Fields:**
- `name` (required): Full name of the guest
- `email` (optional): Email address
- `company` (optional): Company or organization
- `partySize` (optional): Number of people in party (defaults to 1)

### Customizing for Your Event

1. Copy `guest-list-template.json` to a new file (e.g., `premiere-guests.json`)
2. Update the event details at the top
3. Add your guest list in the `guests` array
4. Save the file and load it in the application

## Using the Application

### Loading Guest List
1. Click the "Load Guest List" button
2. Select your JSON file
3. The pending list will populate with all guests

### Checking In Guests
1. Find the guest in the pending list (or use search)
2. Tap/click the "Check In" button
3. Guest automatically moves to the arrived list with timestamp

### Searching for Guests
1. Type in the search box to filter by name, email, or company
2. Search works across both pending and arrived lists
3. Click "Clear" to reset search

### Switching Views
- Click "Pending" tab to see guests waiting to check in
- Click "Arrived" tab to see guests who have checked in
- Numbers show count in each list

## Technical Details

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Raspberry Pi Chromium browser

### Files
- `index.html` - Main application page
- `style.css` - Styling and touchscreen optimizations
- `app.js` - Application logic and functionality
- `guest-list-template.json` - Example guest list template

### Data Storage
- Guest data is stored in browser's localStorage
- Data persists across page refreshes
- Clear browser data to reset the application

## Deployment

### Local Deployment
Simply open `index.html` in a web browser. No server required.

### Web Hosting
Upload all files to any web server or hosting service:
- GitHub Pages
- Netlify
- Vercel
- Any static file hosting

### Raspberry Pi Setup
1. Install Raspberry Pi OS with Desktop
2. Open Chromium browser
3. Navigate to the application (local file or hosted URL)
4. Press F11 for fullscreen mode
5. Enable touch calibration if needed

## Support

For issues or questions about this check-in system, please refer to the GitHub repository.

## License

Open source - feel free to customize for your events!