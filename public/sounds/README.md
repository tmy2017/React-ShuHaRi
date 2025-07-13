# Sound Effects for Final Fantasy-Style Buttons

This directory contains sound effects for the FF-style button animations. The application will automatically generate synthetic sounds if audio files are not present.

## Expected Sound Files

- `button-hover.mp3` - Played when hovering over buttons
- `button-click.mp3` - Played when clicking buttons
- `button-success.mp3` - Played for successful actions (save, add)
- `button-error.mp3` - Played for destructive actions (delete)
- `button-magic.mp3` - Played for special effects (sparkle buttons)

## Synthetic Sound Generation

If audio files are not found, the application will automatically generate synthetic sounds using the Web Audio API:

- **Hover**: Soft 800Hz sine wave with exponential decay
- **Click**: Sharp 1200Hz sine wave with quick decay
- **Success**: Rising frequency sweep (600-1000Hz) with gentle decay
- **Error**: Falling frequency sweep (400-200Hz) with medium decay
- **Magic**: Dual-tone (1000Hz + 1500Hz) with slow decay

## Adding Custom Sounds

To add custom sound effects:

1. Place MP3 files in this directory with the exact names listed above
2. Ensure files are optimized for web (small file size, appropriate bitrate)
3. Test that sounds are appropriate length (0.1-0.5 seconds recommended)

## Volume and Accessibility

- All sounds respect the master volume setting
- Sounds can be muted via the audio manager
- Reduced motion preferences disable sound effects
- Sounds are designed to be subtle and non-intrusive
