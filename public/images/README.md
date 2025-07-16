# Food Images Directory

## Instructions for Adding Your Food Images

1. **Add your food images to this directory** (`public/images/`)
2. **Name them as follows**:
   - `food1.png` - Your first food image
   - `food2.png` - Your second food image  
   - `food3.png` - Your third food image
   - `food4.png` - Your fourth food image
   - `food5.png` - Your fifth food image

3. **Recommended image specifications**:
   - **Format**: PNG with transparent background (preferred) or JPG
   - **Size**: 200x200 pixels to 400x400 pixels
   - **File size**: Under 100KB each for optimal performance
   - **Background**: Transparent or white background works best

4. **Current implementation**:
   - Images will float and animate across the authentication pages
   - They have a subtle red drop shadow to match the theme
   - Opacity is set to 30% so they don't interfere with the form
   - Each image has different animation timing for natural movement

## Alternative: Using Your Specific Image

If you want to use your specific dark oval food image, you can:

1. **Save your image as** `food1.png` in this directory
2. **Duplicate it** as `food2.png`, `food3.png`, etc. (or use different food images)
3. **The system will automatically use them**

## Customization Options

You can customize the floating food images by modifying the `FloatingFoodImages` component in:
- `src/app/(auth)/signup/page.tsx`
- `src/app/(auth)/login/page.tsx`

### Available customizations:
- **Position**: Change `left` and `top` percentages
- **Size**: Modify `w-16 h-16` classes (current: 64x64px)
- **Opacity**: Change `opacity-30` class
- **Animation**: Modify `animate` and `transition` properties
- **Drop shadow**: Adjust the `filter` style property
