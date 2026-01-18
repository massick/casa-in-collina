# Image Placeholder Directory

This directory should contain all images for your vacation rental website.

## Required Images

### Homepage Carousel (1920x1080px recommended)
- `house-1.jpg` - Main exterior view of the property
- `house-2.jpg` - Beautiful interior shot (living room or bedroom)
- `house-3.jpg` - Panoramic countryside view
- `house-4.jpg` - Garden or outdoor area

### Things to Do Page (1200x800px recommended)
- `cesena.jpg` - Cesena city center or Biblioteca Malatestiana
- `ravenna.jpg` - Ravenna mosaics or monuments
- `forli.jpg` - Forlì Piazza Saffi
- `cesenatico.jpg` - Cesenatico harbor
- `rimini.jpg` - Rimini beach or historic center
- `sanmarino.jpg` - San Marino towers view

## Image Guidelines

1. **Format**: Use JPEG for photos (better compression)
2. **Size**: Optimize images for web (target < 500KB per image)
3. **Dimensions**: 
   - Carousel: 1920x1080px (16:9)
   - Activity cards: 1200x800px (3:2)
4. **Quality**: Use 80-85% JPEG quality for good balance

## Tools for Image Optimization

### Online Tools
- [TinyPNG](https://tinypng.com/) - PNG/JPEG compression
- [Squoosh](https://squoosh.app/) - Advanced image optimization
- [ImageOptim](https://imageoptim.com/) - Mac app for optimization

### Command Line (ImageMagick)
```bash
# Resize and optimize
convert input.jpg -resize 1920x1080 -quality 85 output.jpg
```

## Temporary Placeholders

While gathering your real photos, you can use:
- [Unsplash](https://unsplash.com/) - Free high-quality photos
- [Pexels](https://pexels.com/) - Free stock photos
- [Placeholder.com](https://placeholder.com/) - Simple placeholder images

Example placeholder URLs for testing:
- https://images.unsplash.com/photo-1568605114967-8130f3a36994 (house exterior)
- https://images.unsplash.com/photo-1556912167-f556f1f39fdf (modern interior)
- https://images.unsplash.com/photo-1464093515883-ec948246accb (countryside)

## Notes

- Images are loaded from `/images/` path (automatically resolved from `public/images/`)
- All images should be in this directory before building
- Update image alt texts in HTML files for better SEO and accessibility
