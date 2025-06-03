const fs = require('fs');
const path = require('path');
const blogData = require('../blog_data.json');

describe('Blog posts', () => {
  test('all referenced post files exist', () => {
    blogData.forEach(post => {
      const filePath = path.join(__dirname, '..', post.file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
