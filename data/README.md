# PantryPal AI Data Directory

This directory contains sample data, test fixtures, and data assets used throughout the PantryPal AI project.

## 📁 Directory Structure

### `sample-enhancements/` - Sample Enhancement Data
Contains example recipe enhancement data used for testing and development:
- JSON files with scraped recipe enhancements
- Sample data for AI enhancement system testing
- Reference data for enhancement categorization

## 📊 Data Types

### Recipe Enhancement Data
Enhancement data follows this structure:
```json
{
  "recipe_title": "Recipe Name",
  "source_url": "https://example.com/recipe",
  "scraped_date": "2025-01-06T12:00:00.000Z",
  "enhancements": [
    "Enhancement suggestion 1",
    "Enhancement suggestion 2"
  ],
  "categorized_enhancements": {
    "healthier": ["Health-focused suggestions"],
    "faster": ["Time-saving suggestions"],
    "tastier": ["Flavor-enhancing suggestions"],
    "other": ["General suggestions"]
  }
}
```

### Enhancement Categories

**Healthier Enhancements**
- Air fryer alternatives
- Reduced oil/fat suggestions
- Nutritional improvements
- Ingredient substitutions

**Faster Enhancements**
- Time-saving techniques
- Prep shortcuts
- Cooking method optimizations
- Make-ahead suggestions

**Tastier Enhancements**
- Seasoning improvements
- Cooking technique refinements
- Flavor combinations
- Presentation tips

**Other Enhancements**
- General cooking tips
- Storage suggestions
- Equipment recommendations
- Serving suggestions

## 🔧 Usage

### In Development
Sample data is used for:
- Testing enhancement algorithms
- UI component development
- Database schema validation
- API endpoint testing

### In Testing
- Unit test fixtures
- Integration test data
- Performance testing datasets
- User acceptance testing scenarios

## 📝 Data Guidelines

### Adding New Sample Data
When adding new sample data:

1. **Follow naming conventions**
   - Use descriptive filenames
   - Include date if relevant
   - Use lowercase with underscores

2. **Validate data structure**
   - Ensure JSON is valid
   - Follow established schema
   - Include all required fields

3. **Document data source**
   - Include source URL if scraped
   - Add creation date
   - Note any special characteristics

### Data Quality Standards
- All JSON files must be valid
- Required fields must be present
- Enhancement categories should be properly classified
- URLs should be accessible and valid

## 🛡️ Data Privacy

### Scraped Data
- Only publicly available recipe data
- Respect robots.txt and terms of service
- Include proper attribution
- Remove any personal information

### User Data
- No real user data in this directory
- Use anonymized or synthetic data for testing
- Follow GDPR and privacy guidelines

## 🔄 Data Maintenance

### Regular Tasks
- Validate JSON structure
- Check for broken URLs
- Update outdated enhancement categories
- Remove deprecated data formats

### Data Refresh
Sample data should be refreshed when:
- Enhancement categories change
- New data formats are introduced
- Testing requirements evolve
- Real-world data patterns shift

## 📊 Data Statistics

Current sample data includes:
- Recipe enhancement examples
- Multiple enhancement categories
- Various recipe types and cuisines
- Different data sources and formats

## 🚀 Integration

### With Scripts
Data in this directory is used by:
- Enhancement processing scripts
- Database population scripts
- Testing and validation scripts
- Data migration utilities

### With Application
- Development environment seeding
- Feature testing and validation
- UI component demonstration
- API response examples

## 📞 Support

For data-related questions:
1. Check data format documentation
2. Validate against schema requirements
3. Review enhancement categorization guidelines
4. Consult main project documentation

---

*This directory supports the development and testing of PantryPal AI's recipe enhancement features.*
