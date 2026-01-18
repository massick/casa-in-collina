# Casa in Collina - Rental Website

A modern, static website for a vacation rental property near Cesena, Italy. Built with Vite, Tailwind CSS, and deployed on Netlify.

## Features

- ✨ **Beautiful Homepage** with image carousel showcasing the property
- 📅 **Integrated Calendar** with real-time availability synced from Booking.com and Airbnb via iCal
- 📍 **Things to Do** page highlighting nearby attractions in Romagna region
- 📧 **Contact Form** integrated with Netlify Forms
- 🏠 **Booking Request Form** accessible from every page
- 📱 **Fully Responsive** design that works on all devices
- 🚀 **No Backend Required** - completely static site with Netlify Functions for iCal sync
- 🌐 **Italian Language** optimized for local audience

## Tech Stack

- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Carousel**: Swiper.js
- **Calendar**: FullCalendar with iCalendar plugin
- **Forms**: Netlify Forms (serverless)
- **Functions**: Netlify Functions (for iCal proxy)
- **Hosting**: Netlify

## Project Structure

```
casa-in-collina/
├── public/
│   └── images/              # Property images
│       ├── house-1.jpg
│       ├── house-2.jpg
│       ├── house-3.jpg
│       └── ...
├── src/
│   ├── main.js             # Main JavaScript file
│   └── style.css           # Tailwind CSS styles
├── netlify/
│   └── functions/
│       └── fetch-ical.js   # iCal proxy function
├── index.html              # Homepage
├── things-to-do.html       # Activities and attractions page
├── contact.html            # Contact page
├── netlify.toml            # Netlify configuration
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Property Images

Add your property images to the `public/images/` directory. You'll need:

**Homepage carousel:**
- `house-1.jpg` - Main exterior view
- `house-2.jpg` - Interior view
- `house-3.jpg` - Panoramic view
- `house-4.jpg` - Garden view

**Things to Do page:**
- `cesena.jpg`
- `ravenna.jpg`
- `forli.jpg`
- `cesenatico.jpg`
- `rimini.jpg`
- `sanmarino.jpg`

**Recommended image dimensions:** 1920x1080px (16:9 ratio) for best results.

### 3. Configure iCal Synchronization

To sync availability from Booking.com and Airbnb:

1. **Get your iCal URLs:**
   - **Airbnb**: Go to Calendar > Availability settings > Export calendar
   - **Booking.com**: Go to Calendar > Sync calendars > Export

2. **Add to Netlify Environment Variables:**
   - Go to your Netlify site dashboard
   - Navigate to: Site settings > Build & Deploy > Environment variables
   - Add these variables:
     - `AIRBNB_ICAL_URL`: Your Airbnb iCal export URL
     - `BOOKING_ICAL_URL`: Your Booking.com iCal export URL

### 4. Customize Content

Edit the HTML files to add your specific information:

- **Contact details** in `contact.html` (email, phone, address)
- **Property description** in `index.html`
- **Social media links** in the footer
- **Any specific amenities or rules**

### 5. Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### 7. Deploy to Netlify

#### Option A: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

#### Option B: Deploy via Git

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://www.netlify.com/)
3. Click "New site from Git"
4. Connect your repository
5. Set build command: `npm run build`
6. Set publish directory: `dist`
7. Add environment variables for iCal URLs
8. Deploy!

## Netlify Forms Setup

Forms are automatically handled by Netlify. When a form is submitted:

1. Data is stored in your Netlify dashboard (Forms section)
2. You'll receive email notifications (configure in Netlify settings)
3. You can set up integrations with Slack, Zapier, etc.

**Available forms:**
- **Booking Request** (form name: `booking`)
- **Contact Form** (form name: `contact`)

To receive email notifications:
1. Go to Site settings > Forms > Form notifications
2. Add your email address

## Calendar Synchronization

The calendar automatically syncs with your Booking.com and Airbnb calendars every hour (due to caching). Booked dates will appear as unavailable.

**Important notes:**
- iCal sync is one-way (from Airbnb/Booking.com to your website)
- Updates may take up to 1 hour due to caching
- Bookings made through your website form are manual requests (not instant bookings)

## Customization

### Colors

Edit `tailwind.config.js` to change the primary color scheme:

```js
colors: {
  primary: {
    // Change these values
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  }
}
```

### Carousel Settings

Edit carousel behavior in `src/main.js`:

```js
autoplay: {
  delay: 5000, // Change slide delay
  disableOnInteraction: false,
}
```

### Minimum Stay

Adjust minimum stay requirement in `src/main.js`:

```js
if (daysDiff < 2) { // Change minimum nights
  alert('Il soggiorno minimo è di 2 notti');
}
```

## SEO Optimization

To improve search engine visibility:

1. **Add meta tags** to each HTML file
2. **Create a sitemap**: Use [Netlify Plugin Sitemap](https://github.com/netlify/netlify-plugin-sitemap)
3. **Add Google Analytics**: Add tracking code to HTML files
4. **Optimize images**: Compress images before uploading
5. **Add robots.txt** in the `public/` folder

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Calendar not loading
- Check that environment variables are set in Netlify
- Verify iCal URLs are correct and accessible
- Check browser console for errors

### Forms not working
- Ensure form has `data-netlify="true"` attribute
- Verify form name matches in hidden input field
- Check Netlify Forms dashboard for submissions

### Images not displaying
- Verify image files are in `public/images/` directory
- Check file names match exactly (case-sensitive)
- Ensure images are web-optimized (JPEG/PNG)

## Support

For questions or issues:
- Create an issue on GitHub
- Contact: info@casaincollina.it

## License

© 2026 Casa in Collina. All rights reserved.

---

## Next Steps After Deployment

1. ✅ Test all forms on the live site
2. ✅ Verify calendar is syncing correctly
3. ✅ Add Google Analytics tracking
4. ✅ Submit sitemap to Google Search Console
5. ✅ Set up Netlify form notifications
6. ✅ Add custom domain (if not using netlify.app subdomain)
7. ✅ Enable HTTPS (automatic with Netlify)
8. ✅ Test on multiple devices and browsers
9. ✅ Share on social media
10. ✅ Add Google My Business listing

Good luck with your vacation rental! 🏡
